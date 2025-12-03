
export interface Order {
    id: string | null;
    files: [] | null;
    city: string | null;
    date: string | null;
    message: string | null;
    name: string | null;
    phone_number: string | null;
    status: string | null;
    zip: string | null;
}

export interface OrderState {
    orders: Order[] | null;
    successfullyCreated: boolean;
    ordersLoading: boolean;
    createOrderLoading: boolean;
    createOrder: (formData: FormData) => Promise<void>;
    fetchOrders: () => Promise<void>;
}