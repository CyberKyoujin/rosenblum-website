import { create } from "zustand";
import { toApiError } from "../utils/toApiError";
import { ApiErrorResponse } from "../types/error";
import axiosInstance from "./axiosInstance";
import { MessagesFiltersParams, MessagesResponseData } from "../types/message";


interface MessagesState {
    messages: MessagesResponseData | null;
    fetchMessages : (page_number: number) => Promise<void>;
    loading: boolean;
    error: ApiErrorResponse | null;
    filters: MessagesFiltersParams;
    setFilters: (newFilters: MessagesFiltersParams) => void;
}

const useMessages = create<MessagesState>((set, get) => ({
    messages: null,
    loading: false,
    error: null,
    filters: {search: "", ordering: "-timestamp"},

    setFilters: (newFilters) => {
        const updatedFilters  = { ...get().filters, ...newFilters}
        set({filters: updatedFilters})
        get().fetchMessages(1);
        console.log(get().messages)
    },

    fetchMessages: async (page_number) => {
        set({ loading: true, error: null }); 

        const { filters } = get();

        try {
            const response = await axiosInstance.get('/admin-user/messages/',  
                {params: {
                    page: page_number,
                    search: filters.search,
                    viewed: filters.viewed,
                    ordering: filters.ordering
                }});
            set({ messages: response.data as MessagesResponseData});
        } catch (err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ loading: false }); 
        }
    }

}))

export default useMessages