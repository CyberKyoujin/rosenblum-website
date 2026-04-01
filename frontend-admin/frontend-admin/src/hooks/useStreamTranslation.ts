import { useCallback, useEffect, useRef, useState } from "react";
import { ApiErrorResponse } from "../types/error";
import { toApiError } from "../utils/toApiError";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export const useStreamTranslation = () => {

  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<ApiErrorResponse | null>(null);

  const fullTextRef = useRef('');

  const indexRef = useRef(0);

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
      const csrfToken = Cookies.get('csrftoken');
      const response = await fetch(`${API_URL}/admin-user/translations/translate/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
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
  }, []);

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