import { test, expect } from "@playwright/test";
import { setupAuth, setupApiMocks } from "./auth.setup";

test.describe("Admin Statistics Page", () => {

    test.describe("Authentication Required", () => {

        test("should redirect to login when accessing statistics without auth", async ({ page }) => {
            await page.goto("/statistics");

            await expect(page).toHaveURL("/");
        });

    });

    test.describe("Statistics Page Layout (Authenticated)", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                statistics: [
                    { status: "pending", count: 10 },
                    { status: "completed", count: 25 },
                    { status: "cancelled", count: 5 }
                ]
            });
        });

        test("should display statistics page with title", async ({ page }) => {
            await page.goto("/statistics");

            await expect(page.locator(".app-statistics-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByRole("heading", { name: "Statistik" })).toBeVisible();
        });

        test("should display statistics title section", async ({ page }) => {
            await page.goto("/statistics");

            await expect(page.locator(".app-statistics-container")).toBeVisible({ timeout: 10000 });

            await expect(page.locator(".statistics-title")).toBeVisible();
        });

        test("should display Aufträge chart widget", async ({ page }) => {
            await page.goto("/statistics");

            await expect(page.locator(".app-statistics-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("Aufträge").first()).toBeVisible();
        });

        test("should display Aufträge (Menge) chart widget", async ({ page }) => {
            await page.goto("/statistics");

            await expect(page.locator(".app-statistics-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("Aufträge (Menge)")).toBeVisible();
        });

        test("should display KV vs. Auftrag chart widget", async ({ page }) => {
            await page.goto("/statistics");

            await expect(page.locator(".app-statistics-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("KV vs. Auftrag")).toBeVisible();
        });

        test("should display Ort chart widget", async ({ page }) => {
            await page.goto("/statistics");

            await expect(page.locator(".app-statistics-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("Ort")).toBeVisible();
        });

        test("should display Neue Kunden chart widget", async ({ page }) => {
            await page.goto("/statistics");

            await expect(page.locator(".app-statistics-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByRole("heading", { name: "Neue Kunden" })).toBeVisible();
        });

        test("should display Anfragen vs. Aufträge chart widget", async ({ page }) => {
            await page.goto("/statistics");

            await expect(page.locator(".app-statistics-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("Anfragen vs. Aufträge")).toBeVisible();
        });

    });

    test.describe("Responsive Design", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                statistics: []
            });
        });

        test("should display correctly on mobile", async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto("/statistics");

            await expect(page.locator(".app-statistics-container")).toBeVisible({ timeout: 10000 });
            await expect(page.getByRole("heading", { name: "Statistik" })).toBeVisible();
        });

        test("should display correctly on tablet", async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto("/statistics");

            await expect(page.locator(".app-statistics-container")).toBeVisible({ timeout: 10000 });
            await expect(page.getByRole("heading", { name: "Statistik" })).toBeVisible();
        });

        test("should display correctly on desktop", async ({ page }) => {
            await page.setViewportSize({ width: 1920, height: 1080 });
            await page.goto("/statistics");

            await expect(page.locator(".app-statistics-container")).toBeVisible({ timeout: 10000 });
            await expect(page.getByRole("heading", { name: "Statistik" })).toBeVisible();
        });

    });

});
