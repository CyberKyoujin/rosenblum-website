import { test, expect } from "@playwright/test";

test.describe("Password Reset Flow", () => {

    test.describe("Send Reset Link", () => {

        test("should display send password reset page", async ({ page }) => {
            await page.goto("/send-reset-password");

            await expect(page.getByRole("heading").first()).toBeVisible();
            await expect(page.getByLabel("Email")).toBeVisible();
            await expect(page.locator(".confirm-btn")).toBeVisible();
        });

        test("should show validation error for invalid email", async ({ page }) => {
            await page.goto("/send-reset-password");

            await page.getByLabel("Email").fill("invalid-email");
            await page.locator(".confirm-btn").click({ force: true });

            // Should show email validation error or stay on page
            await expect(page).toHaveURL(/\/send-reset-password/);
        });

        test("should have email field required", async ({ page }) => {
            await page.goto("/send-reset-password");

            // Try to submit without filling email
            await page.locator(".confirm-btn").click({ force: true });

            // Should stay on the same page
            await expect(page).toHaveURL(/\/send-reset-password/);
        });

        test("should accept valid email format", async ({ page }) => {
            await page.goto("/send-reset-password");

            // Fill a valid email
            await page.getByLabel("Email").fill("test@example.com");

            // Email field should have the value
            await expect(page.getByLabel("Email")).toHaveValue("test@example.com");
        });

    });

    test.describe("Reset Password Confirmation", () => {

        const resetUrl = "/password-reset/confirm/test-uid/test-token";

        test("should display reset password form", async ({ page }) => {
            await page.goto(resetUrl);

            await expect(page.getByRole("heading").first()).toBeVisible();
        });

        test("should show password requirements", async ({ page }) => {
            await page.goto(resetUrl);

            await expect(page.getByText(/8 zeichen/i)).toBeVisible();
            await expect(page.getByText(/zahl/i)).toBeVisible();
            await expect(page.getByText(/großbuchstaben/i)).toBeVisible();
        });

        test("should have two password input fields", async ({ page }) => {
            await page.goto(resetUrl);

            const passwordInputs = page.locator("input[type='password']");
            await expect(passwordInputs.first()).toBeVisible();
            await expect(passwordInputs.last()).toBeVisible();
        });

        test("should have submit button", async ({ page }) => {
            await page.goto(resetUrl);

            await expect(page.locator(".confirm-btn")).toBeVisible();
        });

        test("should have password visibility toggle", async ({ page }) => {
            await page.goto(resetUrl);

            // Toggle button should be visible
            await expect(page.locator(".MuiInputAdornment-root button").first()).toBeVisible();
        });

    });

    test.describe("Navigation from Login", () => {

        test("should navigate to password reset from login page", async ({ page }) => {
            await page.goto("/login");

            // Click password reset link
            await page.getByText("Passwort zurücksetzen").click();

            await expect(page).toHaveURL(/\/send-reset-password/);
        });

    });

});
