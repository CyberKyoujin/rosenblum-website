import { create } from 'zustand';
import axiosInstance from "./axiosInstance";
import type { OrderState } from '../types/orders';


const useOrderStore = create<OrderState>((set, get) => ({
    orders: null,
    ordersLoading: false,
    createOrderLoading: false,
    successfullyCreated: false,
    loading: true,

    setOrders: (orders) => set({orders}),

    createOrder: async (formData: FormData) => {
        set({createOrderLoading: true});
        try{
        
            const response = await axiosInstance.post('/order/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                }
            });

        } catch (error) {
            console.log("Error creating order", error)
        } finally {
            set({createOrderLoading: false})
        }
        
    },

    fetchOrders: async () => {
        try{
            set({ordersLoading: true})
            const response = await axiosInstance.get('/order/orders/', {
    
            });
            if(response.status === 200){
                get().setOrders(response.data)
            }
        } catch (error){
            console.log(error);
        } finally {
            set({ordersLoading: false})
        }
    }
}))


export default useOrderStore