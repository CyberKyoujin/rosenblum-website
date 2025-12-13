import { create } from "zustand";
import { toApiError } from "../utils/toApiError";
import { ApiErrorResponse } from "../types/error";
import axiosInstance from "./axiosInstance";
import { Message, MessagesFiltersParams, MessagesResponseData } from "../types/message";


interface MessagesState {
    messages: MessagesResponseData | null;
    userMessages: Message[] | null;
    fetchMessages : (page_number: number) => Promise<void>;
    fetchUserMessages: (id: number) => Promise<void>;
    sendMessage: (formData: FormData, id: number) => Promise<void>;
    messagesLoading: boolean;
    sendMessagesLoading: boolean;
    fetchMessagesError: ApiErrorResponse | null;
    filters: MessagesFiltersParams;
    setFilters: (newFilters: MessagesFiltersParams) => void;
    toggleMessages: (sender_id: number) => Promise<void>;
}

const useMessages = create<MessagesState>((set, get) => ({
    messages: null,
    userMessages: null,
    messagesLoading: false,
    fetchMessagesError: null,
    sendMessagesLoading: false,
    filters: {search: "", ordering: "-timestamp"},

    setFilters: (newFilters) => {
        const updatedFilters  = { ...get().filters, ...newFilters}
        set({filters: updatedFilters})
        get().fetchMessages(1);
    },

    fetchMessages: async (page_number) => {
        set({ messagesLoading: true, fetchMessagesError: null, messages: null }); 

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

            console.log(response.data);
        } catch (err: unknown) {
            const error = toApiError(err);
            set({fetchMessagesError: error});
        } finally {
            set({ messagesLoading: false }); 
        }
    },

     fetchUserMessages: async (id) => {

        set({ sendMessagesLoading: true, fetchMessagesError: null }); 

        try{
            const response = await axiosInstance.get(`/admin-user/user/${id}/messages`);
            
            set({userMessages: response.data})
            
        } catch (err: unknown) {
            const error = toApiError(err);
            set({fetchMessagesError: error});
        } finally {
            set({sendMessagesLoading: false});
        }
    },

    sendMessage: async (formData, id) => {
        set({ sendMessagesLoading: true, fetchMessagesError: null }); 
        try{
            formData.append('id', id.toString());
            await axiosInstance.post(`/admin-user/user/send-message/`, formData);
        } catch (err: unknown) {
            const error = toApiError(err);
            set({fetchMessagesError: error});
        } finally {
            set({sendMessagesLoading: false});
        }
    },

    toggleMessages: async (sender_id) => {
         try{
            await axiosInstance.post(`/admin-user/user/toggle-messages/`, {sender_id});
        }catch (error) {
            console.log('Error while toggling user messages:' + error);
        }
    }

}))

export default useMessages