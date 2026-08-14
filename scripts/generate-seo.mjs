import { mkdir, readFile, writeFile } from 'node:fs/promises';

const siteUrl = (process.env.VITE_SITE_URL || 'https://lovexiaoyue.cc.cd').replace(/\/$/, '');
const pairs = JSON.parse(await readFile('data/conversion-pairs.json', 'utf8'));
const staticPages = [
  '/', '/converters', '/format-converters', '/blog', '/pricing', '/bulk-converter',
  ...new Set(pairs.flatMap(pair => [`/${pair.slug}`, `/converters/${pair.category}`])),
  '/json-formatter', '/json-validator', '/json-minifier', '/json-to-csv', '/csv-to-json', '/json-to-xml', '/xml-to-json', '/base64-encoder', '/base64-decoder', '/url-encoder', '/url-decoder', '/unix-timestamp-converter',
  '/blog/meters-to-feet', '/blog/kilograms-to-pounds', '/blog/celsius-to-fahrenheit', '/blog/liters-to-gallons', '/blog/format-json', '/blog/json-to-csv', '/blog/unix-timestamp',
];
await mkdir('client/public', { recursive: true });
const urls = [...new Set(staticPages)].map(path => `  <url><loc>${siteUrl}${path}</loc></url>`).join('\n');
await writeFile('client/public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
await writeFile('client/public/robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nDisallow: /test\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log(`Generated SEO files for ${siteUrl} (${[...new Set(staticPages)].length} URLs from ${pairs.length} conversion pairs)`);
