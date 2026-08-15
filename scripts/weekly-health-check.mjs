import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const site = process.env.SITE_URL || "https://lovexiaoyue.cc.cd";
const output = resolve(
  process.argv[2] || "artifacts/weekly-health/health-check.md"
);
const historyPath = resolve(
  process.env.CLOUDFLARE_RUM_HISTORY_PATH || "docs/rum-history.json"
);
const routes = [
  "/",
  "/robots.txt",
  "/sitemap.xml",
  "/bulk-converter",
  "/json-formatter",
];
const started = new Date();
const rumMaxAgeDays = Number(process.env.CLOUDFLARE_RUM_MAX_AGE_DAYS || 8);
let rumMetrics = null;
let rumFreshness = "NOT_CONFIGURED";
if (process.env.CLOUDFLARE_RUM_METRICS_JSON) {
  try {
    const parsed = JSON.parse(process.env.CLOUDFLARE_RUM_METRICS_JSON);
    if (parsed && typeof parsed === "object") {
      rumMetrics = {
        visits: typeof parsed.visits === "number" ? parsed.visits : null,
        lcpP75Ms: typeof parsed.lcpP75Ms === "number" ? parsed.lcpP75Ms : null,
        inpP75Ms: typeof parsed.inpP75Ms === "number" ? parsed.inpP75Ms : null,
        clsP75: typeof parsed.clsP75 === "number" ? parsed.clsP75 : null,
        windowStart:
          typeof parsed.windowStart === "string" ? parsed.windowStart : null,
        windowEnd:
          typeof parsed.windowEnd === "string" ? parsed.windowEnd : null,
        collectedAt:
          typeof parsed.collectedAt === "string" ? parsed.collectedAt : null,
      };
      const collectedAt = rumMetrics.collectedAt
        ? Date.parse(rumMetrics.collectedAt)
        : NaN;
      const windowStart = rumMetrics.windowStart
        ? Date.parse(rumMetrics.windowStart)
        : NaN;
      const windowEnd = rumMetrics.windowEnd
        ? Date.parse(rumMetrics.windowEnd)
        : NaN;
      const ageDays = Number.isFinite(collectedAt)
        ? (started.getTime() - collectedAt) / 86_400_000
        : Infinity;
      rumMetrics.ageDays = Number.isFinite(ageDays)
        ? Math.round(ageDays * 10) / 10
        : null;
      rumFreshness =
        Number.isFinite(collectedAt) &&
        Number.isFinite(windowStart) &&
        Number.isFinite(windowEnd) &&
        windowStart < windowEnd &&
        windowEnd <= started.getTime() + 300_000 &&
        ageDays >= -0.25 &&
        ageDays <= rumMaxAgeDays
          ? "FRESH"
          : "STALE_OR_INVALID";
    }
  } catch {
    rumMetrics = null;
  }
}

