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
