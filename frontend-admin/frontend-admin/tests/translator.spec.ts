import { test, expect } from "@playwright/test";
import { setupAuth, setupApiMocks } from "./auth.setup";

test.describe("Admin Translator Page", () => {

    test.describe("Authentication Required", () => {

        test("should redirect to login when accessing translator without auth", async ({ page }) => {
            await page.goto("/translator");

            await expect(page).toHaveURL("/");
        });

    });

    test.describe("Translator Page Layout (Authenticated)", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                translations: {
                    count: 2,
                    results: [
                        {
                            id: 1,
                            name: "Translation 1",
                            input_text: "Hello",
                            output_text: "Hallo",
                            language_to: "German",
                            formatted_timestamp: "01.01.2024"
                        },
                        {
                            id: 2,
                            name: "Translation 2",
                            input_text: "Goodbye",
                            output_text: "Auf Wiedersehen",
                            language_to: "German",
                            formatted_timestamp: "02.01.2024"
                        }
                    ]
                }
            });
        });

        test("should display translator page with title", async ({ page }) => {
            await page.goto("/translator");

            await expect(page.locator(".translation-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByRole("heading", { name: "Übersetzer" })).toBeVisible();
        });

        test("should display input text section", async ({ page }) => {
            await page.goto("/translator");

            await expect(page.locator(".translation-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByRole("heading", { name: "Eingangstext" })).toBeVisible();
        });

        test("should display output section", async ({ page }) => {
            await page.goto("/translator");

            await expect(page.locator(".translation-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByRole("heading", { name: "Übersetzungsergebnis" })).toBeVisible();
        });

        test("should have language selector", async ({ page }) => {
            await page.goto("/translator");

            await expect(page.locator(".translation-container")).toBeVisible({ timeout: 10000 });

            await expect(page.locator(".translator__select")).toBeVisible();
        });

        test("should have text input area", async ({ page }) => {
            await page.goto("/translator");

            await expect(page.locator(".translation-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByPlaceholder("Text zur Übersetzung…")).toBeVisible();
        });

        test("should have translate button (WEITER)", async ({ page }) => {
            await page.goto("/translator");

            await expect(page.locator(".translation-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("WEITER")).toBeVisible();
        });

        test("should have save button (SPEICHERN)", async ({ page }) => {
            await page.goto("/translator");

            await expect(page.locator(".translation-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("SPEICHERN")).toBeVisible();
        });

        test("should display saved translations section", async ({ page }) => {
            await page.goto("/translator");

            await expect(page.locator(".translation-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByRole("heading", { name: "Übersetzungen" })).toBeVisible();
        });

    });

    test.describe("Translation Input", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                translations: { count: 0, results: [] }
            });
        });

        test("should allow typing in translation input", async ({ page }) => {
            await page.goto("/translator");

            await expect(page.locator(".translation-container")).toBeVisible({ timeout: 10000 });

            const textarea = page.getByPlaceholder("Text zur Übersetzung…");
            await textarea.fill("This is a test text to translate");

            await expect(textarea).toHaveValue("This is a test text to translate");
        });

        test("should clear text input", async ({ page }) => {
            await page.goto("/translator");

            await expect(page.locator(".translation-container")).toBeVisible({ timeout: 10000 });

            const textarea = page.getByPlaceholder("Text zur Übersetzung…");
            await textarea.fill("Some text");
            await textarea.clear();

            await expect(textarea).toHaveValue("");
        });

    });

    test.describe("Language Selection", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                translations: { count: 0, results: [] }
            });
        });

        test("should display language selector", async ({ page }) => {
            await page.goto("/translator");

            await expect(page.locator(".translation-container")).toBeVisible({ timeout: 10000 });

            await expect(page.locator(".translator__select")).toBeVisible();
        });

        test("should open language dropdown when clicked", async ({ page }) => {
            await page.goto("/translator");

            await expect(page.locator(".translation-container")).toBeVisible({ timeout: 10000 });

            await page.locator(".translator__select").click();

            await expect(page.getByText("UKR")).toBeVisible();
        });

    });

    test.describe("Empty Translations", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                translations: { count: 0, results: [] }
            });
        });

        test("should display empty state for translations", async ({ page }) => {
            await page.goto("/translator");

            await expect(page.locator(".translation-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("Keine Übersetzungen gefunden.")).toBeVisible();
        });

    });

    test.describe("Responsive Design", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                translations: { count: 0, results: [] }
            });
        });

        test("should display correctly on mobile", async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto("/translator");

            await expect(page.locator(".translation-container")).toBeVisible({ timeout: 10000 });
            await expect(page.getByRole("heading", { name: "Übersetzer" })).toBeVisible();
        });

        test("should display correctly on tablet", async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto("/translator");

            await expect(page.locator(".translation-container")).toBeVisible({ timeout: 10000 });
            await expect(page.getByRole("heading", { name: "Übersetzer" })).toBeVisible();
        });

    });

});
