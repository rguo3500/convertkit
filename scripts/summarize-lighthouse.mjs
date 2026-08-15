import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const root = resolve(process.cwd());
const inputDir = join(root, "artifacts/lighthouse");
const outputDir = join(root, "artifacts/summary");
const baselinePath = join(root, "data/lighthouse-baseline.json");
const categories = ["performance", "accessibility", "best-practices", "seo"];

async function findJsonFiles(directory) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) files.push(...(await findJsonFiles(path)));
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

function score(report, category) {
  const value = report.categories?.[category]?.score;
  return typeof value === "number" ? value : null;
}

const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
const files = await findJsonFiles(inputDir);
const reports = [];
for (const file of files) {
  try {
    const report = JSON.parse(await readFile(file, "utf8"));
    if (report.categories) reports.push(report);
  } catch {
    // Ignore non-Lighthouse JSON artifacts.
  }
}

await mkdir(outputDir, { recursive: true });
const lines = [
  "# Lighthouse CI summary",
  "",
  "Scores are shown as percentages. Delta is current minus the checked-in local baseline; a negative value requires review, not automatic rollback.",
  "",
];
if (!reports.length) {
  lines.push(
    "No Lighthouse JSON reports were found. Inspect the workflow log and uploaded artifacts."
  );
} else {
  lines.push("| Page | Metric | Current | Baseline | Delta |");
  lines.push("| --- | --- | ---: | ---: | ---: |");
  for (const report of reports.sort((a, b) =>
    pagePath(a).localeCompare(pagePath(b))
  )) {
    const page = pagePath(report);
    for (const category of categories) {
      const current = score(report, category);
      const base = baseline[page]?.[category] ?? null;
      const currentText =
        current === null ? "n/a" : `${Math.round(current * 100)}%`;
      const baseText = base === null ? "n/a" : `${Math.round(base * 100)}%`;
      const deltaText =
        current === null || base === null
          ? "n/a"
          : `${current - base >= 0 ? "+" : ""}${Math.round((current - base) * 100)} pp`;
      lines.push(
        `| ${page} | ${category} | ${currentText} | ${baseText} | ${deltaText} |`
      );
    }
  }
}
lines.push(
  "",
  `Reports scanned: ${reports.length}`,
  `Source baseline: ${relative(root, baselinePath)}`,
  ""
);
await writeFile(
  join(outputDir, "lighthouse-summary.md"),
  `${lines.join("\n")}\n`
);
