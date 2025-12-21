
export interface Customer{
    email: string;
    id: number;
    first_name: string;
    last_name: string;
    profile_img_url: string;
    profile_img: string;
    orders: string;
}

export interface CustomerData {
    id: number;
    date_joined: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    city: string;
    street: string;
    zip: string;
    profile_img: string;
    profile_img_url: string;
    image_url: string;
}

export interface CustomerResponseData {
    count: number;
    next: string;
    previous: string | null;
    results: Customer[];
    new_count: number;
}

export interface CustomerFiltersParams {
    search? : string;
    ordering?: string;
}