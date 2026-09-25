export async function onRequest(context) {
  const notFoundUrl = new URL("/404.html", context.request.url);
  const response = await context.env.ASSETS.fetch(notFoundUrl);
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store");
  return new Response(response.body, { status: 404, headers });
}
