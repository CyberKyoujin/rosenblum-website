 
export interface Order{
    id: number;
    name: string;
    formatted_timestamp: string;
    status: string;
    is_new: boolean;
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