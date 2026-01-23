import { Page } from "@playwright/test";

// Create a mock JWT token that can be decoded by jwt-decode
function createMockJWT(payload: object): string {
    const header = { alg: "HS256", typ: "JWT" };
    const base64UrlEncode = (obj: object) => {
        return Buffer.from(JSON.stringify(obj))
            .toString("base64")
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
    };
    return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.mock-signature`;
}

// Mock admin user
export const mockUser = {
    id: 999,
    email: "admin@test.com",
    first_name: "Test",
    last_name: "Admin",
    profile_img_url: ""
};

export const mockAccessToken = createMockJWT({
    ...mockUser,
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000)
});

export const mockRefreshToken = createMockJWT({
    user_id: mockUser.id,
    exp: Math.floor(Date.now() / 1000) + 86400 * 7,
    iat: Math.floor(Date.now() / 1000)
});

export async function setupAuth(page: Page) {
    await page.context().addCookies([
        {
            name: "access",
            value: mockAccessToken,
            domain: "localhost",
            path: "/",
            httpOnly: false,
            secure: false,
            sameSite: "Lax"
        },
        {
            name: "refresh",
            value: mockRefreshToken,
            domain: "localhost",
            path: "/",
            httpOnly: false,
            secure: false,
            sameSite: "Lax"
        }
    ]);
}

export async function setupApiMocks(page: Page, options?: {
    orders?: object;
    users?: object;
    messages?: object;
    translations?: object;
    statistics?: object;
}) {
    // Mock token refresh endpoint
    await page.route(/.*\/api\/user\/token-refresh.*/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                access: mockAccessToken,
                refresh: mockRefreshToken
            })
        });
    });

    // Mock orders endpoint
    await page.route(/.*\/api\/orders.*/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(options?.orders ?? { count: 0, results: [] })
        });
    });

    // Mock users endpoint - /user/users/ is the actual endpoint
    await page.route(/.*\/api\/user\/users.*/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(options?.users ?? { count: 0, results: [] })
        });
    });

    // Mock messages endpoint - /admin-user/messages/ is the actual endpoint
    await page.route(/.*\/api\/admin-user\/messages.*/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(options?.messages ?? { count: 0, results: [] })
        });
    });

    // Mock translations endpoint - admin-user/translations/ is the actual endpoint
    await page.route(/.*\/api\/admin-user\/translations.*/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(options?.translations ?? { count: 0, results: [] })
        });
    });

    // Mock statistics endpoints
    await page.route(/.*\/api\/statistics\/status-distribution.*/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify([])
        });
    });

    await page.route(/.*\/api\/statistics\/ordering-dynamics.*/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify([])
        });
    });

    await page.route(/.*\/api\/statistics\/type-distribution.*/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify([])
        });
    });

    await page.route(/.*\/api\/statistics\/customers-geography.*/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify([])
        });
    });

    await page.route(/.*\/api\/statistics\/customers-growth.*/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify([])
        });
    });

    await page.route(/.*\/api\/statistics\/order-request-comparison.*/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ orders: [], requests: [] })
        });
    });

    // Mock base statistics endpoint
    await page.route(/.*\/api\/statistics\/?$/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(options?.statistics ?? {})
        });
    });

    // Mock requests endpoint
    await page.route(/.*\/api\/requests.*/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ count: 0, results: [] })
        });
    });
}
