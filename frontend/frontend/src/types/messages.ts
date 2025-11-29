import { ApiErrorResponse } from "./error";

export interface MessageState {
    messages: Message[] | null;
    messagesLoading: boolean;
    sendMessagesLoading: boolean;

    fetchMessagesError : ApiErrorResponse | null;

    fetchUserMessages: () => Promise<void>;
    toggleMessages: () => Promise<void>;
    sendMessage: (formData: FormData) => Promise<void>;

    sendRequest: (name: string, email: string, phone_number: string, message: string) => Promise<void>;
    sendRequestSuccess: boolean;
    requestLoading: boolean;
}


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