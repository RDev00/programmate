export type Plan = "free" | "starter" | "pro" | "enterprise";

export type ApiKey = {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used_at: string | null;
};

export type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  method: string | null;
  created_at: string;
};

export type OAuthProviderName = "github" | "google" | "gitlab";

export type OAuthAccount = {
  provider: OAuthProviderName;
  provider_account_id: string;
  connected_at: string;
};

export type Vault = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type Users = {
  id: string;
  username: string;
  email: string;
  password: string;
  api_keys: ApiKey[];
  payments: Payment[];
  plan: Plan;
  oauth_providers: OAuthAccount[];
  vaults: Vault[];
  created_at: string;
  signed_at: string | null;
};

export type PublicUser = Omit<Users, "password">;

export type SignUpCredentials = {
  username: string;
  email: string;
  password: string;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type AuthTokenPayload = {
  sub: string;
  username: string;
  email: string;
};
