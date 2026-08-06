// Server endpoint (SSR). Fetches the latest tweets from the xCancel Nitter
// mirror's public RSS feed for a given X handle. Returns a JSON array of the
// last 3 posts.
//
// NOTE: xCancel / Nitter is an unofficial, third-party scraping mirror for
// X / Twitter. It can break, rate-limit, or be blocked at any time. This is
// the most reliable no-API-key option currently available for showing tweet
// previews, but it is not an official integration.

import https from 'node:https';

export const prerender = false;

const TTL = 10 * 60 * 1000;
const USER_AGENT = 'FreshRSS/1.20.0 (+https://elina.chat)';
const RSS_HOST = 'rss.xcancel.com';

interface Tweet {
  id: string;
  text: string;
  date: string;
  link: string;
  media?: string;
  isVideo?: boolean;
}

let cache: Record<string, { t: number; data: Tweet[] }> = {};

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function fetchRss(handle: string, timeout = 10000): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      {
        host: RSS_HOST,
        path: `/${encodeURIComponent(handle)}/rss`,
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/rss+xml,text/xml,*/*',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout,
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          res.resume();
          reject(new Error(`upstream ${res.statusCode}`));
          return;
        }

        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (data += chunk));
        res.on('error', reject);
        res.on('end', () => resolve(data));
      },
    );

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('timeout'));
    });
  });
}

function isWhitelisted(xml: string): boolean {
  return xml.includes('RSS reader not yet whitelisted');
}

function parseRss(xml: string, handle: string): Tweet[] {
  if (isWhitelisted(xml)) {
    throw new Error('xcancel whitelist');
  }

  const items = xml.split('<item>').slice(1);
  const tweets: Tweet[] = [];

  for (const item of items) {
    const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
    const descMatch = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
    const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const guidMatch = item.match(/<guid[^>]*>([\s\S]*?)<\/guid>/);

    if (!titleMatch || !guidMatch) continue;

    const title = decodeEntities(titleMatch[1].trim());
    const description = descMatch ? descMatch[1].trim() : '';
    const id = guidMatch[1].trim();
    const link = `https://x.com/${handle}/status/${id}`;
    const date = dateMatch ? new Date(dateMatch[1].trim()).toISOString() : '';

    // Use the title as the tweet text. Fallback to a plain-text version of the
    // description if the title is empty.
    let text = title;
    if (!text && description) {
      text = stripHtml(decodeEntities(description));
    }
    if (!text) continue;

    // Extract the first image from the description.
    const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
    const media = imgMatch ? imgMatch[1] : undefined;
    const isVideo = description.includes('<br>Video<br>') || description.includes('>Video<');

    tweets.push({ id, text, date, link, media, isVideo });
    if (tweets.length >= 3) break;
  }

  return tweets;
}

function json(data: Tweet[], status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=60',
    },
  });
}

export async function GET({ url }: { url: string }): Promise<Response> {
  const { searchParams } = new URL(url);
  const handle = searchParams.get('handle')?.replace(/^@/, '');

  if (!handle) {
    return new Response(JSON.stringify({ error: 'handle is required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (cache[handle] && Date.now() - cache[handle].t < TTL) {
    return json(cache[handle].data);
  }

  try {
    const xml = await fetchRss(handle);
    const data = parseRss(xml, handle);
    cache[handle] = { t: Date.now(), data };
    return json(data);
  } catch (e) {
    return json(cache[handle]?.data ?? [], cache[handle] ? 200 : 502);
  }
}
