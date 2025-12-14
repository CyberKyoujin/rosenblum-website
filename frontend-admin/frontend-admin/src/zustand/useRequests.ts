import { RequestAnswer, RequestData, RequestFiltersParams, RequestResponseData } from "../types/request";
import { create } from "zustand";
import { toApiError } from "../utils/toApiError";
import { ApiErrorResponse } from "../types/error";
import axiosInstance from "./axiosInstance";

interface RequestsState {
    requests: RequestResponseData | null;
    request: RequestData | null;
    requestAnswers: RequestAnswer[] | null;
    fetchRequests: (page_number: number) => Promise<void>;
    fetchRequestData: (id: number) => Promise<void>;
    fetchRequestAnswers: (id: number) => Promise<void>;
    sendRequestAnswer: (formData: FormData) => Promise<void>;
    loading: boolean;
    sendAnswerLoading: boolean;
    sendAnswerSuccess: boolean;
    error: ApiErrorResponse | null;
    filters: RequestFiltersParams;
    setFilters: (newFilters: RequestFiltersParams) => void;
}

const useRequestsStore = create<RequestsState>((set, get) => ({
    requests : null,
    request: null,
    requestAnswers: null,
    loading: false,
    sendAnswerLoading: false,
    sendAnswerSuccess: false,
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
    },

    fetchRequestData: async (id) => {

        set({ loading: true, error: null, sendAnswerSuccess: false }); 

        try {
            
            const response = await axiosInstance.get(`/admin-user/user/request/${id}`);
            set({ request: response.data });
        } catch (err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ loading: false }); 
        }

    },

    fetchRequestAnswers:  async(id) => {
        set({ loading: true, error: null });
        try {
            
            const response = await axiosInstance.get(`/admin-user/request-answer/${id}`);
            set({requestAnswers: response.data});

        } catch (err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ loading: false }); 
        }
    },

    sendRequestAnswer: async(formData) => {
        set({ sendAnswerLoading: true, error: null, sendAnswerSuccess: false });
        try {
            
            await axiosInstance.post('/admin-user/answer-request/', formData);
            set({sendAnswerSuccess: true});
        } catch (err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ sendAnswerLoading: false }); 
        }
    }

}))

export default useRequestsStore