import localtalk from "../_localtalk_worker.js";

function localtalkEnv(env) {
  return {
    ...env,
    CLERK_PUBLISHABLE_KEY: env.CLERK_PUBLISHABLE_KEY || "pk_live_Y2xlcmsud3d3Lm11eWUuZGV2JA",
    CLERK_JWKS_URL: env.CLERK_JWKS_URL || "https://clerk.www.muye.dev/.well-known/jwks.json",
    CLERK_ISSUER: env.CLERK_ISSUER || "https://clerk.www.muye.dev",
  };
}

export function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.pathname === "/talk/download" || url.pathname === "/talk/download/") {
    return Response.redirect(new URL("/download/#localtalk", url), 302);
  }
  if (url.pathname === "/talk/manifest.webmanifest") {
    return context.env.ASSETS.fetch(new URL("/talk-manifest.webmanifest", url));
  }
  return localtalk.fetch(context.request, localtalkEnv(context.env));
}
