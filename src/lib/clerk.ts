import { clerkClient } from "@clerk/nextjs/server";

export type ClerkUser = {
  id: string;
  externalId: string | null;
  username: string | null;
  emailAddresses: { id: string; emailAddress: string }[];
};

export async function createClerkUser(params: {
  externalId: string;
  email: string;
  username: string;
  password?: string;
}): Promise<ClerkUser> {
  const client = await clerkClient();

  return client.users.createUser({
    externalId: params.externalId,
    emailAddress: [params.email],
    username: params.username,
    password: params.password,
    skipPasswordChecks: true
  });
}

export async function getClerkUserByEmail(email: string): Promise<ClerkUser | null> {
  const client = await clerkClient();

  const { data } = await client.users.getUserList({
    emailAddress: [email],
    limit: 1
  });

  return data[0] ?? null;
}

export async function verifyClerkPassword(
  clerkUserId: string,
  password: string
): Promise<boolean> {
  const client = await clerkClient();

  const { verified } = await client.users.verifyPassword({
    userId: clerkUserId,
    password
  });

  return verified;
}

export async function deleteClerkUser(clerkUserId: string): Promise<void> {
  const client = await clerkClient();

  await client.users.deleteUser(clerkUserId);
}
