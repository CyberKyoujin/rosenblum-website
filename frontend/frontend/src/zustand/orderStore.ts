import axios from "axios";
import { json } from "react-router-dom";
import { create } from 'zustand';
import axiosInstance from "./axiosInstance";

interface Order {
    id: string | null;
    files: [] | null;
    city: string | null;
    date: string | null;
    message: string | null;
    name: string | null;
    phone_number: string | null;
    status: string | null;
    zip: string | null;
}

interface OrderState {
    orders: Order[] | null;
    successfullyCreated: boolean;
    loading: boolean;
    setOrders: (orders: []) => void;
    createOrder: (formData: FormData) => Promise<void>;
    fetchOrders: () => Promise<void>;
}

const orderStore = create<OrderState>((set, get) => ({
    orders: null,
    successfullyCreated: false,
    loading: true,

    setOrders: (orders) => set({orders}),

    createOrder: async (formData: FormData) => {
        set({loading: true});
        try{
        
            const response = await axiosInstance.post('/order/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                }
            });
            if (response.status === 200){
                set({successfullyCreated: true})
            }

        } catch (error) {
            console.log("Error creating order", error)
        } finally {
            set({loading: false})
        }
        
    },

    fetchOrders: async () => {
        try{
            const response = await axiosInstance.get('/order/orders/', {
    
            });
            if(response.status === 200){
                get().setOrders(response.data)
            }
        } catch (error){
            console.log(error);
        }
    }
}))


export default orderStore