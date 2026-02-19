import { test, expect } from "@playwright/test";

test.describe("Admin Login Flow", () => {


    test.describe("Protected Routes Redirect", () => {

        test("should redirect to login when accessing dashboard without auth", async ({ page }) => {
            await page.goto("/dashboard");

            // Should redirect to login
            await expect(page).toHaveURL("/");
        });

        test("should redirect to login when accessing customers without auth", async ({ page }) => {
            await page.goto("/customers");

            await expect(page).toHaveURL("/");
        });

        test("should redirect to login when accessing messages without auth", async ({ page }) => {
            await page.goto("/messages");

            await expect(page).toHaveURL("/");
        });

        test("should redirect to login when accessing translator without auth", async ({ page }) => {
            await page.goto("/translator");

            await expect(page).toHaveURL("/");
        });

        test("should redirect to login when accessing statistics without auth", async ({ page }) => {
            await page.goto("/statistics");

            await expect(page).toHaveURL("/");
        });

    });


});
