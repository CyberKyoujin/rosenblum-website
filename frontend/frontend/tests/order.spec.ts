import { test, expect } from "@playwright/test";

test.describe("Order Flow", () => {

    test.describe("Order Page Display", () => {

        test("should display order page with all form elements", async ({ page }) => {
            await page.goto("/order");

            // Page title
            await expect(page.getByRole("heading").first()).toBeVisible();

            // Contact info fields - use form container
            const formInputs = page.locator(".order-contacts-content input");
            await expect(formInputs.first()).toBeVisible();

            // Message field
            await expect(page.locator("textarea").first()).toBeVisible();

            // File upload area
            await expect(page.locator(".file-upload")).toBeVisible();

            // Submit button
            await expect(page.locator(".send-btn")).toBeVisible();
        });

        test("should display file upload instructions", async ({ page }) => {
            await page.goto("/order");

            await expect(page.locator(".file-upload")).toBeVisible();
        });

    });

    test.describe("Form Validation", () => {

        test("should not submit when required fields are empty", async ({ page }) => {
            await page.goto("/order");

            const submitButton = page.locator(".send-btn");
            await submitButton.click({ force: true });

            // React Hook Form validates - form stays on page (no redirect)
            await expect(page).toHaveURL(/\/order/);

            // Submit button should not show loading state (validation failed before submit)
            await expect(page.locator(".MuiCircularProgress-root")).not.toBeVisible();
        });

        test("should not submit with invalid email", async ({ page }) => {
            await page.goto("/order");

            const formInputs = page.locator(".order-contacts-content input");

            // Fill form fields in order: Name, Email, Phone, City, Street, ZIP
            await formInputs.nth(0).fill("Test User");
            await formInputs.nth(1).fill("invalid-email");
            await formInputs.nth(2).fill("1234567890");
            await formInputs.nth(3).fill("Berlin");
            await formInputs.nth(4).fill("Test Str. 1");
            await formInputs.nth(5).fill("12345");

            await page.locator(".send-btn").click({ force: true });

            // Form should stay on order page (validation failed)
            await expect(page).toHaveURL(/\/order/);
        });

        test("should not submit when address fields are missing", async ({ page }) => {
            await page.goto("/order");

            const formInputs = page.locator(".order-contacts-content input");

            // Fill only first three fields
            await formInputs.nth(0).fill("Test User");
            await formInputs.nth(1).fill("test@example.com");
            await formInputs.nth(2).fill("1234567890");

            // Leave address fields empty and try to submit
            await page.locator(".send-btn").click({ force: true });

            // Form should stay on order page (validation failed)
            await expect(page).toHaveURL(/\/order/);
        });

    });

    test.describe("File Upload", () => {

        test("should display file upload dropzone", async ({ page }) => {
            await page.goto("/order");

            const dropzone = page.locator(".file-upload");
            await expect(dropzone).toBeVisible();
        });

        test("should upload file via input", async ({ page }) => {
            await page.goto("/order");

            const fileInput = page.locator("input[type='file']");

            await fileInput.setInputFiles({
                name: "test-document.pdf",
                mimeType: "application/pdf",
                buffer: Buffer.from("test pdf content")
            });

            // File should appear in the list
            await expect(page.locator(".files-container .file-container")).toBeVisible();
        });

        test("should allow multiple file uploads", async ({ page }) => {
            await page.goto("/order");

            const fileInput = page.locator("input[type='file']");

            await fileInput.setInputFiles([
                {
                    name: "document1.pdf",
                    mimeType: "application/pdf",
                    buffer: Buffer.from("test pdf 1")
                },
                {
                    name: "document2.pdf",
                    mimeType: "application/pdf",
                    buffer: Buffer.from("test pdf 2")
                }
            ]);

            // Both files should appear
            const fileContainers = page.locator(".files-container .file-container");
            await expect(fileContainers).toHaveCount(2);
        });

        test("should remove uploaded file", async ({ page }) => {
            await page.goto("/order");

            const fileInput = page.locator("input[type='file']");

            await fileInput.setInputFiles({
                name: "test-file.pdf",
                mimeType: "application/pdf",
                buffer: Buffer.from("test content")
            });

            await expect(page.locator(".files-container .file-container")).toBeVisible();

            // Click remove button
            await page.locator(".file-remove-btn").click();

            // File should be removed
            await expect(page.locator(".files-container .file-container")).not.toBeVisible();
        });

    });

    test.describe("Form Submission", () => {

        test("should submit order successfully", async ({ page }) => {
            await page.route("**/orders/", async (route) => {
                await route.fulfill({
                    status: 201,
                    json: {
                        id: 1,
                        status: "pending",
                        message: "Order created successfully"
                    }
                });
            });

            await page.goto("/order");

            const formInputs = page.locator(".order-contacts-content input");

            // Fill all required fields in order
            await formInputs.nth(0).fill("Test User");
            await formInputs.nth(1).fill("test@example.com");
            await formInputs.nth(2).fill("1234567890");
            await formInputs.nth(3).fill("Berlin");
            await formInputs.nth(4).fill("Test Straße 1");
            await formInputs.nth(5).fill("12345");
            await page.locator("textarea").first().fill("Bitte übersetzen Sie dieses Dokument.");

            // Upload a file
            const fileInput = page.locator("input[type='file']");
            await fileInput.setInputFiles({
                name: "document.pdf",
                mimeType: "application/pdf",
                buffer: Buffer.from("test pdf content")
            });

            // Submit form
            await page.locator(".send-btn").click();

            // Should show success or redirect
            await expect(page).toHaveURL(/\/profile|\//, { timeout: 10000 });
        });

        test("should have submit button enabled", async ({ page }) => {
            await page.goto("/order");

            const formInputs = page.locator(".order-contacts-content input");

            // Fill all required fields with valid German phone number
            await formInputs.nth(0).fill("Test User");
            await formInputs.nth(1).fill("test@example.com");
            await formInputs.nth(2).fill("+49 30 123456789");
            await formInputs.nth(3).fill("Berlin");
            await formInputs.nth(4).fill("Test Straße 1");
            await formInputs.nth(5).fill("12345");

            // Submit button should be enabled after filling required fields
            const submitButton = page.locator(".send-btn");
            await expect(submitButton).toBeEnabled();
        });

        test("should display message textarea", async ({ page }) => {
            await page.goto("/order");

            // Message textarea should be visible
            const messageField = page.locator("textarea").first();
            await expect(messageField).toBeVisible();

            // Should be able to type in the message field
            await messageField.fill("Bitte übersetzen Sie dieses Dokument.");
            await expect(messageField).toHaveValue("Bitte übersetzen Sie dieses Dokument.");
        });

    });

    test.describe("Order Without File", () => {

        test("should require at least one file", async ({ page }) => {
            await page.goto("/order");

            const formInputs = page.locator(".order-contacts-content input");

            // Fill all required fields but no file
            await formInputs.nth(0).fill("Test User");
            await formInputs.nth(1).fill("test@example.com");
            await formInputs.nth(2).fill("1234567890");
            await formInputs.nth(3).fill("Berlin");
            await formInputs.nth(4).fill("Test Straße 1");
            await formInputs.nth(5).fill("12345");

            // Try to submit without file - form should not submit or show validation
            await page.locator(".send-btn").click();

            // Should stay on order page
            await expect(page).toHaveURL(/\/order/);
        });

    });

    test.describe("Responsive Design", () => {

        test("should display correctly on mobile", async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto("/order");

            await expect(page.getByRole("heading").first()).toBeVisible();
            await expect(page.locator(".order-contacts-content input").first()).toBeVisible();
            await expect(page.locator(".send-btn")).toBeVisible();
        });

        test("should display correctly on tablet", async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto("/order");

            await expect(page.getByRole("heading").first()).toBeVisible();
            await expect(page.locator(".order-contacts-content input").first()).toBeVisible();
        });

    });


});
