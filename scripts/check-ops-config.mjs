import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const outputPath = process.argv[2] || "artifacts/summary/ops-config-status.md";
const signingKeyConfigured = Boolean(process.env.RUM_EXPORT_SIGNING_KEY);
const signatureRequired = process.env.REQUIRE_RUM_EXPORT_SIGNATURE === "true";
const allowManagedRobots =
  process.env.ALLOW_CLOUDFLARE_MANAGED_ROBOTS !== "false";
const lighthouseBlocking =
  process.env.FAIL_ON_PRODUCTION_LIGHTHOUSE_REGRESSION === "true";
const robotsBlocking = process.env.FAIL_ON_PRODUCTION_ROBOTS_AUDIT === "true";
const checks = [
  [
    "RUM signing key configured",
    signingKeyConfigured,
    signingKeyConfigured ? "configured" : "not configured",
  ],
  [
    "Strict signature mode",
    !signatureRequired || signingKeyConfigured,
    signatureRequired ? "required" : "optional",
  ],
  [
    "Cloudflare Managed robots review",
    true,
    allowManagedRobots ? "review mode" : "strict mode",
  ],
  [
    "Lighthouse regression blocking",
    true,
    lighthouseBlocking ? "blocking" : "report only",
  ],
  ["robots audit blocking", true, robotsBlocking ? "blocking" : "report only"],
];
const failed = checks.filter(([, passed]) => !passed);
const warnings = [];
if (!signingKeyConfigured)
  warnings.push(
    "RUM_EXPORT_SIGNING_KEY is absent; configure it in GitHub Actions Secrets before requiring signatures."
  );
if (lighthouseBlocking && allowManagedRobots)
  warnings.push(
    "Lighthouse blocking is enabled while Cloudflare Managed robots review remains enabled; inspect robots.txt first."
  );
const lines = [
  "# Operations configuration status",
  "",
  "Secrets are represented only as configured/not configured; values are never printed.",
  "",
  "| Check | Result | State |",
  "| --- | --- | --- |",
  ...checks.map(
    ([name, passed, state]) =>
      `| ${name} | **${passed ? "PASS" : "FAIL"}** | ${state} |`
  ),
  "",
  failed.length
    ? `Overall result: **FAIL** (${failed.map(([name]) => name).join(", ")})`
    : "Overall result: **PASS**",
  ...warnings.map(warning => `> WARNING: ${warning}`),
];
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${lines.join("\n")}\n`);
console.log(lines.join("\n"));
if (failed.length && process.env.FAIL_ON_OPS_CONFIG === "true") process.exit(1);
