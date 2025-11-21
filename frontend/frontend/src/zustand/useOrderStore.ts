import { create } from 'zustand';
import axiosInstance from "../axios/axiosInstance";
import type { OrderState } from '../types/orders';
import { toApiError } from '../axios/toApiError';

const useOrderStore = create<OrderState>((set, get) => ({
    orders: null,
    ordersLoading: false,
    createOrderLoading: false,
    successfullyCreated: false,
    fetchOrdersError: null,
    createOrderError: null,
    loading: true,

    createOrder: async (formData: FormData) => {
        try{

            set({createOrderLoading: true, createOrderError: null, successfullyCreated: false});
        
            const response = await axiosInstance.post('/order/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                }
            });

            set({successfullyCreated: true})

            await get().fetchOrders();

        } catch (err: any) {
            const error = toApiError(err);
            if (!error) return;
            set({createOrderError: error, successfullyCreated: false});
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
            const error = toApiError(err);
            if (!error) return;

            set({createOrderError: err});
            throw error;
        } finally {
            set({ordersLoading: false})
        }
    }
}))


export default useOrderStore