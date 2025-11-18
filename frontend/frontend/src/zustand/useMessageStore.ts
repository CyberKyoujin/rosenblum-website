import axiosInstance from "./axiosInstance";
import type { Message } from "../types/messages";
import { create } from "zustand";


interface MessageState {
    messages: Message[] | null;
    loading: boolean;
    fetchUserMessages: () => Promise<void>;
    toggleMessages: () => Promise<void>;
    sendMessage: (formData: FormData) => Promise<void>;
    sendRequest: (name: string, email: string, phone_number: string, message: string) => Promise<void>;
}

const useMessageStore = create<MessageState>((set, get) => ({
    messages: null,
    loading: false,

    fetchUserMessages: async () => {
            try{
                set({loading: true});
                const response = await axiosInstance.get('/user/messages/')
                if (response.status === 200){
                    set({messages: response.data})
                }
            } catch(error: any) {
                console.log('Error while fetching messages...' + error.message)
            } finally {
                set({loading: false});
            }
    },

    toggleMessages: async () => {
                try{
                    const response = await axiosInstance.get('/user/toggle-messages')
                    if (response.status === 200){
                        console.log('Successfully toggled messages!')
                    }
                } catch(error){
                    console.error(error);
                } 
    },
    
    sendMessage: async(formData: FormData) => {
                try{
                    set({loading: true});
                    const response = await axiosInstance.post('/user/send-message/', formData)
                    if (response.status === 200){
                        console.log('Successfully sent a message!')
                    }
                } catch (error){
                    console.error(error);
                } finally {
                    set({loading: false});
                }
    },
    
    sendRequest: async(name: string, email: string, phone_number: string, message: string) => {
                try{
                    set({loading: true});
                    const response = await axiosInstance.post('/user/new-request/', {name, email, phone_number, message});
    
                } catch (error) {
                    console.error(error);
                } finally {
                   set({loading: false}); 
                }
            
    }

}))

export default useMessageStore;