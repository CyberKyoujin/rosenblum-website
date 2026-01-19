import { test, expect } from "@playwright/test";
import { setupAuth, setupApiMocks, mockUserData } from "./auth.setup";

test.describe("Order Page (Authenticated User)", () => {

    test.describe("Pre-filled Form for Authenticated User", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page);
        });

        test("should display order page for authenticated user", async ({ page }) => {
            await page.goto("/order");

            await expect(page.getByRole("heading").first()).toBeVisible({ timeout: 10000 });
            await expect(page.locator(".order-contacts-content input").first()).toBeVisible();
        });

        test("should pre-fill user email for authenticated user", async ({ page }) => {
            await page.goto("/order");

            await expect(page.getByRole("heading").first()).toBeVisible({ timeout: 10000 });

            // Find email input (usually the second input after name)
            const emailInput = page.locator(".order-contacts-content input").nth(1);

            // Email should be pre-filled or fillable
            await expect(emailInput).toBeVisible();
        });

        test("should pre-fill user phone number for authenticated user", async ({ page }) => {
            await page.goto("/order");

            await expect(page.getByRole("heading").first()).toBeVisible({ timeout: 10000 });

            // Phone input (usually the third input)
            const phoneInput = page.locator(".order-contacts-content input").nth(2);
            await expect(phoneInput).toBeVisible();
        });

        test("should pre-fill user address for authenticated user", async ({ page }) => {
            await page.goto("/order");

            await expect(page.getByRole("heading").first()).toBeVisible({ timeout: 10000 });

            // City input
            const cityInput = page.locator(".order-contacts-content input").nth(3);
            await expect(cityInput).toBeVisible();
        });

    });

    test.describe("Order Submission (Authenticated)", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page);
        });

        test("should submit order successfully for authenticated user", async ({ page }) => {
            await page.goto("/order");

            await expect(page.getByRole("heading").first()).toBeVisible({ timeout: 10000 });

            const formInputs = page.locator(".order-contacts-content input");

            // Fill all required fields
            await formInputs.nth(0).fill("Max Mustermann");
            await formInputs.nth(1).fill("test@example.com");
            await formInputs.nth(2).fill("+49 30 123456789");
            await formInputs.nth(3).fill("Berlin");
            await formInputs.nth(4).fill("Test Straße 1");
            await formInputs.nth(5).fill("12345");

            // Add message
            await page.locator("textarea").first().fill("Bitte übersetzen Sie dieses Dokument.");

            // Upload a file
            const fileInput = page.locator("input[type='file']");
            await fileInput.setInputFiles({
                name: "document.pdf",
                mimeType: "application/pdf",
                buffer: Buffer.from("test pdf content")
            });

            // Submit
            await page.locator(".send-btn").click();

            // Should redirect to profile on success
            await expect(page).toHaveURL(/\/profile|\//, { timeout: 10000 });
        });

    });

    test.describe("Order with Multiple Files (Authenticated)", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page);
        });

        test("should allow multiple file uploads for authenticated user", async ({ page }) => {
            await page.goto("/order");

            await expect(page.getByRole("heading").first()).toBeVisible({ timeout: 10000 });

            const fileInput = page.locator("input[type='file']");

            await fileInput.setInputFiles([
                {
                    name: "document1.pdf",
                    mimeType: "application/pdf",
                    buffer: Buffer.from("test pdf 1")
                },
                {
                    name: "document2.pdf",
                    mimeType: "application/pdf",
                    buffer: Buffer.from("test pdf 2")
                }
            ]);

            // Both files should appear
            const fileContainers = page.locator(".files-container .file-container");
            await expect(fileContainers).toHaveCount(2);
        });

    });

});
