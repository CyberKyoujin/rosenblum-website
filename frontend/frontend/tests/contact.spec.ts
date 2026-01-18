import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {

    test("should display contact page with all elements", async ({ page }) => {
        await page.goto("/contact-us");

        // Title
        await expect(page.getByRole('heading', {
            name: 'Kontakt',
            exact: true,
            level: 1
            })).toBeVisible();

        // Contact info
        await expect(page.getByText(/sutthauser/i)).toBeVisible();
        await expect(page.getByText(/\+49 176/)).toBeVisible();

        // Opening hours
        await expect(page.getByText(/montag/i)).toBeVisible();

        // Contact form
        await expect(page.locator(".contact-form input").first()).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Ihre Nachricht...' })).toBeVisible();
    });

    test("should display German phone number warning", async ({ page }) => {
        await page.goto("/contact-us");

        await expect(page.getByText(/deutsche telefonnummer/i)).toBeVisible();
    });

    test("should show validation for required fields", async ({ page }) => {
        await page.goto("/contact-us");

        const submitButton = page.getByRole("button", { name: /absenden/i });
        await submitButton.click();

        // HTML5 validation prevents submission - first input is required
        const nameInput = page.locator(".contact-form input").first();
        await expect(nameInput).toHaveAttribute("required", "");
    });

    test("should submit contact form successfully", async ({ page }) => {
        await page.route("**/requests/", async (route) => {
            await route.fulfill({
                status: 201,
                json: { success: true }
            });
        });

        await page.goto("/contact-us");

        // Get form inputs by their order in the contact form
        const formInputs = page.locator(".contact-form input");

        // Fill form fields in order: Name, Email, Phone
        await formInputs.nth(0).fill("Test User");
        await formInputs.nth(1).fill("test@example.com");
        await formInputs.nth(2).fill("+491234567890");
        await page.getByRole('textbox', { name: 'Ihre Nachricht...' }).fill("Dies ist eine Testnachricht.");

        // Submit
        await page.getByRole("button", { name: /absenden/i }).click();

        // Expect success message
        await expect(page.getByTestId("alert")).toBeVisible();
    });

    test("should show error on form submission failure", async ({ page }) => {
        await page.route("**/requests/", async (route) => {
            await route.fulfill({
                status: 500,
                json: {
                    code: "server_error",
                    message: "Server Fehler"
                }
            });
        });

        await page.goto("/contact-us");

        // Get form inputs by their order in the contact form
        const formInputs = page.locator(".contact-form input");

        // Fill form fields in order: Name, Email, Phone
        await formInputs.nth(0).fill("Test User");
        await formInputs.nth(1).fill("test@example.com");
        await formInputs.nth(2).fill("1234567890");
        await page.getByRole('textbox', { name: 'Ihre Nachricht...' }).fill("Dies ist eine Testnachricht.");

        // Submit
        await page.getByRole("button", { name: /absenden/i }).click();

        // Expect error alert
        await expect(page.getByRole("alert")).toBeVisible();
    });

    test("should clear form after successful submission", async ({ page }) => {
        await page.route("**/requests/", async (route) => {
            await route.fulfill({
                status: 201,
                json: { success: true }
            });
        });

        await page.goto("/contact-us");

        const formInputs = page.locator(".contact-form input");
        const nameInput = formInputs.nth(0);
        const emailInput = formInputs.nth(1);

        // Fill form
        await nameInput.fill("Test User");
        await emailInput.fill("test@example.com");
        await formInputs.nth(2).fill("1234567890");
        await page.getByRole('textbox', { name: 'Ihre Nachricht...' }).fill("Testnachricht");

        // Submit
        await page.getByRole("button", { name: /absenden/i }).click();

        // Wait for success
        await expect(page.getByTestId("alert")).toBeVisible();

        // Form should be cleared
        await expect(nameInput).toHaveValue("");
        await expect(emailInput).toHaveValue("");
    });

    test("should show loading state while submitting", async ({ page }) => {
        await page.route("**/requests/", async (route) => {
            // Delay response to see loading state
            await new Promise(resolve => setTimeout(resolve, 500));
            await route.fulfill({
                status: 201,
                json: { success: true }
            });
        });

        await page.goto("/contact-us");

        // Get form inputs by their order in the contact form
        const formInputs = page.locator(".contact-form input");

        // Fill form fields in order: Name, Email, Phone
        await formInputs.nth(0).fill("Test User");
        await formInputs.nth(1).fill("test@example.com");
        await formInputs.nth(2).fill("1234567890");
        await page.getByRole('textbox', { name: 'Ihre Nachricht...' }).fill("Testnachricht");

        // Submit and check for loading indicator
        const submitButton = page.getByRole("button", { name: /absenden/i });
        await submitButton.click();

        // Button should show loading
        await expect(page.locator(".MuiCircularProgress-root")).toBeVisible();
    });

    test("should display map", async ({ page }) => {
        await page.goto("/contact-us");

        const iframe = page.locator("iframe");
        await expect(iframe).toBeVisible();
        await expect(iframe).toHaveAttribute("src", /google.com\/maps/);
    });

});
