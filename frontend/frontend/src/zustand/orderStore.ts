import axios from "axios";
import { json } from "react-router-dom";
import { create } from 'zustand';


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
            const authTokens = JSON.parse(localStorage.getItem('authTokens') || '');
            const response = await axios.post('http://127.0.0.1:8000/order/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${authTokens.access}`, 
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
            const authTokens = JSON.parse(localStorage.getItem('authTokens') || '');
            const response = await axios.get('http://127.0.0.1:8000/order/orders/', {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`
                }
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