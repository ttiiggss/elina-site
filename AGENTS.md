# Elina Site — project notes

A polished rebuild of elina.chat: a link/socials page that shows the latest
posts from each platform plus Discord / Throne / Donate links.

## Stack
- Astro 4 (`output: 'hybrid'`) + `@astrojs/vercel` adapter (serverless).
- Deployed on Vercel: the page is prerendered static HTML served from the CDN;
  `src/pages/api/youtube.ts` opts into SSR with `export const prerender = false`
  and ships as a Vercel serverless function.
- Node 20 runtime (`engines.node` in package.json).

## Commands
- `npm run dev`   — dev server (host 0.0.0.0, port 4321; auto-increments if busy).
- `npm run build` — production build to `.vercel/output/` (Vercel build format).
- `npm run preview` — preview the built static output locally.

## Deploy (Vercel)
- Import the GitHub repo (github.com/ttiiggss/elina-site) at vercel.com.
- Framework preset: Astro (auto-detected). No build command or output dir
  overrides needed — the Vercel adapter handles it.
- Push to `main` triggers an automatic redeploy.

## How each feed is sourced (no API keys required)
- **YouTube** — `/api/youtube` proxies YouTube's public RSS feed
  (`https://www.youtube.com/feeds/videos.xml?channel_id=UCZBRLTVr1ZITpLsRGC-saGA`),
  returns the latest 3 uploads as JSON. 5-minute in-memory cache. Rendered
  client-side by `YouTubeFeed.astro`.
- **Twitter/X (x2)** — `/api/twitter` fetches the public RSS feed from
  `xcancel.com` (a Nitter mirror), parses the latest 3 items, and
  `TwitterFeed.astro` renders them as custom tweet cards with text, relative
  timestamps, and media/video thumbnails. This is an unofficial scraping
  mirror, so it can be rate-limited or blocked by X / xCancel at any time.
  `TwitterFeed.astro` falls back to a clean "Open profile" card if the proxy
  fails.
- **Twitch** — official live channel player embed (`player.twitch.tv`). The
  `parent` query param is set to `location.hostname` at runtime so it works on
  any host. Twitch has no "posts", so a live player is shown instead.
- **Instagram (x2) / TikTok (x2)** — these platforms have NO public
  profile-timeline widget and no free, no-effort, no-API solution. By default
  they render as clean "Open profile" cards. To show real posts automatically,
  paste a third-party widget snippet (Curator, Elfsight, Poper, Pane, WidgetJar,
  EmbedSocial, etc.) into `widgetSnippet` in `src/data/socials.ts` for that feed.

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
