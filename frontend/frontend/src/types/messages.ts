export interface Message {
    id: string;
    sender: string;
    receiver: string;
    message: string;
    viewed: boolean;
    timestamp: string;
    formatted_timestamp: string;
    files: File[];
}