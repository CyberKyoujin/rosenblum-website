import { test, expect } from "@playwright/test";
import getVerficationCode from "./helpers/email-helper";
/**
 * Critical User Flow Integration Tests
 *
 * These tests run against a REAL backend (not mocked).
 * They test the most important user journeys end-to-end.
 *
 * Prerequisites:
 * - Backend running at http://localhost:8000
 * - Database available and migrated
 *
 * Run with: npx playwright test tests/integration/ --project=chromium
 */

// API_URL for reference (used by backend)
// const API_URL = "http://localhost:8000/api";

// Generate unique test data to avoid conflicts
const generateTestEmail = () => `test_${Date.now()}@example.com`;
const TEST_PASSWORD = "TestPassword123!";

test.describe("Critical User Flows (Real Backend)", () => {

    test.describe.configure({ mode: "serial" }); // Run tests in order

    let testEmail: string;
    let accessToken: string;
    let refreshToken: string;

    test.beforeAll(() => {
        testEmail = generateTestEmail();
    });


    test("1. User Registration Flow", async ({ page }) => {
        await page.goto("/register");

        // Wait for form to load
        await expect(page.locator("form")).toBeVisible({ timeout: 10000 });

        // Fill registration form using correct locators
        // Material UI TextField uses label association, data-testid for reliable selection
        await page.getByLabel("Email").fill(testEmail);
        await page.getByTestId("first-name").locator("input").fill("Test");
        await page.getByTestId("last-name").locator("input").fill("User");
        await page.getByTestId("password").locator("input").fill(TEST_PASSWORD);

        // Submit form
        await page.getByTestId("register-confirm").click();

        // Should redirect to email verification or show success
        await expect(page).toHaveURL(/\/email-verification/, { timeout: 15000 });

        // Wait a moment for verification code to be created in database
        await page.waitForTimeout(1000);

        const otp = await getVerficationCode({userEmail: testEmail});
        console.log(`OTP code received: "${otp}" (length: ${otp.length})`);

        // Fill each OTP input individually
        const otpInputs = page.getByTestId("otp-input");
        for (let i = 0; i < 6; i++) {
            await otpInputs.nth(i).locator("input").fill(otp[i]);
        }

        // Wait for OTP to be processed
        await page.waitForTimeout(500);

        await page.getByTestId("otp-submit").click();

        // Wait for verification response
        await expect(page).toHaveURL(/\/verification-success/, { timeout: 15000 });

        await page.getByTestId("success-btn").click()

        await expect(page).toHaveURL(/\/login/, { timeout: 15000 });

    });

    test("2. User Login Flow", async ({ page, context }) => {
        await page.goto("/login");

        // Wait for form to load
        await expect(page.locator("form")).toBeVisible({ timeout: 10000 });

        // Fill login form using Material UI label associations
        await page.getByLabel("Email").fill(testEmail);
        await page.locator("#outlined-adornment-password").fill(TEST_PASSWORD);

        // Submit form
        await page.locator("button.confirm-btn").click();

        // Should redirect to profile or home after successful login
        await expect(page).toHaveURL(/\/(profile|\/)?$/, { timeout: 15000 });

        // Verify cookies are set
        const cookies = await context.cookies();
        const accessCookie = cookies.find(c => c.name === "access");
        const refreshCookie = cookies.find(c => c.name === "refresh");
        expect(accessCookie).toBeTruthy();

        if (accessCookie && refreshCookie) {
            accessToken = accessCookie.value;
            refreshToken = refreshCookie.value;
        }
    });

    test("3. Create Order Flow (Authenticated)", async ({ page, context }) => {
        console.log(accessToken);
        // Set auth cookie if we have it from previous test
        if (accessToken && refreshToken) {
            await context.addCookies([
                {
                    name: "access",
                    value: accessToken,
                    domain: "localhost",
                    path: "/"
                }
            ]);
            await context.addCookies([
                {
                    name: "refresh",
                    value: refreshToken,
                    domain: "localhost",
                    path: "/"
                }
            ]);
        }

        await page.goto("/order");

        // Wait for form to load
        await expect(page.getByRole("heading").first()).toBeVisible({ timeout: 10000 });

        // Fill order form
        const formInputs = page.locator(".order-contacts-content input");

        await formInputs.nth(0).fill("Test User");
        await formInputs.nth(1).fill('test_user@example.com');
        await formInputs.nth(2).fill("+49301234567");
        await formInputs.nth(3).fill("Berlin");
        await formInputs.nth(4).fill("Test Straße 1");
        await formInputs.nth(5).fill("10115");

        // Add message
        const textarea = page.locator("textarea").first();
        await textarea.fill("This is a test order from E2E integration tests.");

        const fileInput = page.locator("input[type='file']");

        await fileInput.setInputFiles([
                {
                    name: "document1.pdf",
                    mimeType: "application/pdf",
                    buffer: Buffer.from("test pdf 1")
                },
        ])

        // Submit order
        await page.locator(".send-btn").click();

        // Should show success or redirect to profile
        await Promise.race([
            expect(page).toHaveURL(/\/profile/, { timeout: 15000 }),
        ]);
    });


});

test.describe("Contact Form (Real Backend)", () => {

    test("Submit contact form successfully", async ({ page }) => {
        await page.goto("/contact-us");

        // Wait for form
        await expect(page.locator("form.cu__form")).toBeVisible({ timeout: 10000 });

        // Fill form - contact form has 4 TextField components
        // Use the form's input elements in order: name, email, phone, message
        const formInputs = page.locator("form.cu__form input");
        await formInputs.nth(0).fill("Integration Test");
        await formInputs.nth(1).fill("integration-test@example.com");
        await formInputs.nth(2).fill("+49301234567");
        await page.getByLabel(/nachricht|message/i).fill("This is an integration test message.");

        // Submit
        await page.locator("button.contact-btn").click();

        // Should show success message
        await expect(page.getByText(/erfolgreich|success|gesendet/i)).toBeVisible({ timeout: 10000 });
    });

});
