import { test, expect } from "@playwright/test";

test.describe("Password Reset Flow", () => {

    // Pre-set cookie consent for all tests to avoid banner blocking interactions
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('cookie_consent', 'true');
            localStorage.setItem('cookie_preferences', JSON.stringify({
                essential: true,
                functional: true,
                analytics: true,
                marketing: true
            }));
        });
    });

    test.describe("Send Reset Link", () => {

        test("should display send password reset page", async ({ page }) => {
            await page.goto("/send-reset-password");

            await expect(page.getByRole("heading").first()).toBeVisible();
            await expect(page.getByLabel("Email")).toBeVisible();
            await expect(page.locator(".confirm-btn")).toBeVisible();
        });

        test("should show validation error for invalid email", async ({ page }) => {
            await page.goto("/send-reset-password");

            const emailInput = page.getByLabel("Email");
            await emailInput.fill("invalid-email");

            // Press Enter to submit the form (avoids navbar overlap issues)
            await emailInput.press("Enter");

            // Should show email validation error and stay on page
            await expect(page.getByText(/ungültig/i)).toBeVisible({ timeout: 5000 });
            await expect(page).toHaveURL(/\/send-reset-password/);
        });

        test("should have email field required", async ({ page }) => {
            await page.goto("/send-reset-password");

            const emailInput = page.getByLabel("Email");

            // Focus and try to submit empty form with Enter
            await emailInput.focus();
            await emailInput.press("Enter");

            // Should stay on the same page (form won't submit without valid email)
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
