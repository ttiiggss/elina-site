/* =====================================================================
   Elina — socials & feed configuration
   ---------------------------------------------------------------------
   Edit this file to keep links and widgets up to date.

   HOW THE FEEDS WORK
   - twitch ....... official live channel player embed (always live, no key)
   - youtube ...... fetched live from YouTube's public RSS feed via
                    /api/youtube -> last 3 uploads, no API key needed
   - twitter ...... /api/twitter fetches the official X oEmbed HTML,
                    page injects the timeline anchor and loads widgets.js.
                    Falls back to a clean "Open profile" card if X's
                    widgets.js is blocked (ad blockers, privacy tools, etc.).
   - instagram .... a third-party widget snippet (optional) or a profile
                    card. Instagram has NO free public profile feed, so the
                    only no-effort live option is a paid widget service such
                    as Curator, Elfsight, Poper, Pane, WidgetJar, or
                    EmbedSocial. Paste their embed snippet in `widgetSnippet`.
   - tiktok ....... same as Instagram: paid widget snippet or profile card.
   ===================================================================== */

export interface ActionLink {
  label: string;
  href: string;
  icon: string;
  accent: string;
  /** short helper text shown under the label */
  note: string;
}

export type FeedKind = 'twitch' | 'youtube' | 'twitter' | 'embed';

export interface Feed {
  id: string;
  platform: string;
  /** optional sub-label, e.g. "Art" or "Cats" */
  sub?: string;
  /** display handle, e.g. "elina" or "@YaBoiElina". For X, the @ is stripped server-side. */
  handle: string;
  url: string;
  icon: string;
  accent: string;
  /** optional secondary brand color (e.g. TikTok's cyan + red) */
  accent2?: string;
  kind: FeedKind;
  /** only for kind === 'embed' (Instagram / TikTok) */
  embed?: 'instagram' | 'tiktok';
  /** optional third-party widget embed snippet. If provided, it is rendered
      directly in the panel and the widget service loads the live feed. */
  widgetSnippet?: string;
}

export const profile = {
  name: 'Elina',
  tagline: 'Streams, art, and a lot of cats. Find everything in one place.',
  /** swap this for '/avatar.jpg' once you drop a real photo in /public */
  avatar: '/avatar.svg',
};

/** The three links called out in the brief — shown as hero action buttons. */
export const actionLinks: ActionLink[] = [
  {
    label: 'Discord',
    href: 'https://discord.gg/Elina',
    icon: 'discord',
    accent: '#5865F2',
    note: 'Join the community',
  },
  {
    label: 'Throne',
    href: 'https://throne.me/u/elina',
    icon: 'throne',
    accent: '#e8c07a',
    note: 'Wishlist & gifts',
  },
  {
    label: 'Donate',
    href: 'https://streamelements.com/elina/tip',
    icon: 'heart',
    accent: '#ff5c8a',
    note: 'Support the stream',
  },
];

/** All eight feeds, in display order. */
export const feeds: Feed[] = [
  {
    id: 'twitch',
    platform: 'Twitch',
    handle: 'elina',
    url: 'https://www.twitch.tv/elina',
    icon: 'twitch',
    accent: '#9146FF',
    kind: 'twitch',
  },
  {
    id: 'youtube',
    platform: 'YouTube',
    handle: 'Latest uploads',
    url: 'https://www.youtube.com/channel/UCZBRLTVr1ZITpLsRGC-saGA',
    icon: 'youtube',
    accent: '#FF3D3D',
    kind: 'youtube',
  },
  {
    id: 'twitter-main',
    platform: 'Twitter',
    handle: '@YaBoiElina',
    url: 'https://twitter.com/YaBoiElina',
    icon: 'x',
    accent: '#1DA1F2',
    kind: 'twitter',
  },
  {
    id: 'twitter-art',
    platform: 'Twitter',
    sub: 'Art',
    handle: '@ElinaDoesArt',
    url: 'https://twitter.com/ElinaDoesArt',
    icon: 'palette',
    accent: '#b15cff',
    kind: 'twitter',
  },
  {
    id: 'instagram-main',
    platform: 'Instagram',
    handle: 'elinatwitch',
    url: 'https://www.instagram.com/elinatwitch/',
    icon: 'instagram',
    accent: '#d62976',
    kind: 'embed',
    embed: 'instagram',
    // Example: paste a Curator / Elfsight / Poper embed snippet here.
    // widgetSnippet: '<div class="some-widget" data-id="..."></div><script src="..."></script>',
  },
  {
    id: 'instagram-art',
    platform: 'Instagram',
    sub: 'Art',
    handle: 'elinadoesart',
    url: 'https://www.instagram.com/elinadoesart/',
    icon: 'palette',
    accent: '#b15cff',
    kind: 'embed',
    embed: 'instagram',
  },
  {
    id: 'tiktok-main',
    platform: 'TikTok',
    handle: '@elinatwitch',
    url: 'https://www.tiktok.com/@elinatwitch',
    icon: 'tiktok',
    accent: '#25F4EE',
    accent2: '#FE2C55',
    kind: 'embed',
    embed: 'tiktok',
  },
  {
    id: 'tiktok-cats',
    platform: 'TikTok',
    sub: 'Cats',
    handle: '@elinascats',
    url: 'https://www.tiktok.com/@elinascats',
    icon: 'paw',
    accent: '#25F4EE',
    accent2: '#FE2C55',
    kind: 'embed',
    embed: 'tiktok',
  },
];
