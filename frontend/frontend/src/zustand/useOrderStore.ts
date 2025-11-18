import { create } from 'zustand';
import axiosInstance from "./axiosInstance";
import type { OrderState } from '../types/orders';


const useOrderStore = create<OrderState>((set, get) => ({
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


export default useOrderStore