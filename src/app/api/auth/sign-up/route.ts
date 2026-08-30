import { Response as ApiResponse } from "@/utils/response";
import { hashPassword, signAuthToken, toPublicUser, AUTH_COOKIE } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { createClerkUser, deleteClerkUser } from "@/lib/clerk";
import { SignUpCredentials, Users } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,32}$/;

function isValidCredentials(body: Partial<SignUpCredentials>): body is SignUpCredentials {
  return (
    typeof body.username === "string" &&
    USERNAME_REGEX.test(body.username) &&
    typeof body.email === "string" &&
    EMAIL_REGEX.test(body.email) &&
    typeof body.password === "string" &&
    body.password.length >= 8
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<SignUpCredentials>;

    if (!isValidCredentials(body)) {
      return ApiResponse.badRequest();
    }

    const { username, email, password } = body;
    const db = supabase();

    const { data: existing } = await db
      .from("users")
      .select("id, email, username")
      .or(`email.eq.${email},username.eq.${username}`)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        message:
          existing.email === email
            ? "Email is already registered"
            : "Username is already taken",
        reason: "Conflict"
      }, { status: 409 });
    }

    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    const clerkUser = await createClerkUser({
      externalId: userId,
      email,
      username,
      password
    });

    try {
      const { data: user, error } = await db
        .from("users")
        .insert({
          id: userId,
          username,
          email,
          password: await hashPassword(password),
          api_keys: [],
          payments: [],
          plan: "free",
          oauth_providers: [],
          vaults: [],
          created_at: now,
          signed_at: now
        })
        .select()
        .single();

      if (error || !user) {
        throw new Error(error?.message || "Failed to create user");
      }

      const token = signAuthToken({
        sub: user.id,
        username: user.username,
        email: user.email
      });

      const response = NextResponse.json({
        user: toPublicUser(user as Users)
      }, { status: 201 });

      response.cookies.set(AUTH_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/"
      });

      return response;
    } catch (dbError) {
      await deleteClerkUser(clerkUser.id);
      throw dbError;
    }
  } catch (e) {
    console.error(e);
    return ApiResponse.serverError(e);
  }
}
