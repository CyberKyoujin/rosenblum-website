import { test, expect } from "@playwright/test";
import { setupAuth, setupApiMocks, mockUserData } from "./auth.setup";

test.describe("Edit Profile Page (Authenticated)", () => {

    test.describe("Edit Profile Page Display", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page);
        });

        test("should display edit profile page with title", async ({ page }) => {
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });

            // Title section should be visible
            await expect(page.locator(".profile-title-container")).toBeVisible();
        });

        test("should display phone number field", async ({ page }) => {
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });

            await expect(page.locator("#phone-number")).toBeVisible();
        });

        test("should display city field", async ({ page }) => {
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });

            await expect(page.locator("#city")).toBeVisible();
        });

        test("should display street field", async ({ page }) => {
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });

            await expect(page.locator("#street")).toBeVisible();
        });

        test("should display zip field", async ({ page }) => {
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });

            await expect(page.locator("#zip")).toBeVisible();
        });

        test("should display save button", async ({ page }) => {
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });

            await expect(page.locator(".confirm-btn")).toBeVisible();
        });

        test("should display cancel option", async ({ page }) => {
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });

            await expect(page.locator(".cancel-container")).toBeVisible();
        });

        test("should pre-fill form with existing user data", async ({ page }) => {
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });

            // Fields should have existing values - city and street are text fields
            await expect(page.locator("#city")).toHaveValue(mockUserData.city);
            await expect(page.locator("#street")).toHaveValue(mockUserData.street);
        });

    });

    test.describe("Edit Profile Form Interaction", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page);
        });

        test("should allow editing phone number", async ({ page }) => {
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });

            const phoneInput = page.locator("#phone-number");
            await phoneInput.clear();
            await phoneInput.fill("0171987654321");

            await expect(phoneInput).toHaveValue("0171987654321");
        });

        test("should allow editing city", async ({ page }) => {
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });

            const cityInput = page.locator("#city");
            await cityInput.clear();
            await cityInput.fill("München");

            await expect(cityInput).toHaveValue("München");
        });

        test("should allow editing street", async ({ page }) => {
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });

            const streetInput = page.locator("#street");
            await streetInput.clear();
            await streetInput.fill("Neue Straße 42");

            await expect(streetInput).toHaveValue("Neue Straße 42");
        });

        test("should allow editing zip code", async ({ page }) => {
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });

            const zipInput = page.locator("#zip");
            await zipInput.clear();
            await zipInput.fill("80331");

            await expect(zipInput).toHaveValue("80331");
        });

    });

    test.describe("Edit Profile Form Submission", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page);
        });

        test("should have functional submit button", async ({ page }) => {
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });

            // Fill required fields
            const phoneInput = page.locator("#phone-number");
            const cityInput = page.locator("#city");
            const streetInput = page.locator("#street");
            const zipInput = page.locator("#zip");

            await phoneInput.fill("1234567890");
            await cityInput.fill("Hamburg");
            await streetInput.fill("Test Str. 1");
            await zipInput.fill("12345");

            // Submit button should be clickable
            const submitBtn = page.locator(".confirm-btn");
            await expect(submitBtn).toBeEnabled();
        });

    });

    test.describe("Profile Image Upload", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page);
        });

        test("should display avatar section", async ({ page }) => {
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });

            // Avatar container should be visible
            await expect(page.locator(".edit-avatar-container, .image-container").first()).toBeVisible();
        });

        test("should have file input for profile image", async ({ page }) => {
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });

            // File input should exist (may be hidden)
            await expect(page.locator("#file-input")).toBeAttached();
        });

    });

    test.describe("Responsive Design", () => {

        test.beforeEach(async ({ page }) => {
            await setupAuth(page);
            await setupApiMocks(page);
        });

        test("should display correctly on mobile", async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });
            await expect(page.locator("#phone-number")).toBeVisible();
            await expect(page.locator(".confirm-btn")).toBeVisible();
        });

        test("should display correctly on tablet", async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto("/edit-profile");

            await expect(page.locator(".profile-edit-container")).toBeVisible({ timeout: 10000 });
            await expect(page.locator("#phone-number")).toBeVisible();
            await expect(page.locator(".confirm-btn")).toBeVisible();
        });

    });

});
