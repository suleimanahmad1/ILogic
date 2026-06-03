import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const readSiteUrl = () => {
  if (process.env.VITE_SITE_URL?.trim()) {
    return process.env.VITE_SITE_URL.trim().replace(/\/$/, "");
  }
  try {
    const env = readFileSync(join(root, ".env.local"), "utf8");
    const match = env.match(/^VITE_SITE_URL=(.+)$/m);
    if (match?.[1]?.trim()) return match[1].trim().replace(/\/$/, "");
  } catch {
    /* no .env.local */
  }
  return "https://inferencelogic.com";
};

const siteUrl = readSiteUrl();
const lastmod = new Date().toISOString().slice(0, 10);

const paths = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/about-dashboard", priority: "0.9", changefreq: "monthly" },
  { loc: "/blogs-dashboard", priority: "0.9", changefreq: "weekly" },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (p) => `  <url>
    <loc>${siteUrl}${p.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin-login

Sitemap: ${siteUrl}/sitemap.xml
`;

writeFileSync(join(root, "public/sitemap.xml"), sitemap, "utf8");
writeFileSync(join(root, "public/robots.txt"), robots, "utf8");
console.log(`SEO files generated for ${siteUrl}`);
