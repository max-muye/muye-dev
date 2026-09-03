export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === "muye.dev") {
    url.hostname = "www.muye.dev";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
