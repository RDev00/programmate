const API_BASE = "https://api.clerk.com/v1";

type ClerkUser = {
  id: string;
  external_id: string | null;
  username: string | null;
  email_addresses: { id: string; email_address: string }[];
};

function secretKey(): string | null {
  return process.env.CLERK_SECRET_KEY ?? null;
}

async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<T | null> {
  const key = secretKey();

  if (!key) {
    return null;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init.headers
    }
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(`Clerk API error (${response.status}): ${reason}`);
  }

  return (await response.json()) as T;
}

export async function createClerkUser(params: {
  externalId: string;
  email: string;
  username: string;
}): Promise<ClerkUser | null> {
  return request<ClerkUser>("/users", {
    method: "POST",
    body: JSON.stringify({
      external_id: params.externalId,
      email_address: [params.email],
      username: params.username,
      skip_password_checks: true,
      skip_password_requirement: true
    })
  });
}

export async function getClerkUserByEmail(email: string): Promise<ClerkUser | null> {
  const users = await request<ClerkUser[]>(
    `/users?email_address=${encodeURIComponent(email)}`
  );

  return users?.[0] ?? null;
}
