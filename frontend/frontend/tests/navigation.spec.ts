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

    test.describe("Navbar Navigation", () => {

        test("should navigate to home via logo", async ({ page }) => {
            await page.goto("/about-us");

            await page.locator(".navbar img, .navbar a").first().click();

            await expect(page).toHaveURL("/");
        });

        test("should open services dropdown menu", async ({ page }) => {
            await page.goto("/");

            // Click on services dropdown - hover to trigger (use first match)
            await page.locator(".navbar").getByText(/unsere leistungen/i).first().hover();

            // Check if dropdown becomes visible
            await expect(page.locator(".services-container")).toBeVisible({ timeout: 5000 });
        });

        test("should navigate to about us", async ({ page }) => {
            await page.goto("/");

            await page.locator(".navbar").getByRole("link", { name: /über uns/i }).click();

            await expect(page).toHaveURL(/\/about-us/);
        });

        test("should navigate to contact", async ({ page }) => {
            await page.goto("/");

            await page.locator(".navbar").getByRole("link", { name: /kontakt/i }).click();

            await expect(page).toHaveURL(/\/contact-us/);
        });

        test("should navigate to order via offer button", async ({ page }) => {
            await page.goto("/");

            await page.locator(".navbar").getByRole("link", { name: /angebot/i }).click();

            await expect(page).toHaveURL(/\/order/);
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

    test.describe("Language Switcher", () => {

        test("should display language dropdown", async ({ page }) => {
            await page.goto("/");

            const languageDropdown = page.locator(".navbar").locator("[class*='flag'], [class*='language'], select").first();
            await expect(languageDropdown).toBeVisible();
        });

    });

});
