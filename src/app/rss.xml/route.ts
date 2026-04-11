import { posts } from '#site/content'

export const dynamic = 'force-static'

const SITE = 'https://procpa.co.kr'

function escape(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function GET() {
  const sorted = posts
    .filter((p) => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))

  const lastBuildDate = sorted.length
    ? new Date(sorted[0].date).toUTCString()
    : new Date().toUTCString()

  const items = sorted
    .slice(0, 50)
    .map(
      (p) => `
    <item>
      <title>${escape(p.title)}</title>
      <link>${SITE}/${p.slugAsParams}</link>
      <guid>${SITE}/${p.slugAsParams}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escape(p.description)}</description>
    </item>`,
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>PROCPA</title>
    <link>${SITE}</link>
    <description>회계사의 기록</description>
    <language>ko</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <image>
      <url>${SITE}/icon.png</url>
      <title>PROCPA</title>
      <link>${SITE}</link>
    </image>${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  })
}
