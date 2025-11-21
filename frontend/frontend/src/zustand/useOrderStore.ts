import { create } from 'zustand';
import axiosInstance from "../axios/axiosInstance";
import type { OrderState } from '../types/orders';
import { toApiError } from '../axios/toApiError';

const useOrderStore = create<OrderState>((set, get) => ({
    orders: null,
    ordersLoading: false,
    createOrderLoading: false,
    successfullyCreated: false,

    createOrder: async (formData: FormData) => {

        set({createOrderLoading: true, successfullyCreated: false});

        try{
        
            await axiosInstance.post('/order/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                }
            });

            set({successfullyCreated: true})

            await get().fetchOrders();

        } catch (err: any) {
            set({successfullyCreated: false});
            throw toApiError(err);
        } finally {
            set({createOrderLoading: false})
        }
        
    },

    fetchOrders: async () => {

        set({ ordersLoading: true });

        try{
            
            const response = await axiosInstance.get('/order/orders/');
            set({orders: response.data});
           
        } catch (err: unknown){
            throw toApiError(err);
        } finally {
            set({ordersLoading: false})
        }
    }
}))


export default useOrderStore