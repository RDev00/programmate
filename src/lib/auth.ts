import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthTokenPayload, PublicUser, Users } from "@/types/user";

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "7d";
export const AUTH_COOKIE = "nex0_token";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function signAuthToken(payload: AuthTokenPayload): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }

  return jwt.sign(payload, secret, { expiresIn: TOKEN_EXPIRY });
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded.sub || typeof decoded.username !== "string" || typeof decoded.email !== "string") {
      return null;
    }

    return {
      sub: decoded.sub,
      username: decoded.username,
      email: decoded.email
    };
  } catch {
    return null;
  }
}

export function toPublicUser(user: Users): PublicUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    api_keys: user.api_keys,
    payments: user.payments,
    plan: user.plan,
    oauth_providers: user.oauth_providers,
    vaults: user.vaults,
    created_at: user.created_at,
    signed_at: user.signed_at
  };
}
