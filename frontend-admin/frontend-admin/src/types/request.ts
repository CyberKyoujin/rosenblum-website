export interface RequestData {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    message: string;
    formatted_timestamp: string;
    is_new: boolean;
}

export interface RequestResponseData {
    count: number;
    next: string;
    previous: string | null;
    results: RequestData[];
    new_count: number;
}

export interface RequestFiltersParams {
    search? : string;
    ordering?: string;
    isNew?: boolean | null;
}

export interface RequestAnswer {
    answer_text: string;
    formatted_timestamp: string;
}