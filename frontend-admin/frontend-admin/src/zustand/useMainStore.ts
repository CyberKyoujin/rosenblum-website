import { create } from "zustand";
import axiosInstance from "./axiosInstance";

interface Order{
    id: number;
    name: string;
    formatted_timestamp: string;
    status: string;
    new: boolean;
}

interface UserData {
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
}

interface File{
    id: number;
    file: string;
    file_name: string;
    file_size: string;
}

interface Message{
    id: number;
    formatted_timestamp: string;
    files: File[];
    message: string;
    viewed: boolean;
    sender: number;
    receiver: number;
}

interface MainState {
    orders: Order[] | [];
    messages: Message[] | null;
    userData: UserData | null;
    isLoading: boolean;
    fetchOrders: () => Promise<void>;
    toggleOrder: (id: number) => Promise<void>;
    fetchUserData: (id: string) => Promise<void>;
    fetchUserMessages: (id: string) => Promise<void>;
    toggleMessages: (id: string) => Promise<void>;
    sendMessage: (formData: FormData, id: string) => Promise<void>;
    updateOrder: (id: string, status: string) => Promise<void>;
}

const useMainStore = create<MainState>((set, get) => ({
    orders: [],
    userData: null,
    messages: null,
    isLoading: false,

    fetchOrders: async () => {
        set({ isLoading: true }); 
        try {
            const response = await axiosInstance.get('/admin-user/orders/');
            set({ orders: response.data });
        } catch (err) {
            console.error("Error while fetching orders:" + err);
        } finally {
            set({ isLoading: false }); 
        }
    },

    toggleOrder: async (id: number) => {
        try{
            const response = await axiosInstance.get(`/admin-user/toggle-order/${id}`);

        } catch (error){
            console.log("Error toggling order!" + error);
        }
    },

    fetchUserData: async (id: string) => {
        try{
            const response = await axiosInstance.get(`/admin-user/user/${id}`);
            if (response.status === 200) {
                set({userData: response.data});
            }
        } catch (error) {
            console.log('Error while fetching user data:' + error);
        }
    },

    fetchUserMessages: async (id: string) => {
        try{
            const response = await axiosInstance.get(`/admin-user/user/${id}/messages`);
            if (response.status === 200){
                set({messages: response.data})
            }
        } catch (error) {
            console.log('Error while fetching user messages:' + error);
        }
    },

    toggleMessages: async (id: string) => {
        try{
            const response = await axiosInstance.get(`/admin-user/user/${id}/messages`);
        }catch (error) {
            console.log('Error while toggling user messages:' + error);
        }
    },

    sendMessage: async (formData: FormData, id: string) => {
        try{
            const response = await axiosInstance.post(`/admin-user/user/${id}/send-message`, formData);
        } catch (error) {
            console.log('Error while sending message: ' + error);
        }
    },

    updateOrder: async (id: string, status: string) => {
        try{
            const response = await axiosInstance.patch(`/admin-user/orders/${id}/update/`, {status: status});
            if (response.status === 200){
                console.log("Successfully updated order!");
            }
        } catch (error) {
            console.error(error);
        }
    }


}))



export default useMainStore;