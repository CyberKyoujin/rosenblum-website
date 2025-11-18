export interface User {
    id: string | null;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    profile_img_url: string;
} 

export interface UserData {
    date_joined: string | null;
    phone_number: string | null;
    city: string | null;
    street: string | null;
    zip: string | null;
    image_url: string | null;
}