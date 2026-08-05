// Server endpoint (opted out of prerendering for Astro `hybrid` output).
// Proxies YouTube's public RSS feed for Elina's channel and returns the
// latest 3 uploads as JSON. No API key required. Cached 5 minutes in memory.

export const prerender = false;

const CHANNEL_ID = 'UCZBRLTVr1ZITpLsRGC-saGA';
const TTL = 5 * 60 * 1000;

interface Video {
  title: string;
  link: string;
  thumbnail: string;
  published: string;
  views?: string;
}

let cache: { t: number; data: Video[] } | null = null;

function pick(re: RegExp, src: string): string | undefined {
  const m = re.exec(src);
  return m ? m[1] : undefined;
}

function parse(xml: string): Video[] {
  // Atom feed: split on <entry>, skip the prologue.
  const entries = xml.split('<entry>').slice(1);
  const vids: Video[] = [];
  for (const entry of entries) {
    const videoId = pick(/<yt:videoId>([^<]+)<\/yt:videoId>/, entry);
    const title = pick(/<title>([^<]*)<\/title>/, entry);
    const link = pick(/<link[^>]*href="([^"]+)"[^>]*>/, entry);
    const published = pick(/<published>([^<]+)<\/published>/, entry);
    const thumb = pick(/<media:thumbnail[^>]*url="([^"]+)"/, entry);
    const views = pick(/<media:statistics[^>]*views="(\d+)"/, entry);
    if (videoId && title && link) {
      vids.push({
        // keep XML-escaped entities; the browser decodes them safely on render
        title,
        link,
        thumbnail: thumb || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        published: published || '',
        views: views || undefined,
      });
    }
    if (vids.length >= 3) break;
  }
  return vids;
}

function json(data: Video[], status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=60',
    },
  });
}

export async function GET(): Promise<Response> {
  if (cache && Date.now() - cache.t < TTL) {
    return json(cache.data);
  }
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      {
        headers: { 'User-Agent': 'elina-site/1.0 (+https://elina.chat)' },
        // AbortSignal.timeout is available on Node 18+.
        signal: AbortSignal.timeout(6000),
      },
    );
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const xml = await res.text();
    const data = parse(xml);
    cache = { t: Date.now(), data };
    return json(data);
  } catch (e) {
    // Serve stale cache if we have it, otherwise an empty list (the UI shows
    // a graceful "unavailable" state).
    return json(cache?.data ?? [], cache?.data ? 200 : 502);
  }
}
