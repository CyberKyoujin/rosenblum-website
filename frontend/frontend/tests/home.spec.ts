import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {

    test.beforeEach(async ({ page }) => {
        // Mock reviews API
        await page.route("**/user/reviews/**", async (route) => {
            await route.fulfill({
                status: 200,
                json: [
                    {
                        author_name: "Test User 1",
                        rating: 5,
                        text: "Excellent translation service!",
                        profile_photo_url: ""
                    },
                    {
                        author_name: "Test User 2",
                        rating: 4,
                        text: "Very professional and fast.",
                        profile_photo_url: ""
                    }
                ]
            });
        });
    });

    test.describe("Hero Section", () => {

        test("should display main heading", async ({ page }) => {
            await page.goto("/");

            await expect(page.getByTestId("we-translate")).toBeVisible();
            await expect(page.getByRole("heading", { name: /profesionell/i })).toBeVisible();
        });

        test("should display call-to-action button", async ({ page }) => {
            await page.goto("/");

            const ctaButton = page.getByRole("button", { name: /angebot anfordern/i });
            await expect(ctaButton).toBeVisible();
        });

        test("should navigate to order page on CTA click", async ({ page }) => {
            await page.goto("/");

            await page.getByRole("button", { name: /angebot anfordern/i }).click();

            await expect(page).toHaveURL(/\/order/);
        });

    });

    test.describe("Statistics Section", () => {

        test("should display animated counters", async ({ page }) => {
            await page.goto("/");

            // Wait for counters to animate
            await page.waitForTimeout(3500);

            // Check for years counter - use specific container
            await expect(page.locator(".years-container h1")).toBeVisible();
        });

        test("should display statistics labels", async ({ page }) => {
            await page.goto("/");

            // Use more specific selectors
            await expect(page.getByText("Schon seit")).toBeVisible();
            await expect(page.locator(".years-container").getByText(/jahren/i)).toBeVisible();
            await expect(page.getByText("Mehr als").first()).toBeVisible();
        });

    });

    test.describe("Reliability Section", () => {

        test("should display reliability section", async ({ page }) => {
            await page.goto("/");

            // Use role to get the specific heading
            await expect(page.getByRole("heading", { name: "zuverlässig." })).toBeVisible();
        });

    });

    test.describe("Reviews Section", () => {

        test("should display reviews section heading", async ({ page }) => {
            await page.goto("/");

            await expect(page.getByRole("heading", { name: /bewertungen/i })).toBeVisible();
        });

        test("should load and display reviews", async ({ page }) => {
            await page.goto("/");

            // Wait for reviews to load - look in slider container
            await expect(page.locator(".slider-container").getByRole('heading', { name: 'Test User 1' })).toBeVisible({ timeout: 10000 });
        });

        test("should display star ratings", async ({ page }) => {
            await page.goto("/");

            // Wait for reviews and ratings to load
            await page.waitForSelector(".slider-container .review-container", { timeout: 10000 });
            const ratings = page.locator(".slider-container [class*='Rating']");
            await expect(ratings.first()).toBeVisible();
        });

    });

    test.describe("Location Section", () => {

        test("should display location section", async ({ page }) => {
            await page.goto("/");

            await expect(page.getByRole("heading", { name: /standort/i })).toBeVisible();
        });

        test("should display address", async ({ page }) => {
            await page.goto("/");

            await expect(page.locator(".contacts-container").getByText(/altepost/i)).toBeVisible();
            await expect(page.locator(".contacts-container").getByText(/osnabrück/i)).toBeVisible();
        });

        test("should display phone number", async ({ page }) => {
            await page.goto("/");

            // Phone number is displayed in footer
            await expect(page.locator("footer").getByText(/0176/)).toBeVisible();
        });

        test("should display Google Maps iframe", async ({ page }) => {
            await page.goto("/");

            const iframe = page.locator(".cu__map-embed iframe[src*='google.com/maps']");
            await expect(iframe).toBeVisible();
        });

    });

    test.describe("Footer", () => {

        test("should display footer", async ({ page }) => {
            await page.goto("/");

            await expect(page.locator("footer")).toBeVisible();
        });

        test("should display copyright", async ({ page }) => {
            await page.goto("/");

            const currentYear = new Date().getFullYear();
            await expect(page.getByText(new RegExp(`© ${currentYear}`))).toBeVisible();
        });

    });

    test.describe("Error Handling", () => {

        test("should continue to display page when reviews fail to load", async ({ page }) => {
            // Mock reviews endpoint to fail
            await page.route("http://127.0.0.1:8000/user/reviews/**", async (route) => {
                await route.fulfill({
                    status: 500,
                    json: {
                        code: "server_error",
                        message: "Server error"
                    }
                });
            });

            await page.goto("/");

            // Page should still load with main content visible even if reviews fail
            await expect(page.getByTestId("we-translate")).toBeVisible();
            await expect(page.getByRole("button", { name: /angebot anfordern/i })).toBeVisible();
        });

    });

    test.describe("Responsive Design", () => {

        test("should display correctly on mobile", async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto("/");

            await expect(page.getByTestId("we-translate")).toBeVisible();
            await expect(page.getByRole("button", { name: /angebot anfordern/i })).toBeVisible();
        });

        test("should display correctly on tablet", async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto("/");

            await expect(page.getByTestId("we-translate")).toBeVisible();
        });

    });

});
