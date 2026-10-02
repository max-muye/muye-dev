import { adminLogin, adminLogout } from "./_admin-session.js";

export async function onRequestPost({ request, env }) {
  return adminLogin(request, env);
}

export async function onRequestDelete() {
  return adminLogout();
}
