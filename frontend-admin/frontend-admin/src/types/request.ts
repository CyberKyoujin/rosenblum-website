export interface Request {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    message: string;
    formatted_timestamp: string
}

export interface RequestResponseData {
    count: number;
    next: string;
    previous: string | null;
    results: Request[];
}