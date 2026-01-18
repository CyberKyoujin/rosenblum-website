import { test, expect } from "@playwright/test";
import { setupAuth, setupApiMocks } from "./auth.setup";

test.describe("Admin Navigation", () => {

    test.describe("Unauthenticated Navigation", () => {

        test("should not show navigation links when not authenticated", async ({ page }) => {
            await page.goto("/");

            // Should not show nav links container
            await expect(page.locator(".nav-links-container")).not.toBeVisible();
        });

        test("should not show user greeting when not authenticated", async ({ page }) => {
            await page.goto("/");

            // Should not show navbar user container
            await expect(page.locator(".navbar-user-container")).not.toBeVisible();
        });

        test("should show logo on login page", async ({ page }) => {
            await page.goto("/");

            // Logo should be visible
            await expect(page.locator(".logo")).toBeVisible();
        });

    });

    test.describe("Protected Routes Redirect", () => {

        test("should redirect dashboard to login when not authenticated", async ({ page }) => {
            await page.goto("/dashboard");

            await expect(page).toHaveURL("/");
        });

        test("should redirect translator to login when not authenticated", async ({ page }) => {
            await page.goto("/translator");

            await expect(page).toHaveURL("/");
        });

        test("should redirect customers to login when not authenticated", async ({ page }) => {
            await page.goto("/customers");

            await expect(page).toHaveURL("/");
        });

        test("should redirect messages to login when not authenticated", async ({ page }) => {
            await page.goto("/messages");

            await expect(page).toHaveURL("/");
        });

        test("should redirect statistics to login when not authenticated", async ({ page }) => {
            await page.goto("/statistics");

            await expect(page).toHaveURL("/");
        });

    });

    test.describe("Authenticated Navigation", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page);
        });

        test("should show navigation links when authenticated", async ({ page }) => {
            await page.goto("/dashboard");

            await expect(page.locator(".main-nav-container")).toBeVisible({ timeout: 10000 });

            // Nav links container should be visible
            await expect(page.locator(".nav-links-container")).toBeVisible();
        });

        test("should display Übersetzer link", async ({ page }) => {
            await page.goto("/dashboard");

            await expect(page.locator(".main-nav-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("Übersetzer")).toBeVisible();
        });

        test("should display Kunden link", async ({ page }) => {
            await page.goto("/dashboard");

            await expect(page.locator(".main-nav-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("Kunden")).toBeVisible();
        });

        test("should display Nachrichten link", async ({ page }) => {
            await page.goto("/dashboard");

            await expect(page.locator(".main-nav-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("Nachrichten")).toBeVisible();
        });

        test("should display Statistik link", async ({ page }) => {
            await page.goto("/dashboard");

            await expect(page.locator(".main-nav-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("Statistik")).toBeVisible();
        });

        test("should display user greeting", async ({ page }) => {
            await page.goto("/dashboard");

            await expect(page.locator(".main-nav-container")).toBeVisible({ timeout: 10000 });

            // Should show "Hallo," greeting
            await expect(page.locator(".navbar-user-container")).toBeVisible();
        });

        test("should display logout button", async ({ page }) => {
            await page.goto("/dashboard");

            await expect(page.locator(".main-nav-container")).toBeVisible({ timeout: 10000 });

            // Logout button should be visible
            await expect(page.locator(".navbar-user-container .btn")).toBeVisible();
        });

        test("should navigate to translator page", async ({ page }) => {
            await page.goto("/dashboard");

            await expect(page.locator(".main-nav-container")).toBeVisible({ timeout: 10000 });

            await page.getByText("Übersetzer").click();

            await expect(page).toHaveURL(/\/translator/);
        });

        test("should navigate to customers page", async ({ page }) => {
            await page.goto("/dashboard");

            await expect(page.locator(".main-nav-container")).toBeVisible({ timeout: 10000 });

            await page.getByText("Kunden").click();

            await expect(page).toHaveURL(/\/customers/);
        });

        test("should navigate to messages page", async ({ page }) => {
            await page.goto("/dashboard");

            await expect(page.locator(".main-nav-container")).toBeVisible({ timeout: 10000 });

            await page.getByText("Nachrichten").click();

            await expect(page).toHaveURL(/\/messages/);
        });

        test("should navigate to statistics page", async ({ page }) => {
            await page.goto("/dashboard");

            await expect(page.locator(".main-nav-container")).toBeVisible({ timeout: 10000 });

            await page.getByText("Statistik").click();

            await expect(page).toHaveURL(/\/statistics/);
        });

        test("should navigate to dashboard when clicking logo", async ({ page }) => {
            await page.goto("/customers");

            await expect(page.locator(".main-nav-container")).toBeVisible({ timeout: 10000 });

            await page.locator(".logo").click();

            await expect(page).toHaveURL(/\/dashboard/);
        });

    });

    test.describe("Mobile Navigation", () => {

        test.beforeEach(async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await setupAuth(page);
            await setupApiMocks(page);
        });

        test("should display navigation correctly on mobile", async ({ page }) => {
            await page.goto("/dashboard");

            await expect(page.locator(".main-nav-container")).toBeVisible({ timeout: 10000 });
        });

    });

});
