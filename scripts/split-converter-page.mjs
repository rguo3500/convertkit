import { readFile, writeFile } from 'node:fs/promises';
const path='client/src/pages/ConverterPage.tsx';
const text=await readFile(path,'utf8');
const lines=text.split('\n');
const head=lines.slice(0,6);
const tail=lines.slice(28);
const imports="import { converters, find, formatNumber, names, precisionOptions, sets, temp, type Converter } from '../lib/conversion';";
await writeFile(path,[...head,imports,...tail].join('\n'));
console.log('ConverterPage now imports shared conversion primitives');
