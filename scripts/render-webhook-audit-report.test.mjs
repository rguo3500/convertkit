import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const root = path.resolve(new URL("..", import.meta.url).pathname);

test("renders a safe webhook trend report from retained history", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "convertkit-webhook-report-"));
  const historyPath = path.join(tempDir, "webhook-history.json");
  const outputDir = path.join(tempDir, "summary");
  fs.writeFileSync(historyPath, JSON.stringify([
    { recordedAt: "2026-08-15T00:00:00.000Z", status: "failed", failureCategory: "HTTP_5XX", failureBuckets: { "2026-08-15:00Z · HTTP_5XX": 2 } },
    { recordedAt: "2026-08-15T01:00:00.000Z", status: "delivered", failureCategory: "none", failureBuckets: {} },
  ]));
  execFileSync(process.execPath, [path.join(root, "scripts/render-webhook-audit-report.mjs"), historyPath, outputDir], { encoding: "utf8" });
  const markdown = fs.readFileSync(path.join(outputDir, "webhook-audit-trend.md"), "utf8");
  const html = fs.readFileSync(path.join(outputDir, "webhook-audit-trend.html"), "utf8");
  assert.match(markdown, /HTTP_5XX \| 2/);
  assert.match(html, /Failure buckets/);
  assert.match(html, /Latest 2 retained runs/);
  assert.doesNotMatch(html, /TEAM_ALERT_WEBHOOK_URL|RUM_EXPORT_SIGNING_KEY|TEAM_ALERT_MAX_ATTEMPTS/i);
  fs.rmSync(tempDir, { recursive: true, force: true });
});
