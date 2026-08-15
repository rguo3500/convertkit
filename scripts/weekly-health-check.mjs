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
let rumRouteMetrics = [];
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
      rumRouteMetrics = Array.isArray(parsed.routes)
        ? parsed.routes
            .filter(route => route && typeof route === "object" && typeof route.path === "string")
            .map(route => ({
              path: route.path,
              visits: typeof route.visits === "number" ? route.visits : null,
              lcpP75Ms: typeof route.lcpP75Ms === "number" ? route.lcpP75Ms : null,
              inpP75Ms: typeof route.inpP75Ms === "number" ? route.inpP75Ms : null,
              clsP75: typeof route.clsP75 === "number" ? route.clsP75 : null,
            }))
            .slice(0, 20)
        : [];
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
      routes: rumRouteMetrics,
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
const allTrendHistory = [...trendHistory];
const rumHistoryPreset = process.env.CLOUDFLARE_RUM_HISTORY_PRESET || "";
const presetDays = rumHistoryPreset === "7d" ? 7 : rumHistoryPreset === "30d" ? 30 : null;
const rumHistoryStart = process.env.CLOUDFLARE_RUM_HISTORY_START_DATE || (presetDays ? new Date(started.getTime() - presetDays * 86_400_000).toISOString().slice(0, 10) : "");
const rumHistoryEnd = process.env.CLOUDFLARE_RUM_HISTORY_END_DATE || (presetDays ? started.toISOString().slice(0, 10) : "");
const startTime = rumHistoryStart ? Date.parse(`${rumHistoryStart}T00:00:00Z`) : -Infinity;
const endTime = rumHistoryEnd ? Date.parse(`${rumHistoryEnd}T23:59:59.999Z`) : Infinity;
const hasValidHistoryRange = Number.isFinite(startTime) && Number.isFinite(endTime) && startTime <= endTime;
if (hasValidHistoryRange) {
  trendHistory = trendHistory.filter(item => {
    const collectedAt = Date.parse(item.collectedAt || "");
    return Number.isFinite(collectedAt) && collectedAt >= startTime && collectedAt <= endTime;
  });
}
const historyFilterSummary = hasValidHistoryRange
  ? `History filter: **${rumHistoryPreset === "7d" ? "last 7 days" : rumHistoryPreset === "30d" ? "last 30 days" : `${rumHistoryStart} → ${rumHistoryEnd} UTC`}** (${trendHistory.length} snapshots).`
  : rumHistoryStart || rumHistoryEnd
    ? "History filter: **ignored** because the configured UTC dates are invalid or reversed."
    : "History filter: **all available** (latest 12 verified snapshots).";
const comparisonCurrent = trendHistory.at(-1);
const comparisonBaseline = hasValidHistoryRange
  ? allTrendHistory.find(item => Date.parse(item.collectedAt || "") < startTime)
  : allTrendHistory.at(-2);
const comparisonDelta = (current, baseline, suffix = "") => {
  if (typeof current !== "number" || typeof baseline !== "number") return "n/a";
  const delta = current - baseline;
  return `${delta > 0 ? "+" : ""}${Number(delta.toFixed(3))}${suffix}`;
};
const comparisonSummary = comparisonCurrent && comparisonBaseline
  ? `Window comparison: LCP ${comparisonDelta(comparisonCurrent.lcpP75Ms, comparisonBaseline.lcpP75Ms, " ms")}, INP ${comparisonDelta(comparisonCurrent.inpP75Ms, comparisonBaseline.inpP75Ms, " ms")}, CLS ${comparisonDelta(comparisonCurrent.clsP75, comparisonBaseline.clsP75)} versus the previous verified window.`
  : "Window comparison: baseline unavailable; at least two comparable verified snapshots are required.";
const routeSort = ["path", "lcp", "inp", "cls"].includes(process.env.CLOUDFLARE_RUM_ROUTE_SORT || "")
  ? process.env.CLOUDFLARE_RUM_ROUTE_SORT
  : "path";
const routeMinDelta = Number.isFinite(Number(process.env.CLOUDFLARE_RUM_ROUTE_MIN_DELTA))
  ? Math.max(0, Number(process.env.CLOUDFLARE_RUM_ROUTE_MIN_DELTA))
  : 0;
