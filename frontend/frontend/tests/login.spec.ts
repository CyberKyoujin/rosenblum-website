import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {

    test("should display login page", async ({ page }) => {
        await page.goto("/login");

        await expect(page.getByRole("heading", { name: /Kunde/i })).toBeVisible();
        await expect(page.getByLabel("Email")).toBeVisible();
        await expect(page.locator("#outlined-adornment-password")).toBeVisible();
    });

    test("should navigate to register page from login", async ({ page }) => {
        await page.goto("/login");

        await page.getByText("Registrieren").click();

        await expect(page).toHaveURL(/\/register/);
    });

    test("should navigate to password reset from login", async ({ page }) => {
        await page.goto("/login");

        await page.getByText("Passwort zurücksetzen").click();

        await expect(page).toHaveURL(/\/send-reset-password/);
    });

    test("should show validation errors for empty fields", async ({ page }) => {
        await page.goto("/login");

        // Click submit without filling fields
        await page.locator(".confirm-btn").click();

        // HTML5 validation should prevent form submission - email field stays focused
        const emailInput = page.getByLabel("Email");
        await expect(emailInput).toBeFocused();
    });

    test("should have working login form", async ({ page }) => {
        await page.goto("/login");

        // Fill credentials
        await page.getByLabel("Email").fill("test@example.com");
        await page.locator("#outlined-adornment-password").fill("Password@123");

        // Form should be fillable
        await expect(page.getByLabel("Email")).toHaveValue("test@example.com");

        // Submit button should be enabled
        await expect(page.locator(".confirm-btn")).toBeEnabled();
    });

    test("should login user with valid credentials", async ({ page }) => {

        const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        await page.route("**/user/login/", async (route) => {
            await route.fulfill({
                status: 200,
                json: {
                    access: fakeToken, 
                    refresh: fakeToken,
                    code: "successfull",
                    message: "successfull"
                }
            });
        });

        await page.route("**/user/users/me/", async (route) => {
            await route.fulfill({
                status: 200,
                json: {
                    id: 1,
                    email: "email@example.com",
                    firstName: "Max",
                    lastName: "Mustermann",
                }
            });
        });

        await page.goto("/login");

        await page.getByLabel("Email").fill("email@example.com");
        await page.locator("#outlined-adornment-password").fill("Password123");

        await page.locator(".confirm-btn").click();

        await expect(page).toHaveURL(/\/profile/)
    });

    test("should show error for invalid credentials", async ({ page }) => {
        await page.route("**/user/login/", async (route) => {
            await route.fulfill({
                status: 401,
                json: {
                    code: "authentication_failed",
                    message: "Ungültige Anmeldedaten"
                }
            });
        });

        await page.goto("/login");

        await page.getByLabel("Email").fill("wrong@example.com");
        await page.locator("#outlined-adornment-password").fill("WrongPassword123");

        await page.locator(".confirm-btn").click();

        await expect(page.getByRole("alert")).toBeVisible();
    });

    test("should show error for unverified account", async ({ page }) => {
        await page.route("**/user/login/", async (route) => {
            await route.fulfill({
                status: 403,
                json: {
                    code: "account_disabled",
                    message: "Konto nicht verifiziert"
                }
            });
        });

        await page.goto("/login");

        await page.getByLabel("Email").fill("unverified@example.com");
        await page.locator("#outlined-adornment-password").fill("Password@123");

        await page.locator(".confirm-btn").click();

        await expect(page.getByRole("alert")).toBeVisible();
    });

    test("should toggle password visibility", async ({ page }) => {
        await page.goto("/login");

        const passwordInput = page.locator("#outlined-adornment-password");
        await passwordInput.fill("TestPassword");

        // Initially password should be hidden
        await expect(passwordInput).toHaveAttribute("type", "password");

        // Click visibility toggle button
        await page.locator(".MuiInputAdornment-root button").click();

        // Password should now be visible
        await expect(passwordInput).toHaveAttribute("type", "text");
    });

});
