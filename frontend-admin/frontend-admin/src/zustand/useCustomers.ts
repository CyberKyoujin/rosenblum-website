import { CustomerFiltersParams, CustomerResponseData } from "../types/customer";
import { ApiErrorResponse } from "../types/error";
import { create } from "zustand";
import axiosInstance from "./axiosInstance";
import { toApiError } from "../utils/toApiError";
import { Order } from "../types/order";
import { CustomerData } from "../types/customer";

interface CustomersState {
    customers: CustomerResponseData | null;
    customerOrders: Order[] | null;
    customerData: CustomerData | null;
    fetchCustomers: (page_number: number) => Promise<void>;
    fetchCustomerOrders: (id: number) => Promise<void>;
    fetchCustomerData: (id: number) => Promise<void>;
    loading: boolean;
    error: ApiErrorResponse | null;
    filters: CustomerFiltersParams;
    setFilters: (newFilters: CustomerFiltersParams) => void;
}

const useCustomersStore = create<CustomersState>((set, get) => ({
    customers: null,
    customerOrders: null,
    customerData: null,
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

    fetchCustomerData: async (id) => {
        set({ loading: true, error: null }); 
         try{
            const response = await axiosInstance.get(`/admin-user/user/${id}`);
            set({customerData: response.data});
            
        } catch (err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ loading: false });
        }

    },

    fetchCustomerOrders: async(id) => {

        set({ loading: true, error: null }); 

         try{
                const response = await axiosInstance.get(`/admin-user/user/${id}/orders`);
                set ({customerOrders: response.data});
            } catch (err) {
                const error = toApiError(err);
            set({error: error});
            } finally {
            set({ loading: false }); 
        }


    }
}))

export default useCustomersStore