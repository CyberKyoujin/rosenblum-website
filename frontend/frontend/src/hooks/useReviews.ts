import axios from "axios";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";


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
  const [reviewsError, setReviewsError] = useState<string | null>(null);
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
      } catch (err: any) {
        if (axios.isCancel(err) || err.code === "ERR_CANCELED") return; 
        console.error("Failed to fetch reviews:", err);
        setReviewsError("Failed to load reviews");
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