import axiosInstance from "./axiosInstance";
import type { Message } from "../types/messages";
import { create } from "zustand";


interface MessageState {
    messages: Message[] | null;
    messagesLoading: boolean;
    sendMessagesLoading: boolean;
    error: string | null | unknown;
    requestLoading: boolean;
    requestError: string | null | unknown;
    fetchUserMessages: () => Promise<void>;
    toggleMessages: () => Promise<void>;
    sendMessage: (formData: FormData) => Promise<void>;
    sendRequest: (name: string, email: string, phone_number: string, message: string) => Promise<void>;
}

const useMessageStore = create<MessageState>((set, get) => ({
    messages: null,
    messagesLoading: false,
    sendMessagesLoading: false,
    error: null,
    requestLoading: false,
    requestError: null,

    fetchUserMessages: async () => {
            try{
                set({messagesLoading: true});
                const response = await axiosInstance.get('/user/messages/')
                if (response.status === 200){
                    set({messages: response.data})
                }
            } catch(err: any) {
                set({error: err})
            } finally {
                set({messagesLoading: false});
            }
    },

    toggleMessages: async () => {
                try{
                    const response = await axiosInstance.get('/user/toggle-messages')
                } catch(err){
                    set({error: err});
                } 
    },
    
    sendMessage: async(formData: FormData) => {
                try{
                    set({sendMessagesLoading: true});
                    const response = await axiosInstance.post('/user/send-message/', formData)
                    
                } catch (err){
                    set({error: err})
                } finally {
                    set({sendMessagesLoading: false});
                }
    },
    
    sendRequest: async(name: string, email: string, phone_number: string, message: string) => {
                try{
                    set({requestLoading: true});
                    const response = await axiosInstance.post('/user/new-request/', {name, email, phone_number, message});
    
                } catch (err) {
                   set({requestError: err})
                } finally {
                   set({requestLoading: false}); 
                }
            
    }

}))

export default useMessageStore;