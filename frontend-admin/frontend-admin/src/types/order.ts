import { FileData } from "./file";

 
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
    order_type: string;
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
}

export interface NewItems{
    orders: number,
    requests: number;
}

export const statusValues = {
    "review": "wird überprüft",
    "sent": "Versand",
    "in_progress": "In Bearbeitung",
    "canceled": "Storniert",
    "ready_pick_up": "Abholbereit",
    "completed": "Fertig"
};

export const statusColors = {
    "review": "#FFE208",
    "sent": "#05a500ff",
    "in_progress": "#FFE208",
    "canceled": "#ff3737ff",
    "ready_pick_up": "#05a500ff",
    "completed": "#05a500ff"
}

export type StatusKeys = 'review' | 'in_progress' | 'completed' | 'ready_pick_up' | 'sent' | 'canceled';
