/* =====================================================================
   Elina — socials & feed configuration
   ---------------------------------------------------------------------
   Edit this file to keep links and embeddable posts up to date.

   HOW THE FEEDS WORK
   - twitch ....... official live channel player embed (always live, no key)
   - youtube ...... fetched live from YouTube's public RSS feed via
                    /api/youtube -> last 3 uploads, no API key needed
   - twitter ...... official X timeline embed widgets (last 3 tweets, live)
   - instagram .... official single-post embeds, driven by the `posts`
                    array below. Instagram has NO public profile-timeline
                    widget, so paste the URLs of your 3 latest posts.
   - tiktok ....... official single-video embeds, driven by `posts`.
                    TikTok has NO public profile-timeline widget, so paste
                    the URLs of your 3 latest videos.

   Until `posts` contains real URLs, a polished placeholder card is shown
   for that account. Add a URL and the native embed renders automatically.
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
  handle: string;
  url: string;
  icon: string;
  accent: string;
  /** optional secondary brand color (e.g. TikTok's cyan + red) */
  accent2?: string;
  kind: FeedKind;
  /** only for kind === 'embed' */
  embed?: 'instagram' | 'tiktok';
  /** only for kind === 'embed': latest post URLs (max 3 shown) */
  posts?: string[];
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
    posts: [
      // 'https://www.instagram.com/p/XXXXXXXX/',
      // 'https://www.instagram.com/p/YYYYYYYY/',
      // 'https://www.instagram.com/p/ZZZZZZZZ/',
    ],
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
    posts: [
      // 'https://www.instagram.com/p/XXXXXXXX/',
      // 'https://www.instagram.com/p/YYYYYYYY/',
      // 'https://www.instagram.com/p/ZZZZZZZZ/',
    ],
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
    posts: [
      // 'https://www.tiktok.com/@elinatwitch/video/0000000000000000000',
      // 'https://www.tiktok.com/@elinatwitch/video/1111111111111111111',
      // 'https://www.tiktok.com/@elinatwitch/video/2222222222222222222',
    ],
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
    posts: [
      // 'https://www.tiktok.com/@elinascats/video/0000000000000000000',
      // 'https://www.tiktok.com/@elinascats/video/1111111111111111111',
      // 'https://www.tiktok.com/@elinascats/video/2222222222222222222',
    ],
  },
];
