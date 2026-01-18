import { test, expect } from "@playwright/test";
import { setupAuth, setupApiMocks } from "./auth.setup";

test.describe("Admin Messages Page", () => {

    test.describe("Authentication Required", () => {

        test("should redirect to login when accessing messages without auth", async ({ page }) => {
            await page.goto("/messages");

            await expect(page).toHaveURL("/");
        });

    });

    test.describe("Global Messages Page (Authenticated)", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                messages: {
                    count: 2,
                    results: [
                        {
                            id: 1,
                            user: {
                                id: 1,
                                first_name: "John",
                                last_name: "Doe",
                                email: "john@example.com"
                            },
                            last_message: "Hello, this is a test",
                            unread_count: 2,
                            formatted_timestamp: "01.01.2024"
                        },
                        {
                            id: 2,
                            user: {
                                id: 2,
                                first_name: "Jane",
                                last_name: "Smith",
                                email: "jane@example.com"
                            },
                            last_message: "Another message",
                            unread_count: 0,
                            formatted_timestamp: "02.01.2024"
                        }
                    ]
                }
            });
        });

        test("should display messages page with title", async ({ page }) => {
            await page.goto("/messages");

            await expect(page.locator(".dashboard-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByRole("heading", { name: "Nachrichten" })).toBeVisible();
        });

        test("should display search field", async ({ page }) => {
            await page.goto("/messages");

            await expect(page.locator(".dashboard-container")).toBeVisible({ timeout: 10000 });

            await expect(page.locator("#outlined-basic")).toBeVisible();
        });

    });

    test.describe("Messages Empty State", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                messages: { count: 0, results: [] }
            });
        });

        test("should display empty state message", async ({ page }) => {
            await page.goto("/messages");

            await expect(page.locator(".dashboard-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("Keine Nachrichten gefunden.")).toBeVisible();
        });

    });

    test.describe("Responsive Design", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                messages: { count: 0, results: [] }
            });
        });

        test("should display correctly on mobile", async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto("/messages");

            await expect(page.locator(".dashboard-container")).toBeVisible({ timeout: 10000 });
            await expect(page.getByRole("heading", { name: "Nachrichten", exact: true })).toBeVisible();
        });

        test("should display correctly on tablet", async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto("/messages");

            await expect(page.locator(".dashboard-container")).toBeVisible({ timeout: 10000 });
            await expect(page.getByRole("heading", { name: "Nachrichten", exact: true })).toBeVisible();
        });

    });

});
