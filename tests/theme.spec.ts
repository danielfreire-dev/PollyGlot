import { test, expect } from "@playwright/test";

const THEME_TOGGLE_SELECTOR = ".theme-toggle";
const THEME_TOGGLE_LABEL = ".theme-toggle-label";

test.describe("Theme Toggle — Cell-Inspired Light/Dark Themes", () => {
	test.beforeEach(async ({ page }) => {
		// Clear localStorage to start fresh each test
		await page.goto("/");
		await page.evaluate(() => localStorage.clear());
		await page.reload();
		await page.waitForLoadState("networkidle");
	});

	test("default mode is 'auto' with data-theme attribute set", async ({ page }) => {
		const theme = await page.locator("html").getAttribute("data-theme");
		expect(theme).toBe("auto");
	});

	test("theme toggle button is visible and shows correct initial label", async ({ page }) => {
		const toggle = page.locator(THEME_TOGGLE_SELECTOR);
		await expect(toggle).toBeVisible();
		await expect(toggle.locator(THEME_TOGGLE_LABEL)).toHaveText("Auto");
	});

	test("clicking the toggle cycles: auto → light → dark → auto", async ({ page }) => {
		const toggle = page.locator(THEME_TOGGLE_SELECTOR);
		const label = toggle.locator(THEME_TOGGLE_LABEL);

		// auto → light
		await toggle.click();
		await expect(label).toHaveText("Light");
		await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

		// light → dark
		await toggle.click();
		await expect(label).toHaveText("Dark");
		await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

		// dark → auto
		await toggle.click();
		await expect(label).toHaveText("Auto");
		await expect(page.locator("html")).toHaveAttribute("data-theme", "auto");
	});

	test("theme preference is persisted in localStorage", async ({ page }) => {
		const toggle = page.locator(THEME_TOGGLE_SELECTOR);

		// Switch to light
		await toggle.click();
		const stored = await page.evaluate(() => localStorage.getItem("pollyglot-theme"));
		expect(stored).toBe("light");

		// Switch to dark
		await toggle.click();
		const stored2 = await page.evaluate(() => localStorage.getItem("pollyglot-theme"));
		expect(stored2).toBe("dark");
	});

	test("theme survives page reload", async ({ page }) => {
		const toggle = page.locator(THEME_TOGGLE_SELECTOR);

		// Set to dark mode
		await toggle.click(); // auto → light
		await toggle.click(); // light → dark

		// Reload the page
		await page.reload();
		await page.waitForLoadState("networkidle");

		// Should still be dark
		await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
		await expect(toggle.locator(THEME_TOGGLE_LABEL)).toHaveText("Dark");
	});

	test("light theme applies correct CSS background-color", async ({ page }) => {
		// Switch to light
		await page.locator(THEME_TOGGLE_SELECTOR).click();
		await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

		const bgColor = await page.evaluate(() => getComputedStyle(document.body).getPropertyValue("background-color"));
		// Cell light background: #f4f8ef → rgb(244, 248, 239)
		expect(bgColor).toBe("rgb(244, 248, 239)");
	});

	test("dark theme applies correct CSS background-color", async ({ page }) => {
		// Switch to dark (auto → light → dark)
		const toggle = page.locator(THEME_TOGGLE_SELECTOR);
		await toggle.click();
		await toggle.click();
		await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

		const bgColor = await page.evaluate(() => getComputedStyle(document.body).getPropertyValue("background-color"));
		// Cell dark background: #111a0c → rgb(17, 26, 12)
		expect(bgColor).toBe("rgb(17, 26, 12)");
	});

	test("theme toggle has accessible ARIA label", async ({ page }) => {
		const toggle = page.locator(THEME_TOGGLE_SELECTOR);
		await expect(toggle).toHaveAttribute("aria-label", /Theme:/);
	});

	test("theme toggle is keyboard accessible", async ({ page }) => {
		const toggle = page.locator(THEME_TOGGLE_SELECTOR);

		// Focus the toggle directly
		await toggle.focus();
		await expect(toggle).toBeFocused();

		// Press Enter to cycle
		await page.keyboard.press("Enter");
		await expect(toggle.locator(THEME_TOGGLE_LABEL)).toHaveText("Light");
	});
});
