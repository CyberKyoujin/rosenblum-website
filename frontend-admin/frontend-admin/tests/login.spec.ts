import { test, expect } from "@playwright/test";

test.describe("Admin Login Flow", () => {

    test.describe("Login Page Display", () => {

        test("should display login page with all elements", async ({ page }) => {
            await page.goto("/");

            // Title
            await expect(page.getByRole("heading", { name: /Melden Sie sich an/i })).toBeVisible();

            // Email field
            await expect(page.locator("#outlined-basic1")).toBeVisible();

            // Password field
            await expect(page.locator("#outlined-adornment-password")).toBeVisible();

            // Submit button
            await expect(page.locator("button.btn")).toBeVisible();
            await expect(page.getByText("WEITER")).toBeVisible();
        });

        test("should have email field with label", async ({ page }) => {
            await page.goto("/");

            await expect(page.getByLabel("Email")).toBeVisible();
        });

        test("should have password field with label", async ({ page }) => {
            await page.goto("/");

            await expect(page.getByLabel("Passwort")).toBeVisible();
        });

    });

    test.describe("Form Validation", () => {

        test("should require email field", async ({ page }) => {
            await page.goto("/");

            // Try to submit without filling email
            await page.locator("button.btn").click();

            // Should stay on login page (HTML5 validation prevents submit)
            await expect(page).toHaveURL("/");
        });

        test("should require password field", async ({ page }) => {
            await page.goto("/");

            // Fill only email
            await page.locator("#outlined-basic1").fill("admin@test.com");
            await page.locator("button.btn").click();

            // Should stay on login page
            await expect(page).toHaveURL("/");
        });

        test("should accept valid email format", async ({ page }) => {
            await page.goto("/");

            const emailInput = page.locator("#outlined-basic1");
            await emailInput.fill("admin@example.com");

            await expect(emailInput).toHaveValue("admin@example.com");
        });

    });

    test.describe("Password Visibility Toggle", () => {

        test("should toggle password visibility", async ({ page }) => {
            await page.goto("/");

            const passwordInput = page.locator("#outlined-adornment-password");
            await passwordInput.fill("TestPassword123");

            // Initially password should be hidden
            await expect(passwordInput).toHaveAttribute("type", "password");

            // Click visibility toggle button
            await page.locator("button[aria-label='toggle password visibility']").click();

            // Password should now be visible
            await expect(passwordInput).toHaveAttribute("type", "text");

            // Click again to hide
            await page.locator("button[aria-label='toggle password visibility']").click();

            // Password should be hidden again
            await expect(passwordInput).toHaveAttribute("type", "password");
        });

    });

    test.describe("Form Interaction", () => {

        test("should have working login form", async ({ page }) => {
            await page.goto("/");

            // Fill credentials
            await page.locator("#outlined-basic1").fill("admin@example.com");
            await page.locator("#outlined-adornment-password").fill("Password@123");

            // Form should be fillable
            await expect(page.locator("#outlined-basic1")).toHaveValue("admin@example.com");
            await expect(page.locator("#outlined-adornment-password")).toHaveValue("Password@123");

            // Submit button should be visible
            await expect(page.locator("button.btn")).toBeVisible();
        });

        test("should clear form fields", async ({ page }) => {
            await page.goto("/");

            const emailInput = page.locator("#outlined-basic1");
            const passwordInput = page.locator("#outlined-adornment-password");

            await emailInput.fill("test@test.com");
            await passwordInput.fill("password123");

            // Clear fields
            await emailInput.clear();
            await passwordInput.clear();

            await expect(emailInput).toHaveValue("");
            await expect(passwordInput).toHaveValue("");
        });

    });

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

    test.describe("Responsive Design", () => {

        test("should display correctly on mobile", async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto("/");

            await expect(page.getByRole("heading", { name: /Melden Sie sich an/i })).toBeVisible();
            await expect(page.locator("#outlined-basic1")).toBeVisible();
            await expect(page.locator("#outlined-adornment-password")).toBeVisible();
            await expect(page.locator("button.btn")).toBeVisible();
        });

        test("should display correctly on tablet", async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto("/");

            await expect(page.getByRole("heading", { name: /Melden Sie sich an/i })).toBeVisible();
            await expect(page.locator("#outlined-basic1")).toBeVisible();
            await expect(page.locator("button.btn")).toBeVisible();
        });

    });

});
