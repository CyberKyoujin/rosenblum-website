import { test, expect } from "@playwright/test";
import {
    loginAsAdmin,
    createTestOrder,
    createTestRequest,
    getExistingOrder,
    getExistingRequest,
    getExistingUser
} from "./helpers/api-helper";

/**
 * Critical Admin Panel Flow Integration Tests
 *
 * These tests run against a REAL backend (not mocked).
 * They test the most important admin user journeys end-to-end.
 *
 * Prerequisites:
 * - Backend running at http://localhost:8000
 * - Database available and migrated
 * - Superuser created (admin@example.com / admin123)
 *
 * Run with: npx playwright test tests/integration/ --project=chromium
 */

// Admin credentials (from init_superuser.py defaults)
const ADMIN_EMAIL = "rosenblum.uebersetzungsbuero@gmail.com";
const ADMIN_PASSWORD = "rosenblum_password123";

test.describe("Critical Admin Flows (Real Backend)", () => {

    test.describe.configure({ mode: "serial" }); // Run tests in order

    let accessToken: string;
    let refreshToken: string;
    let testOrderId: number;
    let testRequestId: number;
    let testUserId: number;

    test.beforeAll(async () => {
        // Pre-login to get tokens for API calls
        const tokens = await loginAsAdmin({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
        accessToken = tokens.access;
        refreshToken = tokens.refresh;
    });

    test("1. Admin Login Flow", async ({ page, context }) => {
        await page.goto("/");

        // Wait for login form to load
        await expect(page.locator("form")).toBeVisible({ timeout: 10000 });

        // Verify we're on the login page
        await expect(page.getByText("Melden Sie sich an")).toBeVisible();

        // Fill login form
        await page.getByLabel("Email").fill(ADMIN_EMAIL);
        await page.locator("#outlined-adornment-password").fill(ADMIN_PASSWORD);

        // Submit form
        await page.locator("button.btn").click();

        // Should redirect to dashboard after successful login
        await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });

        // Verify cookies are set
        const cookies = await context.cookies();
        const accessCookie = cookies.find(c => c.name === "access");
        const refreshCookie = cookies.find(c => c.name === "refresh");
        expect(accessCookie).toBeTruthy();
        expect(refreshCookie).toBeTruthy();

        // Store for subsequent tests
        if (accessCookie && refreshCookie) {
            accessToken = accessCookie.value;
            refreshToken = refreshCookie.value;
        }
    });

    test("2. Edit Order Details Flow", async ({ page, context }) => {
        // Set auth cookies
        await context.addCookies([
            { name: "access", value: accessToken, domain: "localhost", path: "/" },
            { name: "refresh", value: refreshToken, domain: "localhost", path: "/" }
        ]);

        // Get or create a test order
        let order = await getExistingOrder(accessToken);
        if (!order) {
            order = await createTestOrder(accessToken);
        }
        testOrderId = order.id;

        // Navigate to order details page
        await page.goto(`/order/${testOrderId}`);

        // Wait for order details to load
        await expect(page.getByText("Auftragsübersicht")).toBeVisible({ timeout: 10000 });

        // Click "Bearbeiten" (Edit) button
        await page.locator("button.green-btn").filter({ hasText: "Bearbeiten" }).click();

        // The status dropdown should now be visible
        await expect(page.getByText('wird überprüft')).toBeVisible();

        // Change status via dropdown
        await page.locator("#demo-simple-select").first().click();

        // Wait for dropdown menu and select a different status
        await page.waitForTimeout(500);
        const menuItems = page.locator('[role="option"]');
        const itemCount = await menuItems.count();

        if (itemCount > 1) {
            // Click on the second option to change the status
            await menuItems.nth(1).click();
        }

        // Click "Speichern" (Save) button
        await page.locator("button.green-btn").filter({ hasText: "Speichern" }).click();

        // Wait for save to complete - button should change back to "Bearbeiten"
        await expect(page.locator("button.green-btn").filter({ hasText: "Bearbeiten" })).toBeVisible({ timeout: 10000 });

        // Verify the order details are still displayed (no error)
        await expect(page.getByText(`# ro-${testOrderId}`)).toBeVisible();
    });

    test("3. Delete Order Flow", async ({ page, context }) => {
        // Set auth cookies
        await context.addCookies([
            { name: "access", value: accessToken, domain: "localhost", path: "/" },
            { name: "refresh", value: refreshToken, domain: "localhost", path: "/" }
        ]);

        // Create a new order specifically for deletion
        const orderToDelete = await createTestOrder(accessToken);
        const orderIdToDelete = orderToDelete.id;

        // Navigate to order details page
        await page.goto(`/order/${orderIdToDelete}`);

        // Wait for order details to load
        await expect(page.getByText("Auftragsübersicht")).toBeVisible({ timeout: 10000 });
        await expect(page.getByText(`# ro-${orderIdToDelete}`)).toBeVisible();

        // Click "Löschen" (Delete) button
        await page.locator("button.red-btn").filter({ hasText: "Löschen" }).click();

        // Confirmation dialog should appear
        await expect(page.getByText("Wollen Sie den Auftrag löschen?")).toBeVisible({ timeout: 5000 });

        // Click "Löschen" (Confirm delete) in the confirmation dialog
        await page.locator("button.notification-btn-confirm").click();

        // Should redirect to dashboard or show success
        await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    });

    test("4. Respond to Request Flow", async ({ page, context }) => {
        // Set auth cookies
        await context.addCookies([
            { name: "access", value: accessToken, domain: "localhost", path: "/" },
            { name: "refresh", value: refreshToken, domain: "localhost", path: "/" }
        ]);

        // Get or create a test request
        let request = await getExistingRequest(accessToken);
        if (!request) {
            request = await createTestRequest();
        }
        testRequestId = request.id;

        // Navigate to request details page
        await page.goto(`/request/${testRequestId}`);

        // Wait for request details to load
        await expect(page.getByText("Anfrageübersicht")).toBeVisible({ timeout: 10000 });

        // Find the answer textarea and fill it
        const answerTextarea = page.locator("textarea").first();
        await expect(answerTextarea).toBeVisible();

        const testAnswer = `Integration test answer - ${Date.now()}`;
        await answerTextarea.fill(testAnswer);

        // Click "WEITER" (Submit) button
        await page.locator("button.request-datails-btn").click();

        // Wait for success message
        await expect(page.getByText(/erfolgreich beantwortet|success/i)).toBeVisible({ timeout: 10000 });
    });

    test("5. Send Message to User Flow", async ({ page, context }) => {
        // Set auth cookies
        await context.addCookies([
            { name: "access", value: accessToken, domain: "localhost", path: "/" },
            { name: "refresh", value: refreshToken, domain: "localhost", path: "/" }
        ]);

        // Get an existing user to message
        const user = await getExistingUser(accessToken);
        if (!user) {
            test.skip(true, "No users available to test messaging");
            return;
        }
        testUserId = user.id;

        // Navigate to user messages page
        await page.goto(`/user/${testUserId}/messages`);

        // Wait for messages page to load
        await expect(page.getByText("Nachrichten")).toBeVisible({ timeout: 10000 });

        // Find the message input textarea
        const messageInput = page.locator("textarea.message-input");
        await expect(messageInput).toBeVisible();

        // Type a test message
        const testMessage = `Integration test message - ${Date.now()}`;
        await messageInput.fill(testMessage);

        // Click send button (the second button with RiMailSendLine icon)
        await page.locator("button.send-message-container.hover-btn").last().click();

        // Wait for message to appear in the chat
        await page.waitForTimeout(2000);

        // Verify the message was sent (should appear in the messages section)
        await expect(page.getByText(testMessage).first()).toBeVisible({ timeout: 10000 });
    });

});

