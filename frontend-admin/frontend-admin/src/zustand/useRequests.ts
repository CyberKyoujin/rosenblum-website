import { RequestFiltersParams, RequestResponseData } from "../types/request";
import { create } from "zustand";
import { toApiError } from "../utils/toApiError";
import { ApiErrorResponse } from "../types/error";
import axiosInstance from "./axiosInstance";


interface RequestsState {
    requests: RequestResponseData | null;
    fetchRequests: (page_number: number) => Promise<void>;
    loading: boolean;
    error: ApiErrorResponse | null;
    filters: RequestFiltersParams;
    setFilters: (newFilters: RequestFiltersParams) => void;
}

const useRequestsStore = create<RequestsState>((set, get) => ({
    requests : null,
    loading: false,
    error: null,
    filters: {search: "", ordering: "-timestamp"},

    setFilters: (newFilters) => {
        const updatedFilters = {...get().filters, ...newFilters}
        set({filters: updatedFilters})
        get().fetchRequests(1)
    },

    fetchRequests: async (page_number: number) => {
        set({ loading: true, error: null }); 

        const { filters } = get();

        try {
            const response = await axiosInstance.get('/admin-user/requests/',  
                {params: {
                    page: page_number,
                    search: filters.search,
                    ordering: filters.ordering
                }});
            set({ requests: response.data as RequestResponseData});
        } catch (err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ loading: false }); 
        }
    }

}))

export default useRequestsStore