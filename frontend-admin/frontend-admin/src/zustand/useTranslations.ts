import { create } from "zustand";
import { ApiErrorResponse } from "../types/error";
import { Translation, TranslationFiltersParams, TranslationsResponseData } from "../types/translation";
import axiosInstance from "./axiosInstance";
import { toApiError } from "../utils/toApiError";


interface TranslationsState {
    translations: TranslationsResponseData | null;
    translation: Translation | null;
    fetchTranslations: (page_number: number) => Promise<void>;
    fetchTranslation: (id: number) => Promise<void>;
    deleteTranslation: (id: number) => Promise<void>;
    loading: boolean;
    error: ApiErrorResponse | null;
    filters: TranslationFiltersParams;
    saveTranslationSuccess: boolean;
    deleteTranslationSuccess: boolean;
    setFilters: (newFilters: TranslationFiltersParams) => void;
    saveTranslation: (formData: FormData) => Promise<void>;
    resetStatus: () => void;
}

const useTranslations = create<TranslationsState>((set, get) => ({
    translations : null,
    translation: null,
    loading: false,
    error: null,
    saveTranslationSuccess: false,
    deleteTranslationSuccess: false,
    filters: {search: "", ordering: "-timestamp"},

    setFilters: (newFilters) => {
        const updatedFilters = {...get().filters, ...newFilters}
        set({filters: updatedFilters})
        get().fetchTranslations(1)
    },

    resetStatus: () => {
        set({ 
            saveTranslationSuccess: false, 
            deleteTranslationSuccess: false, 
            error: null,
            loading: false 
        });
    },

    fetchTranslations: async (page_number: number) => {
        set({ loading: true, error: null, }); 

        const { filters } = get();

        try {
            const response = await axiosInstance.get('admin-user/translations/',  
                {params: {
                    page: page_number,
                    search: filters.search,
                    ordering: filters.ordering
                }});
            set({ translations: response.data as TranslationsResponseData});
        } catch (err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ loading: false }); 
        }
    },

    fetchTranslation: async (id) => {
        set({ loading: true, error: null }); 

        try {
            const response = await axiosInstance.get(`/admin-user/translations/${id}/`);
            set({translation: response.data});
        } catch (err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ loading: false }); 
        }
    },

    saveTranslation: async (formData) => {
        set({ loading: true, error: null, saveTranslationSuccess: false }); 

        try {
            await axiosInstance.post('/admin-user/translations/', formData);
            set({saveTranslationSuccess: true});
        } catch (err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ loading: false }); 
        }
    },
    
    deleteTranslation: async (id) => {
    
        set({ loading: true, error: null, deleteTranslationSuccess: false }); 

        try {
            await axiosInstance.delete(`/admin-user/translations/delete/${id}/`);
            set({deleteTranslationSuccess: true});
        } catch (err: unknown) {
            const error = toApiError(err);
            set({error: error});
        } finally {
            set({ loading: false }); 
        }
    }

}))

export default useTranslations