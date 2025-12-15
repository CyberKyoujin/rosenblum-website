export interface Translation{
    id: number;
    name: string;
    initial_text: string;
    translated_text: string;
    formatted_timestamp: string;
}

export interface TranslationsResponseData {
    count: number;
    next: string;
    previous: string | null;
    results: Translation[];
}

export interface TranslationFiltersParams {
    search? : string;
    ordering?: string;
}