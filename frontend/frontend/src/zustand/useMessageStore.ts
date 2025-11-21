import axiosInstance from "../axios/axiosInstance";
import type { Message } from "../types/messages";
import { create } from "zustand";
import { ApiError } from "../types/auth";
import { toApiError } from "../axios/toApiError";


interface MessageState {
    messages: Message[] | null;
    messagesLoading: boolean;
    sendMessagesLoading: boolean;
    fetchMessagesError: ApiError | null;
    sendMessagesError: ApiError | null;
    toggleMessagesError: ApiError | null;

    fetchUserMessages: () => Promise<void>;
    toggleMessages: () => Promise<void>;
    sendMessage: (formData: FormData) => Promise<void>;

    sendRequest: (name: string, email: string, phone_number: string, message: string) => Promise<void>;
    sendRequestSuccess: boolean;
    requestLoading: boolean;
    requestError: string | null | unknown;
}

const useMessageStore = create<MessageState>((set, get) => ({
    messages: null,
    messagesLoading: false,
    sendMessagesLoading: false,
    fetchMessagesError: null, 
    sendMessagesError: null,
    toggleMessagesError: null,
    requestLoading: false,
    sendRequestSuccess: false,
    requestError: null,

    fetchUserMessages: async () => {
            try{
                set({messagesLoading: true, fetchMessagesError: null});
                const response = await axiosInstance.get('/user/messages/')
                
                set({messages: response.data})
                
            } catch(err: unknown) {
                const error = toApiError(err);
                if (!error) return;

                set({fetchMessagesError: error});
                throw error;
            } finally {
                set({messagesLoading: false});
            }
    },

    toggleMessages: async () => {
                try{
                    set({toggleMessagesError: null});
                    const response = await axiosInstance.get('/user/toggle-messages')
                } catch(err: unknown){

                    const error = toApiError(err);
                    if (!error) return;

                    set({toggleMessagesError: error});
                    throw error;
                } 
    },
    
    sendMessage: async(formData: FormData) => {
                try{
                    set({sendMessagesLoading: true, sendMessagesError: null});
                    const response = await axiosInstance.post('/user/send-message/', formData)
                    
                } catch (err: unknown){

                    const error = toApiError(err);
                    if (!error) return;

                    set({sendMessagesError: error});
                    throw error;
                } finally {
                    set({sendMessagesLoading: false});
                }
    },
    
    sendRequest: async(name: string, email: string, phone_number: string, message: string) => {
                try{
                    set({requestLoading: true, requestError: null, sendRequestSuccess: false});
                    const response = await axiosInstance.post('/user/new-request/', {name, email, phone_number, message});
                    set({sendRequestSuccess: true})
                } catch (err: unknown) {

                   const error = toApiError(err);
                   if (!error) return;

                   set({requestError: error, sendRequestSuccess: false})
                   throw error;
                } finally {
                   set({requestLoading: false}); 
                }
            
    }

}))

export default useMessageStore;