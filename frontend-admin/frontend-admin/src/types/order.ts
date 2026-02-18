import { FileData } from "./file";

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

export interface InvoiceData {
    id: number;
    file: string;
    order: number;
}

export interface Order{
    id: number;
    user: number;
    name: string;
    formatted_timestamp: string;
    status: string;
    is_new: boolean;
    message: string;
    phone_number: string;
    street: string;
    city: string;
    zip: string;
    files: FileData[];
    documents: DocumentData[];
    order_type: string;
    payment_type: string | null;
    payment_status: string;
    email: string;
    cost_estimate: CostEstimateData | null;
    invoice: InvoiceData | null;
    lexoffice_id: string | null;
    stripe_payment_intent_id: string | null;
}

export interface OrderResponseData {
    count: number;
    next: string;
    previous: string | null;
    results: Order[];
    new_count?: number;
}

export interface OrderFiltersParams {
    search? : string;
    status? : string;
    isNew?: boolean | null;
    ordering?: string;
    order_type?: string;
    payment_status?: string;
    payment_type?: string;
}

export interface NewItems{
    orders: number,
    requests: number;
}

export interface StatusConfig {
    label: string;
    color: string;
    bg: string;
}

export const statusConfigs: Record<string, StatusConfig> = {
    review:        { label: 'Wird überprüft', color: '#92400e', bg: '#fef3c7' },
    in_progress:   { label: 'In Bearbeitung', color: '#1e40af', bg: '#dbeafe' },
    completed:     { label: 'Fertig', color: '#166534', bg: '#dcfce7' },
    ready_pick_up: { label: 'Abholbereit', color: '#7c3aed', bg: '#ede9fe' },
    sent:          { label: 'Versendet', color: '#0369a1', bg: '#e0f2fe' },
    canceled:      { label: 'Storniert', color: '#991b1b', bg: '#fee2e2' },
};

export const getStatusConfig = (status: string): StatusConfig =>
    statusConfigs[status] || statusConfigs.review;

// Keep legacy exports for any remaining usages
export const statusValues: Record<string, string> = Object.fromEntries(
    Object.entries(statusConfigs).map(([k, v]) => [k, v.label])
);

export const statusColors: Record<string, string> = Object.fromEntries(
    Object.entries(statusConfigs).map(([k, v]) => [k, v.color])
);

export type StatusKeys = keyof typeof statusConfigs;
