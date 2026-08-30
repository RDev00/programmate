import {
  buildAuthorizeUrl,
  isOAuthProvider,
  OAUTH_STATE_COOKIE
} from "@/lib/oauth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;

  if (!isOAuthProvider(provider)) {
    return NextResponse.json({
      message: "Unsupported OAuth provider",
      reason: "Bad request"
    }, { status: 400 });
  }

  const redirectUri = `${request.nextUrl.origin}/api/auth/oauth/callback/${provider}`;
  const state = crypto.randomUUID();

  const authorizeUrl = buildAuthorizeUrl(provider, redirectUri, state);

  const response = NextResponse.redirect(authorizeUrl);

  response.cookies.set(OAUTH_STATE_COOKIE, `${provider}:${state}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/"
  });

  return response;
}
