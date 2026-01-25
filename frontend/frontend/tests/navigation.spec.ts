import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {

    test.describe("Public Pages Load", () => {

        test("should load homepage", async ({ page }) => {
            await page.goto("/");

            await expect(page.getByTestId("we-translate")).toBeVisible();
            await expect(page.getByRole("button", { name: /angebot anfordern/i })).toBeVisible();
        });

        test("should load about us page", async ({ page }) => {
            await page.goto("/about-us");

            await expect(page.getByRole("heading").first()).toBeVisible();
        });

        test("should load contact page", async ({ page }) => {
            await page.goto("/contact-us");

            await expect(page.getByRole("heading").first()).toBeVisible();
        });

        test("should load translations page", async ({ page }) => {
            await page.goto("/sworn-translations");

            await expect(page.getByRole("heading").first()).toBeVisible();
        });

        test("should load verbal translations page", async ({ page }) => {
            await page.goto("/verbal-translations");

            await expect(page.getByRole("heading").first()).toBeVisible();
        });

        test("should load apostille page", async ({ page }) => {
            await page.goto("/apostille");

            await expect(page.getByRole("heading").first()).toBeVisible();
        });

        test("should load languages page", async ({ page }) => {
            await page.goto("/languages");

            await expect(page.getByRole("heading").first()).toBeVisible();
        });

        test("should load pricing page", async ({ page }) => {
            await page.goto("/pricing");

            await expect(page.getByRole("heading").first()).toBeVisible();
        });

        test("should load areas page", async ({ page }) => {
            await page.goto("/areas");

            await expect(page.getByRole("heading").first()).toBeVisible();
        });

        test("should load FAQ page", async ({ page }) => {
            await page.goto("/faq");

            await expect(page.getByRole("heading").first()).toBeVisible();
        });

        test("should load order page", async ({ page }) => {
            await page.goto("/order");

            await expect(page.getByRole("heading").first()).toBeVisible();
        });

    });

    test.describe("Profile Dropdown", () => {

        test("should display profile dropdown menu", async ({ page }) => {
            await page.goto("/");

            await page.getByTestId("profile-dropdown").click();

            await expect(page.getByTestId("profile-dropdown-menu")).toBeVisible();
        });

        test("should navigate to login from dropdown", async ({ page }) => {
            await page.goto("/");

            await page.getByTestId("profile-dropdown").click({ force: true });

            // Wait for dropdown to be visible before clicking
            await expect(page.getByTestId("profile-dropdown-menu")).toBeVisible({ timeout: 5000 });
            await page.getByTestId("login-btn").click({ force: true });

            await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
        });

        test("should navigate to register from dropdown", async ({ page }) => {
            await page.goto("/");

            await page.getByTestId("profile-dropdown").click();
            await page.getByTestId("register-btn").click();

            await expect(page).toHaveURL(/\/register/);
        });

    });

    test.describe("Footer Navigation", () => {

        test.beforeEach(async ({ page }) => {
            // Dismiss cookie consent banner by setting localStorage before page loads
            await page.addInitScript(() => {
                localStorage.setItem('cookie_consent', 'true');
                localStorage.setItem('cookie_preferences', JSON.stringify({
                    necessary: true,
                    analytics: false,
                    functional: false
                }));
            });
        });

        test("should display footer on homepage", async ({ page }) => {
            await page.goto("/");

            await expect(page.locator("footer")).toBeVisible();
        });

        test("should navigate to privacy page from footer", async ({ page }) => {
            await page.goto("/");

            await page.locator("footer").getByRole("link", { name: /datenschutz/i }).click();

            await expect(page).toHaveURL(/\/privacy/);
        });

        test("should navigate to imprint page from footer", async ({ page }) => {
            await page.goto("/");

            await page.locator("footer").getByRole("link", { name: /impressum/i }).click();

            await expect(page).toHaveURL(/\/imprint/);
        });

    });

    test.describe("Protected Routes", () => {

        test("should redirect to login when accessing profile without auth", async ({ page }) => {
            await page.goto("/profile");

            await expect(page).toHaveURL(/\/login/);
        });

        test("should redirect to login when accessing messages without auth", async ({ page }) => {
            await page.goto("/messages");

            await expect(page).toHaveURL(/\/login/);
        });

        test("should redirect to login when accessing edit-profile without auth", async ({ page }) => {
            await page.goto("/edit-profile");

            await expect(page).toHaveURL(/\/login/);
        });

    });

});
