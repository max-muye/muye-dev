const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

const TEXT_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

const BUILTIN_ALLOWED = new Set(["www.muye.dev", "muye.dev"]);
const BLOCKED_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function dbEndpoint(connectionString) {
  return `https://${new URL(connectionString).hostname}/sql`;
}

async function query(env, text, params = []) {
  const response = await fetch(dbEndpoint(env.DATABASE_URL), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Neon-Connection-String": env.DATABASE_URL,
    },
    body: JSON.stringify({ query: text, params }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || "Database error");
  return data.rows || [];
}

function isPrivateHost(hostname) {
  const host = hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(host) || host.endsWith(".local")) return true;
  const parts = host.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return false;
  if (parts[0] === 10 || parts[0] === 127) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  return false;
}

function cleanTarget(rawUrl) {
  const target = new URL(rawUrl || "");
  if (!["http:", "https:"].includes(target.protocol)) throw new Error("Bad URL");
  if (isPrivateHost(target.hostname)) throw new Error("Blocked URL");
  return target;
}

function samePassword(a, b) {
  a = String(a || "");
  b = String(b || "");
  if (!a || a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return diff === 0;
}

async function ensureTables(env) {
  await query(env, `
    create table if not exists browser_proxy_hosts (
      host text primary key,
      approved boolean not null default false,
      requested_count integer not null default 0,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);
}

async function isApproved(env, host) {
  if (BUILTIN_ALLOWED.has(host)) return true;
  if (await isApprovedExact(env, host)) return true;
  const parts = host.split(".");
  for (let index = 1; index < parts.length - 1; index += 1) {
    if (await isApprovedExact(env, parts.slice(index).join("."))) return true;
  }
  return false;
}

async function isApprovedExact(env, host) {
  if (BUILTIN_ALLOWED.has(host)) return true;
  const rows = await query(env, "select approved from browser_proxy_hosts where host = $1 limit 1", [host]);
  return rows[0]?.approved === true;
}

async function requestHost(env, host) {
  await query(env, `
    insert into browser_proxy_hosts (host, approved, requested_count, updated_at)
    values ($1, false, 1, now())
    on conflict (host) do update set requested_count = browser_proxy_hosts.requested_count + 1, updated_at = now()
  `, [host]);
}

function proxyPath(url) {
  return `/tools/browser/proxy?url=${encodeURIComponent(url.href)}`;
}

function rewriteUrl(value, base) {
  if (!value || /^(data|blob|mailto|tel|javascript):/i.test(value)) return value;
  try {
    return proxyPath(new URL(value, base));
  } catch {
    return value;
  }
}

function rewriteHtml(html, baseUrl) {
  let out = html.replace(/<head(\s[^>]*)?>/i, (match) => `${match}<base href="${baseUrl.href}">`);
  out = out.replace(/<meta[^>]+http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, "");
  out = out.replace(/\s(integrity|nonce)="[^"]*"/gi, "");
  out = out.replace(/\s(href|src|action|poster|data-src|data-lazy-src)=["']([^"']+)["']/gi, (match, attr, value) => ` ${attr}="${rewriteUrl(value, baseUrl)}"`);
  out = out.replace(/\s(srcset|data-srcset)=["']([^"']+)["']/gi, (match, attr, value) => {
    const rewritten = value.split(",").map((part) => {
      const pieces = part.trim().split(/\s+/);
      if (!pieces[0]) return "";
      pieces[0] = rewriteUrl(pieces[0], baseUrl);
      return pieces.join(" ");
    }).filter(Boolean).join(", ");
    return ` ${attr}="${rewritten}"`;
  });
  out = out.replace(/<style(\s[^>]*)?>([\s\S]*?)<\/style>/gi, (match, attrs = "", css) => `<style${attrs}>${rewriteCss(css, baseUrl)}</style>`);
  return out.replace(/<\/body>/i, `${proxyBridgeScript(baseUrl)}</body>`);
}

function rewriteCss(css, baseUrl) {
  let out = css.replace(/@import\s+(?:url\()?["']?([^"')\s;]+)["']?\)?/gi, (match, value) => match.replace(value, rewriteUrl(value, baseUrl)));
  out = out.replace(/url\(\s*["']?([^"')]+)["']?\s*\)/gi, (match, value) => `url("${rewriteUrl(value, baseUrl)}")`);
  return out;
}

function proxyBridgeScript(baseUrl) {
  const base = JSON.stringify(baseUrl.href);
  return `<script>
(() => {
  const proxy = (value) => {
    try {
      const url = new URL(value || "", ${base});
      if (!/^https?:$/.test(url.protocol)) return value;
      return "/tools/browser/proxy?url=" + encodeURIComponent(url.href);
    } catch {
      return value;
    }
  };
  const open = window.open.bind(window);
  window.open = (url, target, features) => {
    if (!url) return open(url, target, features);
    location.href = proxy(url);
    return null;
  };
  document.addEventListener("click", (event) => {
    const link = event.target && event.target.closest ? event.target.closest("a[href]") : null;
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (/^(#|mailto:|tel:|javascript:)/i.test(href)) return;
    event.preventDefault();
    location.href = proxy(href);
  }, true);
  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!form || !form.action) return;
    const method = String(form.method || "get").toLowerCase();
    if (method !== "get") return;
    event.preventDefault();
    const url = new URL(form.action, ${base});
    new FormData(form).forEach((value, key) => url.searchParams.append(key, value));
    location.href = proxy(url.href);
  }, true);
})();
</script>`;
}

async function proxyGet(request, env) {
  const requestUrl = new URL(request.url);
  const sourceMode = requestUrl.searchParams.get("source") === "1";
  let target;
  try {
    target = cleanTarget(requestUrl.searchParams.get("url"));
  } catch (error) {
    return new Response(error.message, { status: 400, headers: TEXT_HEADERS });
  }
  await ensureTables(env);
  if (!(await isApproved(env, target.hostname.toLowerCase()))) {
    await requestHost(env, target.hostname.toLowerCase());
    return new Response("Proxy requested. Admin approval needed.", { status: 403, headers: TEXT_HEADERS });
  }

  const upstream = await fetch(target.href, {
    headers: {
      "User-Agent": "Mozilla/5.0 AppleWebKit/537.36 Chrome Safari",
      "Accept": request.headers.get("Accept") || "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": request.headers.get("Accept-Language") || "en-US,en;q=0.9",
    },
    redirect: "follow",
  });
  const contentType = upstream.headers.get("Content-Type") || "application/octet-stream";
  const headers = new Headers({
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow",
  });
  if (contentType.includes("text/html")) {
    const html = await upstream.text();
    if (sourceMode) {
      return new Response(html, { status: upstream.status, headers: TEXT_HEADERS });
    }
    return new Response(rewriteHtml(html, new URL(upstream.url)), { status: upstream.status, headers });
  }
  if (contentType.includes("text/css") || target.pathname.endsWith(".css")) {
    return new Response(rewriteCss(await upstream.text(), new URL(upstream.url)), { status: upstream.status, headers });
  }
  return new Response(upstream.body, { status: upstream.status, headers });
}

async function admin(request, env) {
  if (!env.ADMIN_PASSWD) return json({ error: "ADMIN_PASSWD missing" }, 500);
  if (!env.DATABASE_URL) return json({ error: "DATABASE_URL missing" }, 500);
  await ensureTables(env);
  const body = await request.json().catch(() => ({}));
  if (!samePassword(body.password, env.ADMIN_PASSWD)) return json({ error: "Unauthorized" }, 401);

  if (body.action === "approve") {
    const host = String(body.host || "").trim().toLowerCase();
    if (!host || isPrivateHost(host)) return json({ error: "Bad host" }, 400);
    await query(env, `
      insert into browser_proxy_hosts (host, approved, requested_count, updated_at)
      values ($1, true, 0, now())
      on conflict (host) do update set approved = true, updated_at = now()
    `, [host]);
  }
  if (body.action === "remove") {
    await query(env, "delete from browser_proxy_hosts where host = $1", [String(body.host || "").trim().toLowerCase()]);
  }
  const rows = await query(env, "select host, approved, requested_count as \"requestedCount\", updated_at as \"updatedAt\" from browser_proxy_hosts order by approved asc, requested_count desc, host asc");
  return json({ hosts: rows });
}

export async function onRequest({ request, env, params }) {
  const path = Array.isArray(params.path) ? params.path.join("/") : String(params.path || "");
  if (path === "admin" && request.method === "POST") return admin(request, env);
  if (request.method === "GET") {
    if (!env.DATABASE_URL) return new Response("DATABASE_URL missing", { status: 500, headers: TEXT_HEADERS });
    return proxyGet(request, env);
  }
  return new Response("Method not allowed", { status: 405, headers: TEXT_HEADERS });
}
