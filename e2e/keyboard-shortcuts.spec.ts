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
