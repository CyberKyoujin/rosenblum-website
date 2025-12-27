import { create } from "zustand";
import { Order, OrderResponseData } from "../types/order";
import axiosInstance from "./axiosInstance";
import { ApiErrorResponse } from "../types/error";
import { toApiError } from "../utils/toApiError";
import { OrderFiltersParams } from "../types/order";

interface OrdersState {
    orders: OrderResponseData | null;
    order: Order | null;
    fetchOrders: (page_number: number) => Promise<void>;
    fetchOrder: (id: number) => Promise<void>;
    toggleOrder: (id: number) => Promise<void>;
    updateOrder: (id: number, status: string, order_type: string) => Promise<void>;
    deleteOrder: (id: number) => Promise<void>;
    loading: boolean;
    error: ApiErrorResponse | null;
    filters: OrderFiltersParams;
    setFilters: (newFilters: OrderFiltersParams) => void;
}

const useOrdersStore = create<OrdersState>((set, get) => ({
    orders: null,
    order: null,
    loading: false,
    error: null,
    filters: {search: "", ordering: "-timestamp"},

    setFilters: (newFilters) => {
        const updatedFilters = {...get().filters, ...newFilters}
        set({filters: updatedFilters})
        get().fetchOrders(1);
    },

    fetchOrders: async (page_number=1) => {
        set({ loading: true, error: null, orders: null }); 

        const { filters } = get();

        try {
            const response = await axiosInstance.get('/order/orders', 
                {params: {
                    page: page_number,
                    search: filters.search,
                    ordering: filters.ordering,
                    status: filters.status,
                    is_new: filters.isNew,
            }});
            set({ orders: response.data as OrderResponseData});
        } catch (err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ loading: false }); 
        }
    },

    fetchOrder: async (id) => {

        set({ loading: true, error: null });

        try {

            const response = await axiosInstance.get(`/order/orders/${id}/`);
            set({order: response.data})
            
        } catch (err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ loading: false }); 
        }

    },

    toggleOrder: async (id) => {
        set({ loading: true, error: null });
        try{
            await axiosInstance.post(`/order/orders/${id}/toggle/`);

        } catch (err: unknown){
            const error = toApiError(err);
            set({error: error});
        }
    },

    updateOrder: async (id, status, order_type) => {
        set({ loading: true, error: null });
        try{
            await axiosInstance.patch(`/order/orders/${id}/`, {status: status, order_type: order_type});
        } catch (err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ loading: false }); 
        }
    },

    deleteOrder: async (id) => {
        set({ loading: true, error: null });

        try{

            await axiosInstance.delete(`/order/orders/${id}/`);

        } catch(err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ loading: false }); 
        }
    }

}))

export default useOrdersStore;