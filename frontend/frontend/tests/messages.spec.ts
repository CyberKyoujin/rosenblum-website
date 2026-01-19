import { test, expect } from "@playwright/test";
import { setupAuth, setupApiMocks } from "./auth.setup";

test.describe("Messages Page (Authenticated)", () => {

    test.describe("Messages Page Display", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                messages: []
            });
        });

        test("should display messages page with title", async ({ page }) => {
            await page.goto("/messages");

            await expect(page.locator(".messages-container")).toBeVisible({ timeout: 10000 });

            // Title should contain "Nachrichten" (Messages in German)
            await expect(page.locator(".messages-title-container")).toBeVisible();
        });

        test("should display message input area", async ({ page }) => {
            await page.goto("/messages");

            await expect(page.locator(".messages-container")).toBeVisible({ timeout: 10000 });

            // Message input should be visible
            await expect(page.locator("textarea, input[type='text']").first()).toBeVisible();
        });

        test("should display messages main container", async ({ page }) => {
            await page.goto("/messages");

            await expect(page.locator(".messages-container")).toBeVisible({ timeout: 10000 });

            await expect(page.locator(".messages-main-container")).toBeVisible();
        });

    });

    test.describe("Messages Empty State", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                messages: []
            });
        });

        test("should display empty messages state", async ({ page }) => {
            await page.goto("/messages");

            await expect(page.locator(".messages-container")).toBeVisible({ timeout: 10000 });

            // No messages container should be visible
            await expect(page.locator(".no-messages-container")).toBeVisible();
        });

    });

    test.describe("Message Input Functionality", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                messages: []
            });
        });

        test("should have message input field", async ({ page }) => {
            await page.goto("/messages");

            await expect(page.locator(".messages-container")).toBeVisible({ timeout: 10000 });

            // Message input should exist
            const messageInput = page.locator("textarea").first();
            await expect(messageInput).toBeVisible();
        });

        test("should have send button", async ({ page }) => {
            await page.goto("/messages");

            await expect(page.locator(".messages-container")).toBeVisible({ timeout: 10000 });

            // Send button should be visible
            await expect(page.locator("button[type='submit'], .send-btn").first()).toBeVisible();
        });

    });

    test.describe("File Upload in Messages", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                messages: []
            });
        });

        test("should have file input", async ({ page }) => {
            await page.goto("/messages");

            await expect(page.locator(".messages-container")).toBeVisible({ timeout: 10000 });

            // File input should be attached (may be hidden)
            const fileInput = page.locator("input[type='file']");
            await expect(fileInput).toBeAttached();
        });

    });

    test.describe("Responsive Design", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                messages: []
            });
        });

        test("should display correctly on mobile", async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto("/messages");

            await expect(page.locator(".messages-container")).toBeVisible({ timeout: 10000 });
            await expect(page.locator(".messages-title-container")).toBeVisible();
        });

        test("should display correctly on tablet", async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto("/messages");

            await expect(page.locator(".messages-container")).toBeVisible({ timeout: 10000 });
            await expect(page.locator(".messages-title-container")).toBeVisible();
        });

    });

});
