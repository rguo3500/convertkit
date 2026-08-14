import { readFile } from 'node:fs/promises';
const pairs=JSON.parse(await readFile('data/conversion-pairs.json','utf8'));
const required=['slug','category','from','to'];
const errors=[];const slugs=new Set();
for(const [index,pair] of pairs.entries()){
  for(const key of required) if(typeof pair[key]!=='string'||!pair[key].trim()) errors.push(`row ${index+1}: missing ${key}`);
  if(slugs.has(pair.slug)) errors.push(`duplicate slug: ${pair.slug}`);
  slugs.add(pair.slug);
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(pair.slug)) errors.push(`invalid slug: ${pair.slug}`);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`Validated ${pairs.length} conversion pairs; ${slugs.size} unique slugs.`);
