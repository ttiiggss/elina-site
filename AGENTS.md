# Elina Site — project notes

A polished rebuild of elina.chat: a link/socials page that shows the latest
posts from each platform plus Discord / Throne / Donate links.

## Stack
- Astro 4 (`output: 'hybrid'`) + `@astrojs/node` adapter (standalone).
- Pages prerender by default; `src/pages/api/youtube.ts` opts into SSR with
  `export const prerender = false`.

## Commands
- `npm run dev`   — dev server (host 0.0.0.0, port 4321; auto-increments if busy).
- `npm run build` — production build to `dist/`.
- `npm run preview` — preview the built static output.
- `npm start`     — run the built Node server (`dist/server/entry.mjs`).

## How each feed is sourced (no API keys required)
- **YouTube** — `/api/youtube` proxies YouTube's public RSS feed
  (`https://www.youtube.com/feeds/videos.xml?channel_id=UCZBRLTVr1ZITpLsRGC-saGA`),
  returns the latest 3 uploads as JSON. 5-minute in-memory cache. Rendered
  client-side by `YouTubeFeed.astro`.
- **Twitter/X (x2)** — official timeline embed widgets (`platform.twitter.com/widgets.js`,
  `data-tweet-limit="3"`). Theme synced to the site theme in `Base.astro`.
- **Twitch** — official live channel player embed (`player.twitch.tv`). The
  `parent` query param is set to `location.hostname` at runtime so it works on
  any host. Twitch has no "posts", so a live player is shown instead.
- **Instagram (x2) / TikTok (x2)** — these platforms have NO public
  profile-timeline widget, so official single-post embeds are driven by an
  editable URL list in `src/data/socials.ts` (`feed.posts`). Until real URLs are
  added, a polished fallback card is shown. Add a URL and the native embed
  renders automatically. The IG/TikTok embed scripts are only loaded when at
  least one `posts` entry exists.

## Customization
- Avatar: replace `public/avatar.svg` (or drop in `avatar.jpg` and update
  `profile.avatar` in `src/data/socials.ts`).
- Name / tagline: `profile` in `src/data/socials.ts`.
- Action links (Discord/Throne/Donate): `actionLinks` in `src/data/socials.ts`.
- All feed handles/URLs + IG/TikTok post URLs: `feeds` in `src/data/socials.ts`.

## Verification
- `npm run build` must pass (prerenders `index.html`, builds the SSR route).
- `curl /api/youtube` returns a JSON array of ≤3 videos.
- Dev server hot-reloads on edits to `src/**`.
