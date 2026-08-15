import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const baseUrl = process.env.A11Y_BASE_URL ?? "http://127.0.0.1:3000";
const routes = [
  "/",
  "/meters-to-feet",
  "/format-converters",
  "/bulk-converter",
  "/pricing",
];
const outputDir = process.env.A11Y_OUTPUT_DIR ?? "artifacts/axe/ci";
const axeSourcePath = resolve("node_modules/axe-core/axe.min.js");

await mkdir(outputDir, { recursive: true });
const axeSource = await readFile(axeSourcePath, "utf8");
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});
const failures = [];
try {
  for (const route of routes) {
    const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
    const url = `${baseUrl}${route}`;
    const page = await browser.newPage();
    console.log(`\naxe: ${url}`);
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
      await page.addScriptTag({ content: axeSource });
      const result = await page.evaluate(async () => window.axe.run(document));
      await writeFile(
        `${outputDir}/${slug}.json`,
        `${JSON.stringify(result, null, 2)}\n`
      );
      if (result.violations.length)
        failures.push({ route, violations: result.violations });
      console.log(`${route}: ${result.violations.length} violations`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
if (failures.length) {
  console.error(
    `axe audit failed: ${failures.reduce((total, item) => total + item.violations.length, 0)} violations across ${failures.length} routes`
  );
  process.exit(1);
}
console.log(`\naxe audit passed for ${routes.length} routes.`);
