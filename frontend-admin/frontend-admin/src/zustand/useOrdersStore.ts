import { create } from "zustand";
import { Order, OrderResponseData } from "../types/order";
import axiosInstance from "./axiosInstance";
import { ApiErrorResponse } from "../types/error";
import { toApiError } from "../utils/toApiError";
import { OrderFiltersParams } from "../types/order";
import { DocumentEdit } from "../hooks/useOrderDetails";

interface OrdersState {
    orders: OrderResponseData | null;
    order: Order | null;
    loading: boolean;
    error: ApiErrorResponse | null;
    filters: OrderFiltersParams;

    kostenvoranschlagOrders: OrderResponseData | null;
    kostenvoranschlagLoading: boolean;
    kostenvoranschlagError: ApiErrorResponse | null;
    kostenvoranschlagFilters: OrderFiltersParams;

    fetchOrders: (page_number: number) => Promise<void>;
    fetchOrder: (id: number) => Promise<void>;
    toggleOrder: (id: number) => Promise<void>;
    updateOrder: (id: number, status: string, order_type: string, payment_status: string, documents?: DocumentEdit[]) => Promise<void>;
    deleteOrder: (id: number) => Promise<void>;
    setFilters: (newFilters: OrderFiltersParams) => void;

    fetchKostenvoranschlagOrders: (page_number: number) => Promise<void>;
    setKostenvoranschlagFilters: (newFilters: OrderFiltersParams) => void;
}

const useOrdersStore = create<OrdersState>((set, get) => ({
    orders: null,
    order: null,
    loading: false,
    error: null,
    filters: { search: "", ordering: "-timestamp", order_type: "order" },

    kostenvoranschlagOrders: null,
    kostenvoranschlagLoading: false,
    kostenvoranschlagError: null,
    kostenvoranschlagFilters: { search: "", ordering: "-timestamp", order_type: "kostenvoranschlag" },

    setFilters: (newFilters) => {
        const updatedFilters = { ...get().filters, ...newFilters };
        set({ filters: updatedFilters });
        get().fetchOrders(1);
    },

    setKostenvoranschlagFilters: (newFilters) => {
        const updatedFilters = { ...get().kostenvoranschlagFilters, ...newFilters };
        set({ kostenvoranschlagFilters: updatedFilters });
        get().fetchKostenvoranschlagOrders(1);
    },

    fetchOrders: async (page_number = 1) => {
        set({ loading: true, error: null, orders: null });
        const { filters } = get();
        try {
            const response = await axiosInstance.get('/orders', {
                params: {
                    page: page_number,
                    search: filters.search,
                    ordering: filters.ordering,
                    status: filters.status,
                    is_new: filters.isNew,
                    order_type: filters.order_type,
                    payment_status: filters.payment_status,
                    payment_type: filters.payment_type,
                }
            });
            set({ orders: response.data as OrderResponseData });
        } catch (err: unknown) {
            set({ error: toApiError(err) });
        } finally {
            set({ loading: false });
        }
    },

    fetchKostenvoranschlagOrders: async (page_number = 1) => {
        set({ kostenvoranschlagLoading: true, kostenvoranschlagError: null, kostenvoranschlagOrders: null });
        const { kostenvoranschlagFilters: filters } = get();
        try {
            const response = await axiosInstance.get('/orders', {
                params: {
                    page: page_number,
                    search: filters.search,
                    ordering: filters.ordering,
                    status: filters.status,
                    is_new: filters.isNew,
                    order_type: filters.order_type,
                    payment_status: filters.payment_status,
                    payment_type: filters.payment_type,
                }
            });
            set({ kostenvoranschlagOrders: response.data as OrderResponseData });
        } catch (err: unknown) {
            set({ kostenvoranschlagError: toApiError(err) });
        } finally {
            set({ kostenvoranschlagLoading: false });
        }
    },

    fetchOrder: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get(`/orders/${id}/`);
            set({ order: response.data });
        } catch (err: unknown) {
            set({ error: toApiError(err) });
        } finally {
            set({ loading: false });
        }
    },

    toggleOrder: async (id) => {
        set({ loading: true, error: null });
        try {
            await axiosInstance.post(`/orders/${id}/toggle/`);
        } catch (err: unknown) {
            set({ error: toApiError(err) });
        }
    },

    updateOrder: async (id, status, order_type, payment_status, documents) => {
        set({ loading: true, error: null });
        try {
            await axiosInstance.patch(`/orders/${id}/`, { status, order_type, payment_status, documents });
        } catch (err: unknown) {
            set({ error: toApiError(err) });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    deleteOrder: async (id) => {
        set({ loading: true, error: null });
        try {
            await axiosInstance.delete(`/orders/${id}/`);
        } catch (err: unknown) {
            set({ error: toApiError(err) });
        } finally {
            set({ loading: false });
        }
    }
}));

export default useOrdersStore;
