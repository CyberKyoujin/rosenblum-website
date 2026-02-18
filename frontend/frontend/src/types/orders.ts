
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
    order_type: string | null;
    payment_status: string;
    payment_type: string | null;
}

export interface OrderState {
    orders: Order[] | null;
    successfullyCreated: boolean;
    ordersLoading: boolean;
    createOrderLoading: boolean;
    createOrder: (formData: FormData) => Promise<{ id: string }>;
    fetchOrders: () => Promise<void>;
}

export interface FileData {
    id: string;
    file: string;
    file_name: string;
    file_size: string;
    order: string;
}

export interface DocumentData {
    id: number;
    type: string;
    language: string;
    price: string;
    individual_price: boolean;
    order: number;
}

export interface CostEstimateData {
    id: number;
    file: string;
    order: number;
}

export interface OrderData {
    id: string;
    files: FileData[];
    documents: DocumentData[];
    cost_estimate: CostEstimateData | null;
    name: string;
    email: string;
    phone_number: string;
    city: string;
    date: string;
    street: string;
    zip: string;
    message: string;
    status: string;
    order_type: string;
    payment_type: string | null;
    payment_status: string;
    formatted_timestamp: string;
    user: string;
}