const routeDifferenceRows = comparisonCurrent && comparisonBaseline && Array.isArray(comparisonCurrent.routes)
  ? comparisonCurrent.routes.slice(0, 20).map(route => {
      const baselineRoute = Array.isArray(comparisonBaseline.routes)
        ? comparisonBaseline.routes.find(item => item.path === route.path)
        : null;
      const deltas = {
        lcp: comparisonDelta(route.lcpP75Ms, baselineRoute?.lcpP75Ms, " ms"),
        inp: comparisonDelta(route.inpP75Ms, baselineRoute?.inpP75Ms, " ms"),
        cls: comparisonDelta(route.clsP75, baselineRoute?.clsP75),
      };
      const magnitude = Math.max(
        ...[deltas.lcp, deltas.inp, deltas.cls].map(value => Math.abs(Number.parseFloat(value) || 0)),
      );
      return { route, deltas, magnitude };
    }).filter(row => row.magnitude >= routeMinDelta).sort((a, b) => {
      if (routeSort === "path") return a.route.path.localeCompare(b.route.path);
      const metricDelta = routeSort === "lcp" ? "lcp" : routeSort === "inp" ? "inp" : "cls";
      return (Number.parseFloat(b.deltas[metricDelta]) || 0) - (Number.parseFloat(a.deltas[metricDelta]) || 0);
    })
  : [];
const routeDifferenceLines = comparisonCurrent && comparisonBaseline && Array.isArray(comparisonCurrent.routes)
  ? [
      "### Route window comparison",
      "",
      "| Route | LCP Δ (ms) | INP Δ (ms) | CLS Δ |",
      "| --- | ---: | ---: | ---: |",
      `Filter: sort=${routeSort}, min absolute delta=${routeMinDelta}.`,
      ...routeDifferenceRows.map(({ route, deltas }) => `| \`${route.path}\` | ${deltas.lcp} | ${deltas.inp} | ${deltas.cls} |`),
    ]
  : ["### Route window comparison", "", "No comparable route-level baseline is available."];
const metricTone = (metric, value) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return "NEUTRAL";
  const threshold = metric === "LCP" ? 2500 : metric === "INP" ? 200 : 0.1;
  return value <= threshold ? "GREEN" : "AMBER";
};
const historyTone = status =>
  status === "FRESH" ? "GREEN" : status === "STALE_OR_INVALID" ? "AMBER" : "NEUTRAL";
