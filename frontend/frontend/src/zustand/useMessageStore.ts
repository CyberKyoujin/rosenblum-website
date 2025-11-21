import axiosInstance from "../axios/axiosInstance";
import { create } from "zustand";
import { MessageState } from "../types/messages";
import { toApiError } from "../axios/toApiError";

const useMessageStore = create<MessageState>((set, get) => ({
    messages: null,
    messagesLoading: false,
    sendMessagesLoading: false,
    requestLoading: false,
    sendRequestSuccess: false,

    fetchUserMessages: async () => {

            set({messagesLoading: true});

            try{
                
                const response = await axiosInstance.get('/user/messages/')
                
                set({messages: response.data})
                
            } catch(err: unknown) {
                
                throw toApiError(err);
            } finally {
                set({messagesLoading: false});
            }
    },

    toggleMessages: async () => {
                try{
    
                    await axiosInstance.get('/user/toggle-messages');

                } catch(err: unknown){

                    throw toApiError(err);
                } 
    },
    
    sendMessage: async(formData: FormData) => {

                set({sendMessagesLoading: true});

                try{
                    
                    await axiosInstance.post('/user/send-message/', formData)
                    
                } catch (err: unknown){

                    throw toApiError(err);

                } finally {
                    set({sendMessagesLoading: false});
                }
    },
    
    sendRequest: async(name: string, email: string, phone_number: string, message: string) => {

                set({requestLoading: true, sendRequestSuccess: false});

                try{
                    
                    await axiosInstance.post('/user/new-request/', {name, email, phone_number, message});
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