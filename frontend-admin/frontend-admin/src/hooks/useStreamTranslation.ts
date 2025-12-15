import { useCallback, useRef, useState } from "react";
import { ApiErrorResponse } from "../types/error";
import useAuthStore from "../zustand/useAuthStore";
import { toApiError } from "../utils/toApiError";

const API_URL = "http://localhost:8000"


export const useStreamTranslation = () => {

    const [streamedText, setStreamedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ApiErrorResponse | null>(null);

    const accumulatedTextRef = useRef('');

    const accessToken = useAuthStore((s) => s.authTokens?.access);

    const translate = useCallback(async (text: string, lanTo: string) => {

        setIsLoading(true);
        setError(null);
        setStreamedText('');
        accumulatedTextRef.current = '';

        try {

            const response = await fetch(`${API_URL}/admin-user/translate/`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, 
                },
                body: JSON.stringify({ text, lan_to: lanTo }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw { response: { data: errorData, status: response.status } };
            }

            if (!response.body) return;

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedTextRef.current += chunk;
                
                setStreamedText(accumulatedTextRef.current);
            }

        } catch(err: unknown) {

            console.error(err);
            setError(toApiError(err));

        } finally {

            setIsLoading(false);

        }

    }, [])

    const reset = () => {
        setStreamedText('');
        accumulatedTextRef.current = '';
        setError(null);
    };

    return { 
    translate, 
    streamedText, 
    isLoading, 
    error,
    reset 
    };

}