const toneBadge = tone => {
  const color = tone === "GREEN" ? "#15803d" : tone === "AMBER" ? "#b45309" : "#64748b";
  return `<span style="color:${color}"><strong>${tone}</strong></span>`;
};
const trendDirection = (current, previous) => {
  if (!previous) return "BASELINE";
  if (current === previous) return "STABLE";
  if (current === "GREEN" && previous === "AMBER") return "IMPROVING";
  if (current === "AMBER" && previous === "GREEN") return "DEGRADING";
  return "CHANGED";
};
const metricBadge = (metric, value) => `${value ?? "n/a"} · ${toneBadge(metricTone(metric, value))}`;
const trendLines = trendHistory.length
  ? [
      "| Collected at (UTC) | Visits | LCP P75 (ms) | INP P75 (ms) | CLS P75 | Status | Trend |",
      "| --- | ---: | ---: | ---: | ---: | --- | --- |",
      ...trendHistory.map((item, index) => {
        const tone = historyTone(item.status);
        const previousTone = index > 0 ? historyTone(trendHistory[index - 1].status) : null;
        return `| ${item.collectedAt || "n/a"} | ${item.visits ?? "n/a"} | ${metricBadge("LCP", item.lcpP75Ms)} | ${metricBadge("INP", item.inpP75Ms)} | ${metricBadge("CLS", item.clsP75)} | ${toneBadge(tone)} | ${trendDirection(tone, previousTone)} |`;
      }),
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
const latestRouteMetrics = trendHistory.at(-1)?.routes || rumRouteMetrics;
const routeTrendLines = latestRouteMetrics.length
  ? [
      "## RUM by page route",
      "",
      "The latest verified snapshot is split by page route so high-traffic tools can be reviewed independently.",
      "",
      "| Route | Visits | LCP P75 | INP P75 | CLS P75 |",
      "| --- | ---: | --- | --- | --- |",
      ...latestRouteMetrics.map(route => `| \`${route.path}\` | ${route.visits ?? "n/a"} | ${metricBadge("LCP", route.lcpP75Ms)} ms | ${metricBadge("INP", route.inpP75Ms)} ms | ${metricBadge("CLS", route.clsP75)} |`),
    ]
  : ["## RUM by page route", "", "No route-level RUM payload was provided; aggregate metrics remain available above."];
const routePaths = Array.from(
  new Set(trendHistory.flatMap(snapshot => (Array.isArray(snapshot.routes) ? snapshot.routes : []).map(route => route.path)))
).slice(0, 6);
const routeHistoryLines = routePaths.length
  ? [
      "### Route-level RUM history",
      "",
      "Each route chart compares verified LCP and INP P75 snapshots; the companion table carries CLS because its scale differs from milliseconds.",
      "",
      ...routePaths.flatMap(path => {
        const routeSnapshots = trendHistory.map((snapshot, index) => ({
          index: index + 1,
          ...(Array.isArray(snapshot.routes) ? snapshot.routes.find(route => route.path === path) : {}),
        }));
        return [
          `#### \`${path}\``,
          "",
          "```mermaid",
          "xychart-beta",
          `  title \"${path.replaceAll('\\"', '')} — LCP / INP P75\"`,
          "  x-axis [" + routeSnapshots.map(item => `\\"${item.index}\\"`).join(", ") + "]",
          '  y-axis "Milliseconds" 0 --> ' + Math.max(...routeSnapshots.map(item => Math.max(item.lcpP75Ms || 0, item.inpP75Ms || 0)), 1),
          "  line [" + routeSnapshots.map(item => item.lcpP75Ms ?? 0).join(", ") + "]",
          "  line [" + routeSnapshots.map(item => item.inpP75Ms ?? 0).join(", ") + "]",
          "```",
          "",
          "| Snapshot | Visits | CLS P75 | LCP tone | INP tone |",
          "| ---: | ---: | --- | --- | --- |",
          ...routeSnapshots.map(item => `| ${item.index} | ${item.visits ?? "n/a"} | ${metricBadge("CLS", item.clsP75)} | ${toneBadge(metricTone("LCP", item.lcpP75Ms))} | ${toneBadge(metricTone("INP", item.inpP75Ms))} |`),
          "",
        ];
      }),
    ]
  : ["### Route-level RUM history", "", "No route-level history is available yet."];
const mobileTrendHistory = trendHistory.slice(-3);
const mobileTrendLines = mobileTrendHistory.length
  ? [
      "### Mobile summary",
      "",
      "Metrics are ordered by review priority: **LCP P75 → INP P75 → CLS**.",
      "Thresholds: LCP ≤ 2500 ms, INP ≤ 200 ms, CLS ≤ 0.1 are **GREEN**; values above the good threshold are **AMBER**; missing values are **NEUTRAL**.",
      "",
      "| # | LCP | INP | CLS | Status |",
      "| ---: | ---: | ---: | ---: | --- |",
      ...mobileTrendHistory.map(
        (item, index) =>
          `| ${index + 1} | ${metricBadge("LCP", item.lcpP75Ms)} ms | ${metricBadge("INP", item.inpP75Ms)} ms | ${metricBadge("CLS", item.clsP75)} | ${item.status || "n/a"} |`
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
  `Preset selected: **${rumHistoryPreset || "all"}**.`,
  `Window start (UTC): **${rumHistoryStart || "all available"}**.`,
  `Window end (UTC): **${rumHistoryEnd || "all available"}**.`,
  "Timezone: **UTC**.",
  historyFilterSummary,
  comparisonSummary,
  ...routeDifferenceLines,
  "Status colors: GREEN = fresh and review-ready, AMBER = stale or invalid, NEUTRAL = unavailable. LCP ≤ 2500 ms, INP ≤ 200 ms, CLS ≤ 0.1 are GREEN; higher values are AMBER. Trend direction compares each snapshot with the previous verified snapshot.",
  "",
  ...trendLines,
  "",
  ...mobileTrendLines,
  "",
  ...routeTrendLines,
  "",
  ...routeHistoryLines,
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
const routeExportRows = routeDifferenceRows.map(({ route, deltas }) => ({
  path: route.path,
  lcpDelta: deltas.lcp,
  inpDelta: deltas.inp,
  clsDelta: deltas.cls,
}));
const safeToken = value => String(value || "all").replace(/[^a-zA-Z0-9.-]+/g, "_");
const commitSha = safeToken(process.env.GITHUB_SHA || "local").slice(0, 7);
const runTimestamp = started.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
const exportStem = `rum-route-differences-${safeToken(rumHistoryPreset || "all")}-${safeToken(rumHistoryStart || "all")}-${safeToken(rumHistoryEnd || "all")}-${commitSha}-${runTimestamp}`;
const routeExport = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  runTimestamp,
  commitSha,
  preset: rumHistoryPreset || "all",
  windowStart: rumHistoryStart || null,
  windowEnd: rumHistoryEnd || null,
  sort: routeSort,
  minAbsoluteDelta: routeMinDelta,
  rows: routeExportRows,
};
await writeFile(
  resolve(dirname(output), `${exportStem}.json`),
  `${JSON.stringify(routeExport, null, 2)}\n`,
);
const csvEscape = value => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csvRows = [
  ["route", "lcp_delta", "inp_delta", "cls_delta"],
  ...routeExportRows.map(row => [row.path, row.lcpDelta, row.inpDelta, row.clsDelta]),
];
await writeFile(
  resolve(dirname(output), `${exportStem}.csv`),
  `${csvRows.map(row => row.map(csvEscape).join(",")).join("\n")}\n`,
);
await writeFile(output, lines.join("\n"));
if (overall !== "PASS") process.exitCode = 1;
