
export interface Customer{
    email: string;
    id: number;
    first_name: string;
    last_name: string;
    profile_img_url: string;
    profile_img: string;
    orders: string;
}

export interface CustomerResponseData {
    count: number;
    next: string;
    previous: string | null;
    results: Customer[];
}

export interface CustomerFiltersParams {
    search? : string;
    ordering?: string;
}