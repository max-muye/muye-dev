import { verifyTurnstileResult } from "./_turnstile.js";

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ valid: false }, { status: 400 }); }
  const result = await verifyTurnstileResult(String(body.token || ""), request, env.TURNSTILE_SECRET_KEY);
  return Response.json({ valid: result.success, reason: result.reason });
}
