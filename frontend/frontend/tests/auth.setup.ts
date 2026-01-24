import { Page } from "@playwright/test";

// Create a mock JWT token that can be decoded by jwt-decode
// JWT format: header.payload.signature (base64url encoded)
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

// Mock user data
export const mockUser = {
    id: 1,
    email: "test@example.com",
    first_name: "Max",
    last_name: "Mustermann",
    profile_img_url: ""
};

// Mock user data (full profile)
export const mockUserData = {
    id: 1,
    email: "test@example.com",
    first_name: "Max",
    last_name: "Mustermann",
    phone_number: "+49 30 123456789",
    city: "Berlin",
    street: "Test Straße 1",
    zip: "12345",
    date_joined: "2024-01-01T00:00:00Z",
    image_url: ""
};

// Create mock tokens
export const mockAccessToken = createMockJWT({
    ...mockUser,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    iat: Math.floor(Date.now() / 1000)
});

export const mockRefreshToken = createMockJWT({
    user_id: mockUser.id,
    exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days from now
    iat: Math.floor(Date.now() / 1000)
});

/**
 * Setup authentication for a page by injecting auth cookies
 */
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

/**
 * Setup API mocks for authenticated routes
 * Matches both direct backend calls (localhost:8000/api) and proxied calls (/api)
 */
export async function setupApiMocks(page: Page, options?: {
    userData?: object;
    orders?: object[];
    messages?: object[];
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

    // Mock user/users/me/ endpoint - for fetching current user data (GET only)
    await page.route(/.*\/api\/user\/users\/me.*/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(options?.userData ?? mockUserData)
        });
    });

    // Mock user profile update endpoint (PATCH /user/users/) - must be after /me/ route
    await page.route(/.*\/api\/user\/users\/?$/, async (route) => {
        const method = route.request().method();
        if (method === "PATCH") {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(options?.userData ?? mockUserData)
            });
        } else if (method === "GET") {
            // GET /user/users/ - return user list or single user
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(options?.userData ?? mockUserData)
            });
        } else {
            await route.continue();
        }
    });

    // Mock orders endpoint
    await page.route(/.*\/api\/orders.*/, async (route) => {
        if (route.request().method() === "GET") {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(options?.orders ?? [])
            });
        } else if (route.request().method() === "POST") {
            await route.fulfill({
                status: 201,
                contentType: "application/json",
                body: JSON.stringify({
                    id: 1,
                    status: "review",
                    message: "Order created successfully"
                })
            });
        } else {
            await route.continue();
        }
    });

    // Mock messages endpoint
    await page.route(/.*\/api\/messages\/?$/, async (route) => {
        if (route.request().method() === "GET") {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(options?.messages ?? [])
            });
        } else if (route.request().method() === "POST") {
            await route.fulfill({
                status: 201,
                contentType: "application/json",
                body: JSON.stringify({
                    id: 1,
                    content: "Message sent",
                    timestamp: new Date().toISOString()
                })
            });
        } else {
            await route.continue();
        }
    });

    // Mock messages toggle endpoint
    await page.route(/.*\/api\/messages\/toggle.*/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ success: true })
        });
    });
}
