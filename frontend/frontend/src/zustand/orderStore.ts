import axios from "axios";
import { json } from "react-router-dom";
import { create } from 'zustand';


interface OrderState {
    orders: string[] | null;
    setOrders: (orders: []) => void;
    createOrder: (formData: FormData) => Promise<void>;
    fetchOrders: () => Promise<void>;

}


const orderStore = create<OrderState>((set, get) => ({
    orders: null,

    setOrders: (orders) => set({orders}),

    createOrder: async (formData: FormData) => {
        try{
            const authTokens = JSON.parse(localStorage.getItem('authTokens') || '');
            const response = await axios.post('http://127.0.0.1:8000/order/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${authTokens.access}`, 
                }
            });
            console.log("Successfully created order", response.data)

        } catch (error) {
            console.log("Error creating order", error)
        }
        
    },
    fetchOrders: async () => {

    }
}))


export default orderStore