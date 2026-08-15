import { expect, test } from "@playwright/test";

test("Escape closes shortcut help and returns focus to its trigger", async ({ page }) => {
  await page.goto("/bulk-converter");
  await page.locator('textarea[aria-label="CSV text"]').fill("value\nnot-a-number");

  const trigger = page.getByRole("button", { name: /keyboard shortcuts|键盘快捷键/i });
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(page.getByRole("dialog", { name: /keyboard shortcuts/i })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: /keyboard shortcuts/i })).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("mobile Safari keeps navigation keyboard reachable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-safari", "Mobile Safari-only regression");
  await page.goto("/");

  const menu = page.getByRole("button", { name: /open navigation|打开导航菜单/i });
  await expect(menu).toBeVisible();
  await menu.click();
  await expect(page.getByRole("navigation", { name: /mobile navigation|移动导航/i })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
});

test("mobile Safari remains usable after landscape rotation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-safari", "Mobile Safari-only regression");
  await page.goto("/");
  await page.setViewportSize({ width: 844, height: 390 });

  await expect(page.getByRole("navigation", { name: /primary navigation|主导航/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /open navigation|打开导航菜单/i })).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  const menu = page.getByRole("button", { name: /open navigation|打开导航菜单/i });
  await expect(menu).toBeVisible();
  await menu.click();
  await expect(page.getByRole("navigation", { name: /mobile navigation|移动导航/i })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
});

test("mobile Safari preserves focused input through keyboard-like viewport changes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-safari", "Mobile Safari-only regression");
  await page.goto("/bulk-converter");
  const csvInput = page.locator('textarea[aria-label="CSV text"]');
  await csvInput.focus();
  await page.keyboard.insertText("\nkeyboard-input");
  await page.setViewportSize({ width: 390, height: 520 });
  await expect(csvInput).toBeFocused();
  await expect(csvInput).toContainText("keyboard-input");
});

test("mobile Safari preserves local CSV state when file selection is cancelled", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-safari", "Mobile Safari-only regression");
  await page.goto("/bulk-converter");
  const fileInput = page.locator('input[type="file"][aria-label="Input CSV"]');
  await fileInput.setInputFiles({
    name: "orientation-fixture.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("value\\n10\\n20\\n"),
  });
  await expect(page.getByRole("status").filter({ hasText: /Loaded orientation-fixture.csv/i })).toBeVisible();
  await fileInput.setInputFiles([]);
  await expect(page.getByRole("status").filter({ hasText: /Loaded orientation-fixture.csv/i })).toBeVisible();
});

test("mobile Safari keeps loading and scroll position under constrained bandwidth", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-safari", "Mobile Safari-only regression");
  await page.route("**/*", async route => {
    if (route.request().resourceType() === "document") await new Promise(resolve => setTimeout(resolve, 250));
    await route.continue();
  });
  await page.goto("/bulk-converter");
  await expect(page.getByRole("heading", { name: /Convert whole columns/i })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 520));
  const before = await page.evaluate(() => window.scrollY);
  await page.setViewportSize({ width: 844, height: 390 });
  await page.setViewportSize({ width: 390, height: 844 });
  const after = await page.evaluate(() => window.scrollY);
  expect(after).toBeGreaterThanOrEqual(Math.max(0, before - 8));
});

test("mobile Safari reports invalid UTF-8 files without corrupting local state", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-safari", "Mobile Safari-only regression");
  await page.goto("/bulk-converter");
  const fileInput = page.locator('input[type="file"][aria-label="Input CSV"]');
  await fileInput.setInputFiles({
    name: "invalid-encoding.csv",
    mimeType: "text/csv",
    buffer: Buffer.from([0xff, 0xfe, 0x00, 0x61]),
  });
  await expect(page.getByRole("alert")).toContainText(/not valid UTF-8 CSV/i);
  await expect(page.getByRole("button", { name: /Download CSV/i })).toBeDisabled();
});

test("mobile Safari recovers local editing after offline and online transitions", async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-safari", "Mobile Safari-only regression");
  await page.goto("/bulk-converter");
  const csvInput = page.locator('textarea[aria-label="CSV text"]');
  await context.setOffline(true);
  await csvInput.fill("value\\noffline\\n");
  await expect(csvInput).toHaveValue("value\\noffline\\n");
  await context.setOffline(false);
  await page.reload();
  await expect(page.getByRole("heading", { name: /Convert whole columns/i })).toBeVisible();
});
