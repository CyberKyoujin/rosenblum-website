import axios from "axios";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ApiError } from "../types/auth";
import { toApiError } from "../axios/toApiError";
import axiosInstance from "../axios/axiosInstance";
import { ApiErrorResponse } from "../types/error";

interface Review{
    id: number;
    author_name: string;
    rating: number;
    original_language: string;
    text: string;
    review_timestamp: string;
    profile_photo_url: string;
}

export function useReviews() {
  const { i18n } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);

  const [reviewsError, setReviewsError] = useState<ApiErrorResponse | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    let lang = i18n.language.split("-")[0].toLowerCase(); 

    if (lang === "ua") lang = "uk";

    async function fetchReviews() {
      setReviewsLoading(true);

      try {
        const response = await axiosInstance.get<Review[]>(`/user/reviews/`, {
          params: { lang },
          signal: controller.signal, 
        });
        
        setReviews(response.data);
      } catch (err: unknown) {
        const error = toApiError(err);
        
        if (error.code !== 'canceled') {
             setReviewsError(error);
        }

      } finally {
        if (!controller.signal.aborted) {
            setReviewsLoading(false);
        }
      }
    }

    fetchReviews();

    return () => {
      controller.abort();
    };

  }, [i18n.language]);

  return { reviews, reviewsLoading, reviewsError };
}