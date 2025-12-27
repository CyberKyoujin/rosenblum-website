import { useCallback, useEffect, useRef, useState } from "react";
import { ApiErrorResponse } from "../types/error";
import useAuthStore from "../zustand/useAuthStore";
import { toApiError } from "../utils/toApiError";

const API_URL = "http://localhost:8000"

export const useStreamTranslation = () => {

  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<ApiErrorResponse | null>(null);

  const fullTextRef = useRef('');

  const indexRef = useRef(0);
  
  const accessToken = useAuthStore((state) => state.authTokens?.access);

  useEffect(() => {
    let intervalId: any;

    if (isStreaming || indexRef.current < fullTextRef.current.length) {
      intervalId = setInterval(() => {

        if (indexRef.current < fullTextRef.current.length) {
          const nextChar = fullTextRef.current.charAt(indexRef.current);
          setDisplayedText((prev) => prev + nextChar);
          indexRef.current += 1;
        } else if (!isStreaming) {
          
          clearInterval(intervalId);
        }
      }, 20); 
    }

    return () => clearInterval(intervalId);
  }, [isStreaming]); 

  const translate = useCallback(async (text: string, lanTo: string) => {
    setIsStreaming(true);
    setError(null);
    setDisplayedText('');
    fullTextRef.current = '';
    indexRef.current = 0;

    try {
      const response = await fetch(`${API_URL}/admin-user/translations/translate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ text, lan_to: lanTo }),
      });

      if (!response.ok) throw new Error("Network error");
      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        fullTextRef.current += chunk;
      }

    } catch (err: any) {
      console.error(err);
      setError(toApiError(err));
    } finally {
      setIsStreaming(false); 
    }
  }, [accessToken]);

  const reset = () => {
    setDisplayedText('');
    fullTextRef.current = '';
    indexRef.current = 0;
    setError(null);
  };

  return { 
    translate, 
    streamedText: displayedText, 
    isLoading: isStreaming || (indexRef.current < fullTextRef.current.length), 
    error,
    reset 
  };
};