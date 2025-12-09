import { create } from "zustand";
import { OrderResponseData } from "../types/order";
import axiosInstance from "./axiosInstance";
import { ApiErrorResponse } from "../types/error";
import { toApiError } from "../utils/toApiError";
import { OrderFiltersParams } from "../types/order";

interface OrdersState {
    orders: OrderResponseData | null;
    fetchOrders: (page_number: number) => Promise<void>;
    toggleOrder: (id: number) => Promise<void>;
    updateOrder: (id: string, status: string) => Promise<void>;
    loading: boolean;
    error: ApiErrorResponse | null;
    filters: OrderFiltersParams;
    setFilters: (newFilters: OrderFiltersParams) => void;
}

const useOrdersStore = create<OrdersState>((set, get) => ({
    orders: null,
    loading: false,
    error: null,
    filters: {search: "", ordering: "-timestamp"},

    setFilters: (newFilters) => {
        const updatedFilters = {...get().filters, ...newFilters}
        set({filters: updatedFilters})
        get().fetchOrders(1);
    },

    fetchOrders: async (page_number=1) => {
        set({ loading: true, error: null }); 

        const { filters } = get();

        try {
            const response = await axiosInstance.get('/admin-user/orders/', 
                {params: {
                    page: page_number,
                    search: filters.search,
                    ordering: filters.ordering,
                    status: filters.status,
                    new: filters.new,
            }});
            set({ orders: response.data as OrderResponseData});
        } catch (err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ loading: false }); 
        }
    },

    toggleOrder: async (id: number) => {
        set({ loading: true, error: null });
        try{
            await axiosInstance.get(`/admin-user/toggle-order/${id}`);

        } catch (err: unknown){
            const error = toApiError(err);
            set({error: error});
        }
    },

    updateOrder: async (id: string, status: string) => {
        set({ loading: true, error: null });
        try{
            await axiosInstance.patch(`/admin-user/orders/${id}/update/`, {status: status});
        } catch (err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ loading: false }); 
        }
    },

}))

export default useOrdersStore;