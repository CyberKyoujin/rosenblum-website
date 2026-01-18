import { test, expect } from "@playwright/test";
import { setupAuth, setupApiMocks } from "./auth.setup";

test.describe("Admin Customers Page", () => {

    test.describe("Authentication Required", () => {

        test("should redirect to login when accessing customers without auth", async ({ page }) => {
            await page.goto("/customers");

            await expect(page).toHaveURL("/");
        });

    });

    test.describe("Customers Page Layout (Authenticated)", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                users: {
                    count: 2,
                    results: [
                        {
                            id: 1,
                            profile_img_url: "",
                            profile_img: "",
                            first_name: "John",
                            last_name: "Doe",
                            email: "john@example.com",
                            orders: "5"
                        },
                        {
                            id: 2,
                            profile_img_url: "",
                            profile_img: "",
                            first_name: "Jane",
                            last_name: "Smith",
                            email: "jane@example.com",
                            orders: "3"
                        }
                    ]
                }
            });
        });

        test("should display customers page with title", async ({ page }) => {
            await page.goto("/customers");

            await expect(page.locator(".dashboard-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByRole("heading", { name: "Kunden" })).toBeVisible();
        });

        test("should display search field", async ({ page }) => {
            await page.goto("/customers");

            await expect(page.locator(".dashboard-container")).toBeVisible({ timeout: 10000 });

            await expect(page.locator("#outlined-basic")).toBeVisible();
        });

        test("should display customer items", async ({ page }) => {
            await page.goto("/customers");

            await expect(page.locator(".dashboard-container")).toBeVisible({ timeout: 10000 });

            const customerItems = page.locator(".customer-container");
            await expect(customerItems.first()).toBeVisible();
        });

        test("should display customer name", async ({ page }) => {
            await page.goto("/customers");

            await expect(page.locator(".dashboard-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("John Doe")).toBeVisible();
        });

        test("should display customer email", async ({ page }) => {
            await page.goto("/customers");

            await expect(page.locator(".dashboard-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("john@example.com")).toBeVisible();
        });

        test("should display customer avatar area", async ({ page }) => {
            await page.goto("/customers");

            await expect(page.locator(".dashboard-container")).toBeVisible({ timeout: 10000 });

            await expect(page.locator(".customer-avatar").first()).toBeVisible();
        });

    });

    test.describe("Customers Empty State", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                users: { count: 0, results: [] }
            });
        });

        test("should display empty state message", async ({ page }) => {
            await page.goto("/customers");

            await expect(page.locator(".dashboard-container")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("Keine Kunden gefunden.")).toBeVisible();
        });

    });

    test.describe("Customer Navigation", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                users: {
                    count: 1,
                    results: [
                        {
                            id: 42,
                            profile_img_url: "",
                            profile_img: "",
                            first_name: "Test",
                            last_name: "Customer",
                            email: "test@example.com",
                            orders: "2"
                        }
                    ]
                }
            });
        });

        test("should navigate to customer detail page when clicking customer", async ({ page }) => {
            await page.goto("/customers");

            await expect(page.locator(".dashboard-container")).toBeVisible({ timeout: 10000 });

            await page.locator(".customer-container").first().click();

            await expect(page).toHaveURL(/\/user\/42/);
        });

    });

    test.describe("Search Functionality", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                users: {
                    count: 1,
                    results: [
                        {
                            id: 1,
                            profile_img_url: "",
                            profile_img: "",
                            first_name: "Search",
                            last_name: "Result",
                            email: "search@example.com",
                            orders: "1"
                        }
                    ]
                }
            });
        });

        test("should allow typing in search field", async ({ page }) => {
            await page.goto("/customers");

            await expect(page.locator(".dashboard-container")).toBeVisible({ timeout: 10000 });

            const searchField = page.locator("#outlined-basic");
            await searchField.fill("test search");

            await expect(searchField).toHaveValue("test search");
        });

    });

    test.describe("Responsive Design", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                users: { count: 0, results: [] }
            });
        });

        test("should display correctly on mobile", async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto("/customers");

            await expect(page.locator(".dashboard-container")).toBeVisible({ timeout: 10000 });
            await expect(page.getByRole("heading", { name: "Kunden" })).toBeVisible();
        });

        test("should display correctly on tablet", async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto("/customers");

            await expect(page.locator(".dashboard-container")).toBeVisible({ timeout: 10000 });
            await expect(page.getByRole("heading", { name: "Kunden" })).toBeVisible();
        });

    });

});
