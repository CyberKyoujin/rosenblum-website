export interface RequestData {
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

export interface RequestFiltersParams {
    search? : string;
    ordering?: string;
}

export interface RequestAnswer {
    answer_text: string;
    formatted_timestamp: string;
}