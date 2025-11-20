import { create } from 'zustand';
import axiosInstance from "../axios/axiosInstance";
import type { OrderState } from '../types/orders';
import { ApiError } from '../types/auth';


const useOrderStore = create<OrderState>((set, get) => ({
    orders: null,
    ordersLoading: false,
    createOrderLoading: false,
    successfullyCreated: false,
    fetchOrdersError: null,
    createOrderError: null,
    loading: true,

    createOrder: async (formData: FormData) => {
        set({createOrderLoading: true, createOrderError: null});
        try{
        
            const response = await axiosInstance.post('/order/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                }
            });

            await get().fetchOrders();

        } catch (err: any) {
            const error = err as ApiError;
            set({createOrderError: err});
            throw error;
        } finally {
            set({createOrderLoading: false})
        }
        
    },

    fetchOrders: async () => {
        try{
            set({ordersLoading: true, fetchOrdersError: null})
            const response = await axiosInstance.get('/order/orders/');
            set({orders: response.data});
           
        } catch (err: any){
            const error = err as ApiError;
            set({createOrderError: err});
            throw error;
        } finally {
            set({ordersLoading: false})
        }
    }
}))


export default useOrderStore