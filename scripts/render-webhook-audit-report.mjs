import fs from "node:fs";

const historyPath = process.argv[2] || "artifacts/webhook-history.json";
const outputDir = process.argv[3] || "artifacts/summary";
fs.mkdirSync(outputDir, { recursive: true });
const history = fs.existsSync(historyPath)
  ? JSON.parse(fs.readFileSync(historyPath, "utf8"))
  : [];
const recent = Array.isArray(history) ? history.slice(-10) : [];
const categories = {};
for (const run of recent) {
  for (const [bucket, count] of Object.entries(run.failureBuckets || {})) {
    const category = bucket.split(" · ").at(-1) || "UNKNOWN";
    categories[category] = (categories[category] || 0) + Number(count || 0);
  }
}
const totalFailures = Object.values(categories).reduce(
  (sum, count) => sum + count,
  0
);
const maxFailures = Math.max(1, ...Object.values(categories));
const esc = value =>
  String(value ?? "").replace(
    /[&<>\"]/g,
    char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]
  );
const rows = recent
  .map(
    run =>
      `<tr><td>${esc(run.recordedAt)}</td><td class="${run.status === "delivered" ? "ok" : run.status === "failed" ? "bad" : "muted"}">${esc(run.status)}</td><td>${esc(run.failureCategory || "none")}</td><td>${Object.values(run.failureBuckets || {}).reduce((sum, count) => sum + Number(count || 0), 0)}</td></tr>`
  )
  .join("\n");
const bars =
  Object.entries(categories)
    .map(
      ([category, count]) =>
        `<div class="bar-row"><span>${esc(category)}</span><div class="bar-track"><div class="bar" style="width:${Math.round((count / maxFailures) * 100)}%"></div></div><strong>${count}</strong></div>`
    )
    .join("\n") || '<p class="muted">No failures in the latest window.</p>';
const markdown = `# Webhook audit trend\n\nGenerated at ${new Date().toISOString()}. The report covers the latest ${recent.length} retained runs and contains no webhook URL or secret.\n\n| Metric | Value |\n| --- | ---: |\n| Runs in window | ${recent.length} |\n| Total failures | ${totalFailures} |\n| Latest status | ${recent.at(-1)?.status || "not configured"} |\n\n## Failure buckets\n\n| Category | Count |\n| --- | ---: |\n${
  Object.entries(categories)
    .map(([category, count]) => `| ${category} | ${count} |`)
    .join("\n") || "| none | 0 |"
}\n\n## Recent runs\n\n| Recorded at (UTC) | Status | Failure category | Failure count |\n| --- | --- | --- | ---: |\n${recent.map(run => `| ${run.recordedAt || "unknown"} | ${run.status || "unknown"} | ${run.failureCategory || "none"} | ${Object.values(run.failureBuckets || {}).reduce((sum, count) => sum + Number(count || 0), 0)} |`).join("\n") || "| none | not configured | none | 0 |"}\n`;
const html = `<!doctype html><meta charset="utf-8"><title>ConvertKit webhook audit trend</title><style>body{font:15px system-ui,sans-serif;max-width:960px;margin:40px auto;padding:0 20px;color:#172033;background:#f7f9fc}main{background:#fff;border:1px solid #dce3ee;padding:28px;box-shadow:0 12px 30px #17203312}h1{margin-top:0}.metrics{display:flex;gap:12px;flex-wrap:wrap}.metric{border:1px solid #dce3ee;padding:14px 18px;min-width:150px}.metric strong{display:block;font-size:26px;margin-top:4px}.bar-row{display:grid;grid-template-columns:180px 1fr 40px;gap:12px;align-items:center;margin:12px 0}.bar-track{height:12px;background:#e8edf5}.bar{height:100%;background:#1d56c9}.ok{color:#087f5b}.bad{color:#b42318}.muted{color:#667085}table{border-collapse:collapse;width:100%;margin-top:20px}th,td{border-bottom:1px solid #e7ebf2;text-align:left;padding:9px}small{color:#667085}</style><main><h1>Webhook audit trend</h1><small>Latest ${recent.length} retained runs · generated ${esc(new Date().toISOString())} · secrets omitted</small><section class="metrics"><div class="metric">Window runs<strong>${recent.length}</strong></div><div class="metric">Total failures<strong>${totalFailures}</strong></div><div class="metric">Latest status<strong>${esc(recent.at(-1)?.status || "not configured")}</strong></div></section><h2>Failure buckets</h2>${bars}<h2>Recent runs</h2><table><thead><tr><th>Recorded at (UTC)</th><th>Status</th><th>Failure category</th><th>Failures</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No runs recorded.</td></tr>'}</tbody></table></main>`;
fs.writeFileSync(`${outputDir}/webhook-audit-trend.md`, markdown);
fs.writeFileSync(`${outputDir}/webhook-audit-trend.html`, html);
console.log(`Rendered webhook audit trend for ${recent.length} runs`);
