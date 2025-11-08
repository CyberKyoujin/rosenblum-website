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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let lang = i18n.language.split("-")[0].toLowerCase(); 

    if (lang === "ua") lang = "uk";

    async function fetchReviews() {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<Review[]>(`http://localhost:8000/user/reviews/`, {
          params: { lang },
          signal: controller.signal, 
        });
        console.log("Reviews response:", response.data);
        console.log(reviews);
        setReviews(response.data);
      } catch (err: any) {
        if (axios.isCancel(err) || err.code === "ERR_CANCELED") return; 
        console.error("Failed to fetch reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();

    return () => {
      controller.abort();
    };

  }, [i18n.language]);

  return { reviews, loading, error };
}