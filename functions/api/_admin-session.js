function base64Url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function secretKey(secret) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function encryptAdminSession(env) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await secretKey(env.ADMIN_PASSWD);
  const payload = new TextEncoder().encode(JSON.stringify({ role: "admin", expiresAt: Date.now() + 60 * 60 * 1000 }));
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, payload));
  const combined = new Uint8Array(iv.length + encrypted.length);
  combined.set(iv);
  combined.set(encrypted, iv.length);
  return base64Url(combined);
}

async function readAdminSession(request, env) {
  const token = request.headers.get("cookie")?.match(/(?:^|; )muye_admin=([^;]+)/)?.[1];
  if (!token || !env.ADMIN_PASSWD) return false;
  try {
    const combined = fromBase64Url(token);
    const key = await secretKey(env.ADMIN_PASSWD);
    const payload = await crypto.subtle.decrypt({ name: "AES-GCM", iv: combined.slice(0, 12) }, key, combined.slice(12));
    const session = JSON.parse(new TextDecoder().decode(payload));
    return session.role === "admin" && session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

async function adminPasswordMatches(password, expected) {
  const [actual, wanted] = await Promise.all([
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)),
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(expected)),
  ]);
  const left = new Uint8Array(actual);
  const right = new Uint8Array(wanted);
  let difference = left.length ^ right.length;
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) difference |= (left[index] || 0) ^ (right[index] || 0);
  return difference === 0;
}

export async function adminLogin(request, env) {
  if (!env.ADMIN_PASSWD) return new Response(JSON.stringify({ error: "Admin password is not configured." }), { status: 503, headers: { "content-type": "application/json" } });
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const password = String(body.password || "");
  if (!password || !(await adminPasswordMatches(password, env.ADMIN_PASSWD))) return new Response(JSON.stringify({ error: "Admin password is incorrect." }), { status: 401, headers: { "content-type": "application/json" } });
  const token = await encryptAdminSession(env);
  return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json", "set-cookie": `muye_admin=${token}; Max-Age=3600; Path=/; HttpOnly; Secure; SameSite=Lax` } });
}

export function adminLogout() {
  return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json", "set-cookie": "muye_admin=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax" } });
}

export { readAdminSession };
