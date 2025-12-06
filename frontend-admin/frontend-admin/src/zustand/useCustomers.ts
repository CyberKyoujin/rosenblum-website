import { CustomerFiltersParams, CustomerResponseData } from "../types/customer";
import { ApiErrorResponse } from "../types/error";
import { create } from "zustand";
import axiosInstance from "./axiosInstance";
import { toApiError } from "../utils/toApiError";


interface CustomersState {
    customers: CustomerResponseData | null;
    fetchCustomers: (page_number: number) => Promise<void>;
    loading: boolean;
    error: ApiErrorResponse | null;
    filters: CustomerFiltersParams;
    setFilters: (newFilters: CustomerFiltersParams) => void;
}

const useCustomersStore = create<CustomersState>((set, get) => ({
    customers: null,
    loading: false,
    error: null,
    filters: {search: "", ordering: "-date_joined"},

    setFilters: (newFilters) => {
        const updatedFilters = {...get().filters, ...newFilters}
        set({filters: updatedFilters})
        console.log(get().filters)
        get().fetchCustomers(1);
    },

    fetchCustomers: async (page_number=1) => {
        set({ loading: true, error: null }); 

        const { filters } = get();

        try {
            const response = await axiosInstance.get('/admin-user/customers/', 
                {params: {
                    page: page_number,
                    search: filters.search,
                    ordering: filters.ordering,
            }});
            set({ customers: response.data as CustomerResponseData});
        } catch (err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ loading: false }); 
        }
    },
}))

export default useCustomersStore