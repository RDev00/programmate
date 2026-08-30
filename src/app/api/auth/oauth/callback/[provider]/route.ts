import { AUTH_COOKIE, hashPassword, signAuthToken } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { createClerkUser } from "@/lib/clerk";
import {
  exchangeCodeForToken,
  fetchOAuthProfile,
  isOAuthProvider,
  OAUTH_STATE_COOKIE
} from "@/lib/oauth";
import { OAuthAccount, OAuthProviderName, Users } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

function failureRedirect(request: NextRequest, reason: string): NextResponse {
  const url = new URL("/signin", request.nextUrl.origin);
  url.searchParams.set("error", reason);
  return NextResponse.redirect(url);
}

function sanitizeUsername(base: string): string {
  const cleaned = base.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 28);

  if (cleaned.length >= 3) {
    return cleaned;
  }

  return `user_${cleaned}`;
}

async function generateUsername(db: ReturnType<typeof supabase>, base: string): Promise<string> {
  const username = sanitizeUsername(base);

  const { data } = await db
    .from("users")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (!data) {
    return username;
  }

  return `${username}${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;

  if (!isOAuthProvider(provider)) {
    return failureRedirect(request, "unsupported_provider");
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const stateCookie = request.cookies.get(OAUTH_STATE_COOKIE)?.value;

  if (!code || !state || !stateCookie || stateCookie !== `${provider}:${state}`) {
    return failureRedirect(request, "invalid_state");
  }

  try {
    const redirectUri = `${request.nextUrl.origin}/api/auth/oauth/callback/${provider}`;
    const accessToken = await exchangeCodeForToken(provider, code, redirectUri);
    const profile = await fetchOAuthProfile(provider, accessToken);

    const db = supabase();
    const now = new Date().toISOString();

    const { data: existing } = await db
      .from("users")
      .select()
      .eq("email", profile.email)
      .maybeSingle();

    let user: Users;

    if (existing) {
      const accounts: OAuthAccount[] = existing.oauth_providers ?? [];
      const connected = accounts.some(
        (a) => a.provider === provider && a.provider_account_id === profile.provider_account_id
      );

      if (!connected) {
        accounts.push({
          provider: provider as OAuthProviderName,
          provider_account_id: profile.provider_account_id,
          connected_at: now
        });

        await db
          .from("users")
          .update({ oauth_providers: accounts, signed_at: now })
          .eq("id", existing.id);
      }

      user = existing as Users;
    } else {
      const username = await generateUsername(db, profile.username);
      const randomPassword = crypto.randomUUID() + crypto.randomUUID();

      const { data: created, error } = await db
        .from("users")
        .insert({
          username,
          email: profile.email,
          password: await hashPassword(randomPassword),
          api_keys: [],
          payments: [],
          plan: "free",
          oauth_providers: [
            {
              provider,
              provider_account_id: profile.provider_account_id,
              connected_at: now
            }
          ],
          vaults: [],
          created_at: now,
          signed_at: now
        })
        .select()
        .single();

      if (error || !created) {
        throw new Error(error?.message || "Failed to create OAuth user");
      }

      user = created as Users;

      try {
        await createClerkUser({
          externalId: user.id,
          email: user.email,
          username: user.username
        });
      } catch (clerkError) {
        console.error("Clerk user sync failed:", clerkError);
      }
    }

    const token = signAuthToken({
      sub: user.id,
      username: user.username,
      email: user.email
    });

    const response = NextResponse.redirect(new URL("/", request.nextUrl.origin));

    response.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    });

    response.cookies.delete(OAUTH_STATE_COOKIE);

    return response;
  } catch (e) {
    console.error(`OAuth callback failed for ${provider}:`, e);
    return failureRedirect(request, "oauth_failed");
  }
}
