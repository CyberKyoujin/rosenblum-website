import axios from "axios";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ApiError } from "../types/auth";
import { toApiError } from "../axios/toApiError";

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
  const [reviewsError, setReviewsError] = useState<ApiError | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    let lang = i18n.language.split("-")[0].toLowerCase(); 

    if (lang === "ua") lang = "uk";

    async function fetchReviews() {
      setReviewsLoading(true);
      setReviewsError(null);

      try {
        const response = await axios.get<Review[]>(`http://localhost:8000/user/reviews/`, {
          params: { lang },
          signal: controller.signal, 
        });
        
        setReviews(response.data);
      } catch (err: unknown) {
        const error = toApiError(err);
        setReviewsError(error);
      } finally {
        setReviewsLoading(false);
      }
    }

    fetchReviews();

    return () => {
      controller.abort();
    };

  }, [i18n.language]);

  return { reviews, reviewsLoading, reviewsError };
}