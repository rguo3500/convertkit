import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const siteUrl = process.env.PRODUCTION_SITE_URL || "https://lovexiaoyue.cc.cd";
const outputPath =
  process.argv[2] || "artifacts/weekly-health/production-robots-audit.md";
const robotsUrl = new URL("/robots.txt", siteUrl).toString();
let response;
let body = "";
let networkError = "";
try {
  response = await fetch(robotsUrl);
  body = await response.text();
} catch (error) {
  networkError = error instanceof Error ? error.message : String(error);
}
const sitemapUrl = new URL("/sitemap.xml", siteUrl).toString();
const checks = [
  ["HTTP 200", response?.status === 200],
  ["Sitemap declaration", body.includes(`Sitemap: ${sitemapUrl}`)],
  ["Allow root", /(?:^|\n)Allow:\s*\/\s*(?:\n|$)/i.test(body)],
  ["Disallow admin", /(?:^|\n)Disallow:\s*\/admin\s*(?:\n|$)/i.test(body)],
];
const managedContent = body.includes("# BEGIN Cloudflare Managed content");
const failed = checks.filter(([, passed]) => !passed);
if (networkError) failed.push(["NETWORK_OR_TIMEOUT", false]);
const lines = [
  "# Production robots.txt audit",
  "",
  `Target: ${robotsUrl}`,
  `HTTP status: ${response?.status ?? "unavailable"}`,
  networkError ? `Network error: ${networkError}` : "Network error: none",
  `Cloudflare Managed content: **${managedContent ? "detected" : "not detected"}**`,
  "",
  "| Check | Result |",
  "| --- | --- |",
  ...checks.map(
    ([name, passed]) => `| ${name} | **${passed ? "PASS" : "FAIL"}** |`
  ),
  "",
  failed.length
    ? `Overall result: **FAIL** (${failed.map(([name]) => name).join(", ")})`
    : "Overall result: **PASS**",
  managedContent
    ? "> Cloudflare Managed content is present. Review it in Cloudflare Dashboard before enabling strict Lighthouse blocking."
    : "> No Cloudflare Managed content marker was detected.",
];
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${lines.join("\n")}\n`);
console.log(lines.join("\n"));
if (failed.length && process.env.FAIL_ON_PRODUCTION_ROBOTS_AUDIT === "true")
  process.exit(1);
