// Server endpoint (SSR). Fetches the official X / Twitter oEmbed markup for a
// profile timeline. Extracts the timeline anchor, injects widgets.js data
// attributes (3 tweets, dark theme, no chrome), and returns it. Cached 10 min.

export const prerender = false;

const TTL = 10 * 60 * 1000;
let cache: Record<string, { t: number; html: string }> = {};

function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=60',
    },
  });
}

export async function GET({ url }: { url: string }): Promise<Response> {
  const { searchParams } = new URL(url);
  const handle = searchParams.get('handle')?.replace(/^@/, '');
  const theme = searchParams.get('theme') || 'dark';

  if (!handle) {
    return new Response(JSON.stringify({ error: 'handle is required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const key = `${handle}:${theme}`;
  if (cache[key] && Date.now() - cache[key].t < TTL) {
    return htmlResponse(cache[key].html);
  }

  const profileUrl = `https://twitter.com/${encodeURIComponent(handle)}`;
  const oembedUrl =
    `https://publish.twitter.com/oembed?` +
    `url=${encodeURIComponent(profileUrl)}`;

  try {
    const res = await fetch(oembedUrl, {
      headers: { 'User-Agent': 'elina-site/1.0 (+https://elina.chat)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = (await res.json()) as { html?: string };
    if (!data.html) throw new Error('no html in oembed response');

    // Extract the <a ...>...</a> anchor from the oEmbed response.
    const anchorMatch = data.html.match(/<a\b[^>]*>.*?<\/a>/i);
    if (!anchorMatch) throw new Error('no anchor in oembed html');

    // Inject the data attributes widgets.js needs to render a 3-tweet timeline.
    const attrs =
      `data-tweet-limit="3" ` +
      `data-chrome="noheader nofooter noborders transparent" ` +
      `data-theme="${theme}" ` +
      `data-dnt="true" ` +
      `data-width="100%" `;
    const html = anchorMatch[0].replace(/<a\b/i, `<a ${attrs}`);

    cache[key] = { t: Date.now(), html };
    return htmlResponse(html);
  } catch (e) {
    return htmlResponse(cache[key]?.html ?? '', cache[key] ? 200 : 502);
  }
}
