# Project Rules

- After completing each user-requested website change, deploy the current project to the production Cloudflare Pages project `muye-dev`, and Github `max-muye/muye-dev` unless the user explicitly says not to deploy or asks for local-only work.
- Every new or changed piece of user-facing text must support the site's ten-language switch: English, Chinese, Japanese, Korean, Spanish, French, German, Portuguese, Russian, and Arabic. Do not ship new user-facing text with only an English fallback.
- Follow semantic versioning as used by this project: the first number is for a big update, the middle number is for a normal update, and the last number is for a small update. Add each shipped change to the version and deployment notes.