async function check(path) {
  const url = new URL(path, site).toString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
    });
    const body =
      path.endsWith(".xml") || path.endsWith(".txt")
        ? await response.text()
        : "";
    return {
      path,
      url,
      status: response.status,
      ok: response.ok,
      finalUrl: response.url,
      body,
    };
  } catch (error) {
    return {
      path,
      url,
      status: 0,
      ok: false,
      finalUrl: "",
      body: "",
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

if (rumMetrics && rumFreshness === "FRESH") {
  try {
    const existingHistory = JSON.parse(await readFile(historyPath, "utf8"));
    const history = Array.isArray(existingHistory) ? existingHistory : [];
    history.push({
      collectedAt: rumMetrics.collectedAt,
      windowStart: rumMetrics.windowStart,
      windowEnd: rumMetrics.windowEnd,
      visits: rumMetrics.visits,
      lcpP75Ms: rumMetrics.lcpP75Ms,
      inpP75Ms: rumMetrics.inpP75Ms,
      clsP75: rumMetrics.clsP75,
      status: rumFreshness,
    });
    await writeFile(
      historyPath,
      `${JSON.stringify(history.slice(-12), null, 2)}\n`
    );
  } catch {
    // A missing or read-only history file must not invalidate endpoint checks.
  }
}
const checks = await Promise.all(routes.map(check));
const sitemap = checks.find(item => item.path === "/sitemap.xml");
const robots = checks.find(item => item.path === "/robots.txt");
const sitemapHasProductionHost =
  sitemap?.body.includes(new URL(site).host) ?? false;
const robotsHasSitemap = robots?.body.includes(`${site}/sitemap.xml`) ?? false;
const allHttpOk = checks.every(item => item.ok);
const seoOk = sitemapHasProductionHost && robotsHasSitemap;
let trendHistory = [];
try {
  const storedHistory = JSON.parse(await readFile(historyPath, "utf8"));
  trendHistory = Array.isArray(storedHistory) ? storedHistory.slice(-12) : [];
} catch {
  trendHistory = [];
}
const trendLines = trendHistory.length
  ? [
      "| Collected at (UTC) | Visits | LCP P75 (ms) | INP P75 (ms) | CLS P75 | Status |",
      "| --- | ---: | ---: | ---: | ---: | --- |",
      ...trendHistory.map(
        item =>
          `| ${item.collectedAt || "n/a"} | ${item.visits ?? "n/a"} | ${item.lcpP75Ms ?? "n/a"} | ${item.inpP75Ms ?? "n/a"} | ${item.clsP75 ?? "n/a"} | ${item.status || "n/a"} |`
      ),
      "",
      "```mermaid",
      "xychart-beta",
      '  title "RUM P75 trend (verified snapshots)"',
      "  x-axis [" +
        trendHistory.map((_, index) => `\"${index + 1}\"`).join(", ") +
        "]",
      '  y-axis "Milliseconds" 0 --> ' +
        Math.max(
          ...trendHistory.map(item =>
            Math.max(item.lcpP75Ms || 0, item.inpP75Ms || 0)
          ),
          1
        ),
      "  line [" +
        trendHistory.map(item => item.lcpP75Ms ?? 0).join(", ") +
        "]",
      "  line [" +
        trendHistory.map(item => item.inpP75Ms ?? 0).join(", ") +
        "]",
      "```",
    ]
  : ["No verified RUM snapshots are available yet."];
const mobileTrendHistory = trendHistory.slice(-3);
const mobileTrendLines = mobileTrendHistory.length
  ? [
      "### Mobile summary",
      "",
      "| # | LCP | INP | CLS | Status |",
      "| ---: | ---: | ---: | ---: | --- |",
      ...mobileTrendHistory.map(
        (item, index) =>
          `| ${index + 1} | ${item.lcpP75Ms ?? "n/a"} ms | ${item.inpP75Ms ?? "n/a"} ms | ${item.clsP75 ?? "n/a"} | ${item.status || "n/a"} |`
      ),
    ]
  : ["### Mobile summary", "", "No verified snapshots available."];
const rumNeedsReview = rumFreshness === "STALE_OR_INVALID";
const rumStatusTone =
  rumFreshness === "FRESH"
    ? "GREEN"
    : rumFreshness === "STALE_OR_INVALID"
      ? "AMBER"
      : "NEUTRAL";
const overall = allHttpOk && seoOk && !rumNeedsReview ? "PASS" : "REVIEW";

const lines = [
  "# ConvertKit weekly health check",
  "",
  `- Checked at: ${started.toISOString()}`,
  `- Site: ${site}`,
  `- Overall: **${overall}**`,
  "",
  "## Automated endpoint checks",
  "",
  "| Route | HTTP | Final URL | Result |",
  "| --- | ---: | --- | --- |",
  ...checks.map(
    item =>
      `| \`${item.path}\` | ${item.status || "n/a"} | ${item.finalUrl || "n/a"} | ${item.ok ? "PASS" : `FAIL: ${item.error || "HTTP error"}`} |`
  ),
  "",
  "## SEO file checks",
  "",
  `- Sitemap contains production hostname: **${sitemapHasProductionHost ? "PASS" : "REVIEW"}**`,
  `- Robots declares production Sitemap URL: **${robotsHasSitemap ? "PASS" : "REVIEW"}**`,
  "",
  "## Cloudflare Web Analytics RUM",
  "",
  rumMetrics
    ? "| Status | Source | Reporting window (UTC) | Collected at (UTC) | Age |"
    : "| Status | Source | Reporting window (UTC) | Collected at (UTC) | Age |",
  "| --- | --- | --- | --- | ---: |",
  rumMetrics
    ? `| **${rumFreshness} · ${rumStatusTone}** | Cloudflare Web Analytics | ${rumMetrics.windowStart || "n/a"} → ${rumMetrics.windowEnd || "n/a"} | ${rumMetrics.collectedAt || "n/a"} | ${rumMetrics.ageDays ?? "n/a"} days |`
    : "| **NOT_CONFIGURED · NEUTRAL** | Cloudflare Web Analytics | n/a | n/a | n/a |",
  rumMetrics
    ? `- Source: **Cloudflare Web Analytics** (provided by the configured RUM exporter)`
    : "- Status: **Not configured** — set `CLOUDFLARE_RUM_METRICS_JSON` in the scheduled workflow to include verified RUM data.",
  `- Thresholds: **GREEN/FRESH** means valid data collected within ${rumMaxAgeDays} days; **AMBER/STALE_OR_INVALID** means expired or invalid time metadata; **NEUTRAL/NOT_CONFIGURED** means no verified RUM payload was provided.`,
  ...(rumMetrics
    ? [
        `- Data freshness: **${rumFreshness}** (maximum age: ${rumMaxAgeDays} days)`,
        `- Reporting window: **${rumMetrics.windowStart || "n/a"} → ${rumMetrics.windowEnd || "n/a"}**`,
        `- Collected at: **${rumMetrics.collectedAt || "n/a"}** (${rumMetrics.ageDays ?? "n/a"} days old)`,
      ]
    : []),
  ...(rumMetrics
    ? [
        `- Visits: **${rumMetrics.visits ?? "n/a"}**`,
        `- LCP P75: **${rumMetrics.lcpP75Ms ?? "n/a"} ms**`,
        `- INP P75: **${rumMetrics.inpP75Ms ?? "n/a"} ms**`,
        `- CLS P75: **${rumMetrics.clsP75 ?? "n/a"}**`,
      ]
    : []),
  "",
  "## RUM trend history",
  "",
  "Recent verified snapshots are retained in `docs/rum-history.json`; no row is added when RUM data is missing or stale.",
  "",
  ...trendLines,
  "",
  ...mobileTrendLines,
  "",
  "## Manual review fields",
  "",
  "| Source | Status | Notes |",
  "| --- | --- | --- |",
  "| Cloudflare Web Analytics | `正常 / 观察 / 异常` | Record traffic, error rate, LCP, INP and CLS from the dashboard. |",
  "| Google Search Console Sitemap | `正常 / 观察 / 异常` | Record last read time, processing errors and indexed URL trend. |",
  "| Google URL Inspection | `通过 / 需要处理` | Inspect homepage, one conversion pair and one format tool. |",
  "",
  "## Action items",
  "",
  "- [ ] Review any `REVIEW` or failed endpoint above.",
  "- [ ] Compare Cloudflare real-user metrics with the Lighthouse baseline.",
  "- [ ] Record owner and due date for every follow-up issue.",
  "",
  "Generated by `scripts/weekly-health-check.mjs`.",
  "",
];

await mkdir(dirname(output), { recursive: true });
await writeFile(output, lines.join("\n"));
if (overall !== "PASS") process.exitCode = 1;
