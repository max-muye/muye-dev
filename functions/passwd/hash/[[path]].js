export function onRequest(context) {
  const requestUrl = new URL(context.request.url);
  const assetPath = requestUrl.pathname.includes("what-is-a-hash")
    ? "/passwd/what-is-a-hash/index.html"
    : "/tools/passwd/pbk/index.html";
  return context.env.ASSETS.fetch(new URL(assetPath, requestUrl));
}
