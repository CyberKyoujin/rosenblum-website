import { test, expect } from "@playwright/test";
import { setupAuth, setupApiMocks, mockUser, mockUserData } from "./auth.setup";

test.describe("Profile Page (Authenticated)", () => {

    test.describe("Profile Page Display", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                orders: [
                    {
                        id: 1,
                        status: "review",
                        date: "01.01.2024"
                    },
                    {
                        id: 2,
                        status: "completed",
                        date: "15.01.2024"
                    }
                ]
            });
        });

        test("should display profile page with user information", async ({ page }) => {
            await page.goto("/profile");

            await expect(page.locator(".profile__main-section")).toBeVisible({ timeout: 10000 });

            // User name should be visible
            await expect(page.getByText(`${mockUser.first_name} ${mockUser.last_name}`)).toBeVisible();
        });

        test("should display user contact information", async ({ page }) => {
            await page.goto("/profile");

            await expect(page.locator(".profile__main-section")).toBeVisible({ timeout: 10000 });

            // Contact data section
            await expect(page.getByText("Kontanktdaten")).toBeVisible();
            await expect(page.getByText(mockUserData.email)).toBeVisible();
        });

        test("should display orders section title", async ({ page }) => {
            await page.goto("/profile");

            await expect(page.locator(".profile__main-section")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("Aufträge")).toBeVisible();
        });

        test("should display user orders", async ({ page }) => {
            await page.goto("/profile");

            await expect(page.locator(".profile__main-section")).toBeVisible({ timeout: 10000 });

            // Order items should be visible
            const orderItems = page.locator(".profile-order-container");
            await expect(orderItems.first()).toBeVisible();
        });

        test("should display order ID in correct format", async ({ page }) => {
            await page.goto("/profile");

            await expect(page.locator(".profile__main-section")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("# ro-1")).toBeVisible();
        });

        test("should display edit profile button", async ({ page }) => {
            await page.goto("/profile");

            await expect(page.locator(".profile__main-section")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("PROFIL BEARBEITEN")).toBeVisible();
        });

        test("should display delete account button", async ({ page }) => {
            await page.goto("/profile");

            await expect(page.locator(".profile__main-section")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("KONTO LÖSCHEN")).toBeVisible();
        });

        test("should navigate to edit profile page", async ({ page }) => {
            await page.goto("/profile");

            await expect(page.locator(".profile__main-section")).toBeVisible({ timeout: 10000 });

            await page.getByText("PROFIL BEARBEITEN").click();

            await expect(page).toHaveURL(/\/edit-profile/);
        });

        test("should navigate to order details when clicking order", async ({ page }) => {
            await page.goto("/profile");

            await expect(page.locator(".profile__main-section")).toBeVisible({ timeout: 10000 });

            await page.locator(".profile-order-container").first().click();

            await expect(page).toHaveURL(/\/order\/1/);
        });

    });

    test.describe("Profile Empty Orders State", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                orders: []
            });
        });

        test("should display empty orders message", async ({ page }) => {
            await page.goto("/profile");

            await expect(page.locator(".profile__main-section")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("Sie haben noch keine Aufträge")).toBeVisible();
        });

        test("should display request quote button when no orders", async ({ page }) => {
            await page.goto("/profile");

            await expect(page.locator(".profile__main-section")).toBeVisible({ timeout: 10000 });

            await expect(page.getByText("ANGEBOT ANFORDERN")).toBeVisible();
        });

        test("should navigate to order page when clicking request quote", async ({ page }) => {
            await page.goto("/profile");

            await expect(page.locator(".profile__main-section")).toBeVisible({ timeout: 10000 });

            await page.getByText("ANGEBOT ANFORDERN").click();

            await expect(page).toHaveURL(/\/order/);
        });

    });

    test.describe("Responsive Design", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page, {
                orders: []
            });
        });

        test("should display correctly on mobile", async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto("/profile");

            await expect(page.locator(".profile__main-section")).toBeVisible({ timeout: 10000 });
            await expect(page.getByText(`${mockUser.first_name} ${mockUser.last_name}`)).toBeVisible();
        });

        test("should display correctly on tablet", async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto("/profile");

            await expect(page.locator(".profile__main-section")).toBeVisible({ timeout: 10000 });
            await expect(page.getByText(`${mockUser.first_name} ${mockUser.last_name}`)).toBeVisible();
        });

    });

});
