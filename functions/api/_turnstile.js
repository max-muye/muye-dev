export async function verifyTurnstileResult(token, request, secret) {
  if (!token) return { success: false, reason: "missing-token" };
  if (!secret) return { success: false, reason: "missing-secret" };
  const form = new URLSearchParams({ secret, response: token });
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) form.set("remoteip", ip);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: form });
  if (!response.ok) return { success: false, reason: `siteverify-${response.status}` };
  const result = await response.json();
  return { success: result.success === true, reason: result["error-codes"]?.join(",") || "" };
}

export async function verifyTurnstile(token, request, secret) {
  return (await verifyTurnstileResult(token, request, secret)).success;
}
