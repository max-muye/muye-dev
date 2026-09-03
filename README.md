# muye-dev

Personal web project for Muye, with LocalTalk chat, mailbox tools, games, Lambda tools, Clerk sign-in, and Cloudflare Pages/Workers support.

## Local preview

```sh
python3 -m http.server 8788
```

Then open `http://localhost:8788`.

## Deploy to Cloudflare Pages

```sh
npx wrangler pages project create muye-dev --production-branch main
npx wrangler pages deploy . --project-name muye-dev
```

In Cloudflare Pages, add the custom domain:

```text
www.muye.dev
```

If `muye.dev` is already managed by Cloudflare DNS, Pages will guide you through creating the CNAME for `www`.
