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
}

export interface OrderFiltersParams {
    search? : string;
    status? : string;
    new?: boolean | null;
    ordering?: string;
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
    "sent": "green",
    "in_progress": "#FFE208",
    "canceled": "red",
    "ready_pick_up": "green",
    "completed": "green"
}

export type StatusKeys = 'review' | 'in_progress' | 'completed' | 'ready_pick_up' | 'sent' | 'canceled';
