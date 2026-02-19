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

    

});
