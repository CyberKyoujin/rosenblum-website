import { CustomerData } from "./customer";
import { FileData } from "./file";

export interface Message {
    id: number;
    formatted_timestamp: string;
    timestamp: string;
    files: FileData[];
    message: string;
    viewed: boolean;
    sender: number;
    receiver: number;
    sender_data: CustomerData;
    receiver_data: CustomerData;
    partner_data: CustomerData;
}

export interface MessagesResponseData {
    count: number;
    next: string;
    previous: string | null;
    results: Message[];
    new_count: number;
}

export interface MessagesFiltersParams {
    search? : string;
    viewed?: boolean | null;
    ordering?: string;
}



