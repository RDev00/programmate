import { OAuthProviderName } from "@/types/user";

export const OAUTH_STATE_COOKIE = "nex0_oauth_state";

export const OAUTH_PROVIDERS: OAuthProviderName[] = [
  "google",
  "github",
  "gitlab"
];

export function isOAuthProvider(value: string): value is OAuthProviderName {
  return (OAUTH_PROVIDERS as string[]).includes(value);
}

type OAuthProviderConfig = {
  authorizeUrl: string;
  tokenUrl: string;
  scope: string;
  clientId: () => string | null;
  clientSecret: () => string | null;
};

const PROVIDERS: Record<OAuthProviderName, OAuthProviderConfig> = {
  google: {
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scope: "openid email profile",
    clientId: () => process.env.GOOGLE_CLIENT_ID ?? null,
    clientSecret: () => process.env.GOOGLE_CLIENT_SECRET ?? null
  },
  github: {
    authorizeUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    scope: "read:user user:email",
    clientId: () => process.env.GITHUB_CLIENT_ID ?? null,
    clientSecret: () => process.env.GITHUB_CLIENT_SECRET ?? null
  },
  gitlab: {
    authorizeUrl: "https://gitlab.com/oauth/authorize",
    tokenUrl: "https://gitlab.com/oauth/token",
    scope: "read_user",
    clientId: () => process.env.GITLAB_CLIENT_ID ?? null,
    clientSecret: () => process.env.GITLAB_CLIENT_SECRET ?? null
  }
};

export type OAuthProfile = {
  provider_account_id: string;
  email: string;
  username: string;
};

export function getProviderConfig(provider: OAuthProviderName): OAuthProviderConfig {
  return PROVIDERS[provider];
}

export function buildAuthorizeUrl(
  provider: OAuthProviderName,
  redirectUri: string,
  state: string
): string {
  const config = getProviderConfig(provider);
  const url = new URL(config.authorizeUrl);

  url.searchParams.set("client_id", config.clientId() ?? "");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", config.scope);
  url.searchParams.set("state", state);

  return url.toString();
}

export async function exchangeCodeForToken(
  provider: OAuthProviderName,
  code: string,
  redirectUri: string
): Promise<string> {
  const config = getProviderConfig(provider);

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    body: new URLSearchParams({
      code,
      client_id: config.clientId() ?? "",
      client_secret: config.clientSecret() ?? "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    })
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed for ${provider} (${response.status})`);
  }

  const data = (await response.json()) as { access_token?: string };

  if (!data.access_token) {
    throw new Error(`No access token returned by ${provider}`);
  }

  return data.access_token;
}

export async function fetchOAuthProfile(
  provider: OAuthProviderName,
  accessToken: string
): Promise<OAuthProfile> {
  if (provider === "google") {
    return fetchGoogleProfile(accessToken);
  }

  if (provider === "github") {
    return fetchGithubProfile(accessToken);
  }

  return fetchGitlabProfile(accessToken);
}

async function fetchGoogleProfile(accessToken: string): Promise<OAuthProfile> {
  const data = await fetchJson<{ sub: string; email: string; name?: string }>(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    accessToken
  );

  return {
    provider_account_id: data.sub,
    email: data.email,
    username: data.name ?? data.email.split("@")[0]
  };
}

async function fetchGithubProfile(accessToken: string): Promise<OAuthProfile> {
  const data = await fetchJson<{
    id: number;
    login: string;
    email: string | null;
  }>("https://api.github.com/user", accessToken);

  let email = data.email;

  if (!email) {
    const emails = await fetchJson<
      { email: string; primary: boolean; verified: boolean }[]
    >("https://api.github.com/user/emails", accessToken);

    email = emails.find((e) => e.primary && e.verified)?.email ?? emails[0]?.email ?? null;
  }

  if (!email) {
    throw new Error("GitHub account has no accessible email");
  }

  return {
    provider_account_id: String(data.id),
    email,
    username: data.login
  };
}

async function fetchGitlabProfile(accessToken: string): Promise<OAuthProfile> {
  const data = await fetchJson<{
    id: number;
    username: string;
    email: string;
  }>("https://gitlab.com/api/v4/user", accessToken);

  return {
    provider_account_id: String(data.id),
    email: data.email,
    username: data.username
  };
}

async function fetchJson<T>(url: string, accessToken: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Profile fetch failed (${response.status})`);
  }

  return (await response.json()) as T;
}
