import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const inputDir = join(root, "artifacts/lighthouse");
const outputPath = join(root, "artifacts/summary/lighthouse-regression.txt");
const thresholds = JSON.parse(
  await readFile(join(root, "data/lighthouse-thresholds.json"), "utf8")
);
const baseline = JSON.parse(
  await readFile(join(root, "data/lighthouse-baseline.json"), "utf8")
);
const exceptions = JSON.parse(
  await readFile(join(root, "data/lighthouse-exceptions.json"), "utf8")
);
const today = new Date().toISOString().slice(0, 10);
const categories = Object.keys(thresholds);

async function findReports(directory) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) files.push(...(await findReports(path)));
      else if (entry.name.endsWith(".json")) files.push(path);
    }
    return files;
  } catch {
    return [];
  }
}

function pagePath(report) {
  const source = report.finalUrl || report.requestedUrl || "/";
  try {
    return new URL(source).pathname || "/";
  } catch {
    return source.startsWith("/") ? source : "/";
  }
}

const reports = [];
for (const file of await findReports(inputDir)) {
  try {
    const report = JSON.parse(await readFile(file, "utf8"));
    if (report.categories) reports.push(report);
  } catch {
    // Ignore unrelated JSON artifacts.
  }
}

await mkdir(join(root, "artifacts/summary"), { recursive: true });
if (!reports.length) {
  await writeFile(
    outputPath,
    "No Lighthouse JSON reports found; regression check skipped.\n"
  );
  process.exit(0);
}

const failures = [];
for (const report of reports) {
  const page = pagePath(report);
  for (const category of categories) {
    const current = report.categories?.[category]?.score;
    const base = baseline[page]?.[category];
    if (typeof current !== "number" || typeof base !== "number") continue;
    const delta = current - base;
    const exception = exceptions.find(
      rule =>
        rule.page === page &&
        rule.metric === category &&
        (!rule.expiresOn || rule.expiresOn >= today)
    );
    const allowedDrop = exception?.maxDrop ?? thresholds[category];
    if (delta < -allowedDrop) {
      failures.push({
        page,
        category,
        current,
        base,
        delta,
        threshold: allowedDrop,
        exception: Boolean(exception),
      });
    }
  }
}

const lines = [
  `Lighthouse regression check: ${failures.length ? "FAIL" : "PASS"}`,
  "Allowed score drops are measured in absolute percentage points.",
  ...failures.map(
    item =>
      `${item.page} ${item.category}: current=${Math.round(item.current * 100)}%, baseline=${Math.round(item.base * 100)}%, delta=${Math.round(item.delta * 100)} pp, allowed=-${Math.round(item.threshold * 100)} pp${item.exception ? " (exception active)" : ""}`
  ),
];
await writeFile(outputPath, `${lines.join("\n")}\n`);
if (failures.length) {
  console.error(lines.join("\n"));
  process.exit(1);
}
console.log(lines.join("\n"));
