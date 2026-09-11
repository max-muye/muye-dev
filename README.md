# muye-dev

Muye's personal website: a small public place for tools, notes, chat, games, and experiments.

Live site: https://www.muye.dev

## What You Can Use

- Home: start at https://www.muye.dev
- LocalTalk: chat at `/talk`
- Mailbox: open Muye mail at `/mailbox`
- Games: play small touch-friendly games at `/games`
- Lambda: use the lambda tool at `/misc/lambda`
- Browser, coder, captcha, notes, and profile pages live under the main site too.

Some pages are public. Some actions, like signed chat or mailbox admin tools, may ask you to sign in.

## Run It Locally

```sh
python3 -m http.server 8788
```

Then open `http://localhost:8788`.

This is good for viewing normal HTML/CSS/JS pages.

## Local Server With Functions

Some features use Cloudflare Pages Functions, like chat and mailbox APIs. For those, use Wrangler:

```sh
npx wrangler pages dev .
```

Then open the local URL Wrangler prints.

Local copies may not have the same private keys or database access as the live site, so sign-in, mail, and admin-only features may be limited.

## Page Language Rule

When adding a new `/xxx` page, include the master language behavior from the start. Use the existing 10 languages (`en`, `zh`, `ja`, `ko`, `es`, `fr`, `de`, `pt`, `ru`, `ar`) and connect visible page text to the shared language setting instead of leaving a new page English-only.
