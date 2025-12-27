import axiosInstance from "../axios/axiosInstance";
import { create } from "zustand";
import { MessageState } from "../types/messages";
import { toApiError } from "../axios/toApiError";
import { ApiErrorResponse } from "../types/error";

const useMessageStore = create<MessageState>((set) => ({
    messages: null,
    messagesLoading: false,
    sendMessagesLoading: false,
    fetchMessagesError: null,
    requestLoading: false,
    sendRequestSuccess: false,

    fetchUserMessages: async () => {

            set({messagesLoading: true, fetchMessagesError: null});

            try{
                
                const response = await axiosInstance.get('/messages/')

                const messagesData = response.data.results !== undefined 
                ? response.data.results 
                : response.data;
                
                set({messages: messagesData})
                
            } catch(err: unknown) {

                const error = err as ApiErrorResponse;

                set({fetchMessagesError: error})
                
                throw error;
                
            } finally {
                set({messagesLoading: false});
            }
    },

    toggleMessages: async (sender_id) => {
                try{
    
                    await axiosInstance.post('/messages/toggle/', {sender_id});

                } catch(err: unknown){

                    throw toApiError(err);
                } 
    },
    
    sendMessage: async(formData: FormData) => {

                set({sendMessagesLoading: true});

                try{

                    formData.append("id", "46");
                    
                    await axiosInstance.post('/messages/', formData)
                    
                } catch (err: unknown){

                    throw toApiError(err);

                } finally {
                    set({sendMessagesLoading: false});
                }
    },
    
    sendRequest: async(name: string, email: string, phone_number: string, message: string) => {

                set({requestLoading: true, sendRequestSuccess: false});

                try{
                    
                    await axiosInstance.post('/requests/', {name, email, phone_number, message});
                    set({sendRequestSuccess: true});

                } catch (err: unknown) {

                   set({sendRequestSuccess: false});
                   throw toApiError(err);

                } finally {
                   set({requestLoading: false}); 
                }
            
    }

}))

export default useMessageStore;