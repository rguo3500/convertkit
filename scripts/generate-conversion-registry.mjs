import { mkdir, readFile, writeFile } from 'node:fs/promises';
const pairs=JSON.parse(await readFile('data/conversion-pairs.json','utf8'));
await mkdir('client/src/data',{recursive:true});
const body=`/* Generated from data/conversion-pairs.json. Do not edit manually. */\nexport const conversionRegistry = ${JSON.stringify(pairs,null,2)} as const;\nexport const conversionSlugs = new Set(conversionRegistry.map(pair => pair.slug));\n`;
await writeFile('client/src/data/conversionRegistry.ts',body);
console.log(`Generated conversion registry for ${pairs.length} pairs`);
