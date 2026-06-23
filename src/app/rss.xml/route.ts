import { getRecentPublishedPosts } from "@/db/posts";

export const revalidate = 3600;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dat.ngo";
  let posts: Awaited<ReturnType<typeof getRecentPublishedPosts>> = [];
  try {
    posts = await getRecentPublishedPosts(30);
  } catch {
    /* DB unavailable — emit empty feed */
  }

  const items = posts
    .map((p) => {
      const url = `${siteUrl}/blog/${p.slug}`;
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      ${p.excerpt ? `<description>${escapeXml(p.excerpt)}</description>` : ""}
      ${p.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>dat.ngo — Nguyễn Phạm Quốc Đạt</title>
    <link>${siteUrl}</link>
    <description>Spatial Computing, WebAR/XR, AI và hành trình Founder.</description>
    <language>vi</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
