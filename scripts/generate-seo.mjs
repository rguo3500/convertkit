import { mkdir, writeFile } from 'node:fs/promises';

const siteUrl = (process.env.VITE_SITE_URL || 'https://convertkit.example').replace(/\/$/, '');
const staticPages = [
  '/', '/converters', '/format-converters', '/blog', '/pricing', '/bulk-converter',
  '/converters/length', '/converters/weight', '/converters/temperature', '/converters/area', '/converters/volume', '/converters/speed', '/converters/time', '/converters/data',
  '/meters-to-feet', '/feet-to-meters', '/inches-to-centimeters', '/centimeters-to-inches', '/kilometers-to-miles', '/miles-to-kilometers',
  '/kg-to-lbs', '/lbs-to-kg', '/grams-to-ounces', '/ounces-to-grams', '/celsius-to-fahrenheit', '/fahrenheit-to-celsius', '/celsius-to-kelvin',
  '/square-meters-to-square-feet', '/square-feet-to-square-meters', '/acres-to-square-meters', '/liters-to-gallons', '/gallons-to-liters', '/milliliters-to-ounces',
  '/kmh-to-mph', '/mph-to-kmh', '/seconds-to-minutes', '/minutes-to-hours', '/hours-to-days', '/bytes-to-kb', '/mb-to-gb', '/gb-to-tb',
  '/json-formatter', '/json-validator', '/json-minifier', '/json-to-csv', '/csv-to-json', '/json-to-xml', '/xml-to-json', '/base64-encoder', '/base64-decoder', '/url-encoder', '/url-decoder', '/unix-timestamp-converter',
  '/blog/meters-to-feet', '/blog/kilograms-to-pounds', '/blog/celsius-to-fahrenheit', '/blog/liters-to-gallons', '/blog/format-json', '/blog/json-to-csv', '/blog/unix-timestamp',
];
await mkdir('client/public', { recursive: true });
const urls = staticPages.map(path => `  <url><loc>${siteUrl}${path}</loc></url>`).join('\n');
await writeFile('client/public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
await writeFile('client/public/robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nDisallow: /test\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log(`Generated SEO files for ${siteUrl} (${staticPages.length} URLs)`);
