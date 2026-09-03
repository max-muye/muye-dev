let cachedKeys;

function fromBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  return atob(padded);
}

function decodeJson(value) {
  return JSON.parse(fromBase64Url(value));
}

async function clerkKeys(env) {
  if (cachedKeys) return cachedKeys;
  const issuer = env.CLERK_JWT_ISSUER || "https://clerk.www.muye.dev";
  const response = await fetch(`${issuer}/.well-known/jwks.json`);
  if (!response.ok) throw new Error("Clerk keys unavailable");
  cachedKeys = await response.json();
  return cachedKeys;
}

async function clerkApiUser(env, userId) {
  if (!env.CLERK_SECRET_KEY || !userId) return null;
  const response = await fetch(`https://api.clerk.com/v1/users/${encodeURIComponent(userId)}`, {
    headers: { authorization: `Bearer ${env.CLERK_SECRET_KEY}` },
  });
  if (!response.ok) return null;
  return response.json();
}

function emailFromClerkUser(user) {
  const primaryId = user.primary_email_address_id;
  const primary = Array.isArray(user.email_addresses)
    ? user.email_addresses.find((email) => email.id === primaryId) || user.email_addresses[0]
    : null;
  return String(primary?.email_address || "").toLowerCase();
}

export function clerkDisplayName(user) {
  const email = emailFromClerkUser(user);
  return String(
    user?.username ||
    user?.first_name ||
    user?.full_name ||
    email.split("@")[0] ||
    user?.id ||
    "",
  ).toLowerCase();
}

export async function clerkUserProfile(env, userId) {
  const user = await clerkApiUser(env, userId);
  if (!user) return { id: userId, username: userId };
  return { id: user.id, username: clerkDisplayName(user), email: emailFromClerkUser(user) };
}

export async function clerkUserByUsername(env, username) {
  const wanted = String(username || "").trim().toLowerCase();
  if (!env.CLERK_SECRET_KEY || !wanted) return null;
  const response = await fetch(`https://api.clerk.com/v1/users?query=${encodeURIComponent(wanted)}&limit=20`, {
    headers: { authorization: `Bearer ${env.CLERK_SECRET_KEY}` },
  });
  if (!response.ok) return null;
  const result = await response.json();
  const users = Array.isArray(result) ? result : result.data || [];
  const found = users.find((user) => clerkDisplayName(user) === wanted);
  return found ? { id: found.id, username: clerkDisplayName(found), email: emailFromClerkUser(found) } : null;
}

export async function clerkUserFromRequest(request, env, required = true) {
  const header = request.headers.get("authorization") || "";
  const token = header.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) {
    if (required) throw new Error("missing token");
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("bad token");
  const headerJson = decodeJson(parts[0]);
  const payload = decodeJson(parts[1]);
  const keys = await clerkKeys(env);
  const jwk = keys.keys?.find((key) => key.kid === headerJson.kid);
  if (!jwk) throw new Error("unknown token key");

  const key = await crypto.subtle.importKey(
    "jwk",
    { ...jwk, alg: "RS256", ext: true },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const signature = Uint8Array.from(fromBase64Url(parts[2]), (character) => character.charCodeAt(0));
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, signature, data);
  if (!ok) throw new Error("invalid token");

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) throw new Error("expired token");
  if (!payload.sub) throw new Error("missing user");
  const tokenEmail = String(payload.email || payload.email_address || payload.primary_email_address || "").toLowerCase();
  const apiUser = tokenEmail ? null : await clerkApiUser(env, payload.sub);
  const email = tokenEmail || (apiUser ? emailFromClerkUser(apiUser) : "");
  return {
    id: payload.sub,
    email,
    username: String(payload.username || payload.name || "").toLowerCase() || (apiUser ? clerkDisplayName(apiUser) : payload.sub),
    claims: payload,
  };
}
