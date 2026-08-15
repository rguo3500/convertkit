import { readdir, readFile, mkdir, writeFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const inputDir = join(root, "artifacts/production-lighthouse");
const outputPath =
  process.argv[2] ||
  join(root, "artifacts/weekly-health/production-lighthouse-summary.md");
const baselinePath = join(root, "data/production-lighthouse-baseline.json");
const categories = ["performance", "accessibility", "best-practices", "seo"];
const thresholds = {
  performance: 0.1,
  accessibility: 0.05,
  "best-practices": 0.05,
  seo: 0.05,
};
const allowManagedRobotsReview =
  process.env.ALLOW_CLOUDFLARE_MANAGED_ROBOTS !== "false";

async function findJsonFiles(directory) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const file = join(directory, entry.name);
      if (entry.isDirectory()) files.push(...(await findJsonFiles(file)));
      else if (entry.name.endsWith(".json")) files.push(file);
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
const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
const reportsByPage = new Map();
for (const file of await findJsonFiles(inputDir)) {
  try {
    const report = JSON.parse(await readFile(file, "utf8"));
    if (!report.categories) continue;
    const page = pagePath(report);
    const modifiedAt = (await stat(file)).mtimeMs;
    const previous = reportsByPage.get(page);
    if (!previous || modifiedAt > previous.modifiedAt)
      reportsByPage.set(page, { report, modifiedAt });
  } catch {}
}
const reports = [...reportsByPage.values()].map(item => item.report);
const failures = [];
const lines = [
  "# Production Lighthouse baseline comparison",
  "",
  `Site: ${baseline.siteUrl}`,
  `Baseline captured at: ${baseline.capturedAt}`,
  `Reports scanned: ${reports.length} (latest report retained per page)`,
  "",
  "| Page | Metric | Current | Baseline | Delta | Result |",
  "| --- | --- | ---: | ---: | ---: | --- |",
];
for (const report of reports.sort((a, b) =>
  pagePath(a).localeCompare(pagePath(b))
)) {
  const page = pagePath(report);
  for (const category of categories) {
    const current = report.categories?.[category]?.score;
    const base = baseline.pages?.[page]?.[category];
    if (typeof current !== "number" || typeof base !== "number") {
      lines.push(
        `| ${page} | ${category} | n/a | ${typeof base === "number" ? `${Math.round(base * 100)}%` : "n/a"} | n/a | REVIEW |`
      );
      continue;
    }
    const delta = current - base;
    const allowedDrop = thresholds[category];
    const managedRobotsReview =
      allowManagedRobotsReview &&
      category === "seo" &&
      report.audits?.["robots-txt"]?.score === 0 &&
      baseline.siteUrl.includes("lovexiaoyue.cc.cd");
    const result =
      delta < -allowedDrop
        ? managedRobotsReview
          ? "REVIEW_EXTERNAL"
          : "FAIL"
        : "PASS";
    if (result === "FAIL")
      failures.push({ page, category, current, base, delta, allowedDrop });
    lines.push(
      `| ${page} | ${category} | ${Math.round(current * 100)}% | ${Math.round(base * 100)}% | ${delta >= 0 ? "+" : ""}${Math.round(delta * 100)} pp | ${result} |`
    );
  }
}
lines.push("", `Overall result: **${failures.length ? "FAIL" : "PASS"}**`);
if (
  allowManagedRobotsReview &&
  reports.some(report => report.audits?.["robots-txt"]?.score === 0)
) {
  lines.push(
    "",
    "> REVIEW_EXTERNAL: Lighthouse detected a robots.txt issue on the production hostname. Cloudflare Managed content must be reviewed in the dashboard before changing the application baseline."
  );
}
if (failures.length) {
  lines.push(
    "",
    "## Regressions",
    "",
    ...failures.map(
      item =>
        `- ${item.page} ${item.category}: current ${Math.round(item.current * 100)}%, baseline ${Math.round(item.base * 100)}%, delta ${Math.round(item.delta * 100)} pp, allowed drop ${Math.round(item.allowedDrop * 100)} pp`
    )
  );
}
await mkdir(join(outputPath, ".."), { recursive: true });
await writeFile(outputPath, `${lines.join("\n")}\n`);
console.log(lines.join("\n"));
if (
  failures.length &&
  process.env.FAIL_ON_PRODUCTION_LIGHTHOUSE_REGRESSION === "true"
)
  process.exit(1);
