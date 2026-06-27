const AUTHORIZE_URL = "https://access.line.me/oauth2/v2.1/authorize";
const TOKEN_URL = "https://api.line.me/oauth2/v2.1/token";
const PROFILE_URL = "https://api.line.me/v2/profile";

export type LineProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
};

export function buildLineAuthUrl(opts: {
  channelId: string;
  redirectUri: string;
  state: string;
}): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: opts.channelId,
    redirect_uri: opts.redirectUri,
    state: opts.state,
    scope: "profile openid",
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

export async function exchangeCodeForProfile(opts: {
  code: string;
  channelId: string;
  channelSecret: string;
  redirectUri: string;
  fetchImpl?: typeof fetch;
}): Promise<LineProfile> {
  const f = opts.fetchImpl ?? fetch;
  const tokenRes = await f(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: opts.code,
      redirect_uri: opts.redirectUri,
      client_id: opts.channelId,
      client_secret: opts.channelSecret,
    }).toString(),
  });
  if (!tokenRes.ok) throw new Error(`LINE token exchange failed: ${tokenRes.status}`);
  const { access_token } = (await tokenRes.json()) as { access_token: string };

  const profRes = await f(PROFILE_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!profRes.ok) throw new Error(`LINE profile fetch failed: ${profRes.status}`);
  return (await profRes.json()) as LineProfile;
}
