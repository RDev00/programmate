import { Response } from "@/utils/response";

import { Response as ApiResponse } from "@/utils/response";
import {
  AUTH_COOKIE,
  signAuthToken,
  toPublicUser
} from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getClerkUserByEmail, verifyClerkPassword } from "@/lib/clerk";
import { SignInCredentials, Users } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

function isValidCredentials(body: Partial<SignInCredentials>): body is SignInCredentials {
  return (
    typeof body.email === "string" &&
    typeof body.password === "string" &&
    body.email.length > 0 &&
    body.password.length > 0
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<SignInCredentials>;

    if (!isValidCredentials(body)) {
      return Response.badRequest();
    }

    const { email, password } = body;
    const db = supabase();

    const { data: user } = await db
      .from("users")
      .select()
      .eq("email", email)
      .maybeSingle();

    if (!user) {
      return ApiResponse.unauthorized();
    }

    const clerkUser = await getClerkUserByEmail(email);

    if (!clerkUser) {
      return ApiResponse.unauthorized();
    }

    const valid = await verifyClerkPassword(clerkUser.id, password);

    if (!valid) {
      return Response.unauthorized();
    }

    const now = new Date().toISOString();

    await db.from("users").update({ signed_at: now }).eq("id", user.id);

    const token = signAuthToken({
      sub: user.id,
      username: user.username,
      email: user.email
    });

    const response = NextResponse.json({
      user: toPublicUser(user as Users)
    }, { status: 200 });

    response.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    });

    return response;
  } catch (e) {
    return Response.serverError(e);
  }
}
