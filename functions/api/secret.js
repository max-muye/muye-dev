import { clerkUserFromRequest } from "./_clerk.js";

function json(data, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
}

async function ensureSecretSolvers(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS secret_solvers (
      user_id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

export async function onRequest({ request, env }) {
  if (!env.muye_mailboxes) return json({ ok: false, error: "storage_unavailable" }, { status: 503 });

  let user;
  try {
    user = await clerkUserFromRequest(request, env);
  } catch {
    return json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  await ensureSecretSolvers(env.muye_mailboxes);
  const existing = await env.muye_mailboxes
    .prepare("SELECT user_id, display_name, completed_at FROM secret_solvers WHERE user_id = ? LIMIT 1")
    .bind(user.id)
    .first();

  if (request.method === "POST") {
    const displayName = String(user.username || user.email?.split("@")[0] || "Solver").trim().slice(0, 80) || "Solver";
    await env.muye_mailboxes.prepare(`
      INSERT INTO secret_solvers (user_id, display_name)
      VALUES (?, ?)
      ON CONFLICT(user_id) DO UPDATE SET display_name = excluded.display_name
    `).bind(user.id, displayName).run();
    const solver = await env.muye_mailboxes
      .prepare("SELECT display_name, completed_at FROM secret_solvers WHERE user_id = ? LIMIT 1")
      .bind(user.id)
      .first();
    return json({ ok: true, solved: true, solver }, { status: existing ? 200 : 201 });
  }

  if (request.method !== "GET") return json({ ok: false, error: "method_not_allowed" }, { status: 405 });
  if (new URL(request.url).searchParams.get("status") === "1") return json({ ok: true, solved: Boolean(existing) });
  if (!existing) return json({ ok: false, error: "solve_required" }, { status: 403 });

  const { results = [] } = await env.muye_mailboxes.prepare(`
    SELECT display_name, completed_at
    FROM secret_solvers
    ORDER BY completed_at ASC
  `).all();
  return json({ ok: true, solvers: results });
}
