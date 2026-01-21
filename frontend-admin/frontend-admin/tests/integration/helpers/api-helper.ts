import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

interface AdminCredentials {
    email: string;
    password: string;
}

interface OrderData {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    city: string;
    street: string;
    zip: string;
    message?: string;
    status: string;
    order_type: string;
}

interface RequestData {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    message: string;
}

/**
 * Login as admin and return tokens
 */
export async function loginAsAdmin({ email, password }: AdminCredentials) {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const response = await axios.post(`${API_BASE_URL}/admin-user/login/`, formData);
    return {
        access: response.data.access,
        refresh: response.data.refresh
    };
}

/**
 * Create a test order directly via API for testing
 */
export async function createTestOrder(accessToken: string): Promise<OrderData> {
    const formData = new FormData();
    formData.append("name", "Test Order User");
    formData.append("email", `test_order_${Date.now()}@example.com`);
    formData.append("phone_number", "+49301234567");
    formData.append("city", "Berlin");
    formData.append("street", "Test Straße 1");
    formData.append("zip", "10115");
    formData.append("message", "Integration test order");
    formData.append("order_type", "order");

    const response = await axios.post(`${API_BASE_URL}/orders/`, formData, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
}

/**
 * Create a test request/message directly via API for testing
 */
export async function createTestRequest(): Promise<RequestData> {
    const formData = new FormData();
    formData.append("name", "Test Request User");
    formData.append("email", `test_request_${Date.now()}@example.com`);
    formData.append("phone_number", "+49301234567");
    formData.append("message", "Integration test request message");

    const response = await axios.post(`${API_BASE_URL}/requests/`, formData);
    return response.data;
}

/**
 * Create a test user for messaging tests
 */
export async function createTestUser(accessToken: string) {
    const userData = {
        email: `test_user_${Date.now()}@example.com`,
        first_name: "Test",
        last_name: "User",
        password: "TestPassword123!"
    };

    const response = await axios.post(`${API_BASE_URL}/user/users/`, userData, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
}

/**
 * Get an existing order for testing
 */
export async function getExistingOrder(accessToken: string): Promise<OrderData | null> {
    try {
        const response = await axios.get(`${API_BASE_URL}/orders/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.data.results && response.data.results.length > 0) {
            return response.data.results[0];
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Get an existing request for testing
 */
export async function getExistingRequest(accessToken: string): Promise<RequestData | null> {
    try {
        const response = await axios.get(`${API_BASE_URL}/requests/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.data.results && response.data.results.length > 0) {
            return response.data.results[0];
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Get an existing user for messaging tests
 */
export async function getExistingUser(accessToken: string) {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/users/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.data.results && response.data.results.length > 0) {
            // Find a non-admin user
            const regularUser = response.data.results.find((user: { is_staff: boolean }) => !user.is_staff);
            return regularUser || response.data.results[0];
        }
        return null;
    } catch {
        return null;
    }
}
