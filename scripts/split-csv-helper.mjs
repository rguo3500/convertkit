import { readFile, writeFile } from 'node:fs/promises';
const path='client/src/pages/ProPages.tsx';
const text=await readFile(path,'utf8');
const withoutHelper=text.replace(/function parseCsv\(text:string\)\{.*?\nexport function BulkPage/s, "export function BulkPage");
const withImport=withoutHelper.replace("import SEO from '../components/SEO';", "import SEO from '../components/SEO';\nimport { parseCsv } from '../lib/csv';");
await writeFile(path,withImport);
console.log('BulkPage now imports shared CSV helpers');
