 
export interface Order{
    id: number;
    name: string;
    formatted_timestamp: string;
    status: string;
    new: boolean;
}

export interface OrderResponseData {
    count: number;
    next: string;
    previous: string | null;
    results: Order[];
}