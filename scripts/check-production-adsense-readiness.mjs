import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const site = (
  process.env.PRODUCTION_SITE_URL || "https://lovexiaoyue.cc.cd"
).replace(/\/$/, "");
const output = process.argv[2] || "artifacts/summary/adsense-readiness.md";
const strict = process.env.FAIL_ON_ADSENSE_READINESS === "true";

const checks = [];
const record = (name, pass, detail) => checks.push({ name, pass, detail });

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const optionalRequests = [];
  page.on("request", request => {
    if (
      /googlesyndication|doubleclick|googletagmanager|google-analytics|umami/i.test(
        request.url()
      )
    ) {
      optionalRequests.push(request.url());
    }
  });
  await page.goto(`${site}/?adsense-readiness=1`, {
    waitUntil: "commit",
    timeout: 30_000,
  });
  await page.waitForTimeout(900);
  const homeText = await page.locator("body").innerText();
  const bannerVisible = await page
    .getByRole("heading", { name: /Keep ConvertKit useful/i })
    .isVisible()
    .catch(() => false);
  const consentButtons = await page
    .getByRole("button", { name: /Reject optional/i })
    .count();
  record(
    "Home renders Cookie Consent Banner for a fresh context",
    bannerVisible && consentButtons > 0,
    `banner=${bannerVisible}; rejectButtons=${consentButtons}`
  );

  record(
    "Fresh visit has no optional Google/analytics request before consent",
    optionalRequests.length === 0,
    optionalRequests.join(", ") || "none"
  );
  record(
    "Home does not expose an AdSense placeholder before consent",
    !homeText.includes("adsbygoogle") &&
      !homeText.includes("googlesyndication"),
    "DOM text does not contain ad script markers"
  );

  for (const [path, marker] of [
    ["/privacy", "Privacy Policy"],
    ["/cookie-policy", "Cookie Policy"],
    ["/terms", "Terms of Use"],
  ]) {
    const legalPage = await context.newPage();
    await legalPage.goto(`${site}${path}?adsense-readiness=1`, {
      waitUntil: "commit",
      timeout: 30_000,
    });
    await legalPage.waitForTimeout(500);
    const text = await legalPage.locator("body").innerText();
    const placeholder = text.includes(
      "This section is structured and ready for the next expansion"
    );
    const operatorReady =
      text.includes("shenlan") &&
      text.includes("rguo3500@gmail.com") &&
      text.includes("河南省平顶山市光明路北段");
    record(
      `${path} contains the current legal page and operator record`,
      text.includes(marker) && !placeholder && operatorReady,
      `marker=${text.includes(marker)}; placeholder=${placeholder}; operator=${operatorReady}`
    );
    await legalPage.close();
  }

  const contactPage = await context.newPage();
  await contactPage.goto(`${site}/contact?adsense-readiness=1`, {
    waitUntil: "commit",
    timeout: 30_000,
  });
  await contactPage.waitForTimeout(500);
  const contactText = await contactPage.locator("body").innerText();
  const contactPlaceholder =
    contactText.includes("This section is structured and ready") ||
    contactText.includes("Talk to the team");
  const contactOperatorReady =
    contactText.includes("shenlan") &&
    contactText.includes("rguo3500@gmail.com") &&
    contactText.includes("河南省平顶山市光明路北段");
  record(
    "Contact page contains real support and operator information",
    !contactPlaceholder && contactOperatorReady,
    `placeholder=${contactPlaceholder}; operator=${contactOperatorReady}`
  );
  await contactPage.close();

  const robots = await context.request.get(`${site}/robots.txt`);
  const robotsText = await robots.text();
  record(
    "robots.txt is reachable and declares the production sitemap",
    robots.ok() && robotsText.includes(`Sitemap: ${site}/sitemap.xml`),
    `status=${robots.status()}`
  );
  const sitemap = await context.request.get(`${site}/sitemap.xml`);
  const sitemapText = await sitemap.text();
  record(
    "sitemap.xml is reachable and uses the production host",
    sitemap.ok() && sitemapText.includes(site),
    `status=${sitemap.status()}`
  );
} catch (error) {
  record(
    "Production readiness browser audit completed",
    false,
    error instanceof Error ? error.message : String(error)
  );
} finally {
  await browser.close();
}

const failed = checks.filter(check => !check.pass);
const lines = [
  "# Production AdSense readiness audit",
  "",
  `Target: ${site}`,
  `Generated: ${new Date().toISOString()}`,
  `Mode: ${strict ? "strict" : "report-only"}`,
  "",
  "| Check | Status | Detail |",
  "| --- | --- | --- |",
  ...checks.map(
    check =>
      `| ${check.name.replaceAll("|", "\\|")} | ${check.pass ? "PASS" : "REVIEW"} | ${check.detail.replaceAll("|", "\\|")} |`
  ),
  "",
  `Result: ${failed.length ? `${failed.length} check(s) need review` : "all checks passed"}`,
  "",
];
await mkdir(output.substring(0, output.lastIndexOf("/")) || ".", {
  recursive: true,
});
await writeFile(output, lines.join("\n"));
console.log(lines.join("\n"));
if (strict && failed.length) process.exitCode = 1;
