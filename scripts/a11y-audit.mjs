import { mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const baseUrl = process.env.A11Y_BASE_URL ?? 'http://127.0.0.1:3000';
const routes = ['/', '/meters-to-feet', '/format-converters', '/bulk-converter', '/pricing'];
const outputDir = process.env.A11Y_OUTPUT_DIR ?? 'artifacts/axe/ci';

await mkdir(outputDir, { recursive: true });

const run = (args) => new Promise((resolve, reject) => {
  const child = spawn('pnpm', ['exec', 'axe', ...args], { stdio: 'inherit', shell: false });
  child.on('error', reject);
  child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`axe exited with code ${code}`)));
});

for (const route of routes) {
  const slug = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
  const url = `${baseUrl}${route}`;
  console.log(`\naxe: ${url}`);
  await run([url, '--save', `${outputDir}/${slug}.json`, '--browser', 'chrome', '--load-delay', '500', '--exit']);
}

console.log(`\naxe audit passed for ${routes.length} routes.`);
