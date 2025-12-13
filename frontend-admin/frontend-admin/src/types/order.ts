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