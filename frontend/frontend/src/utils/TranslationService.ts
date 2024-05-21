import axios from 'axios';

const API_KEY = 'AIzaSyCnNksFKoHCykmmkc0hOGbbFr9kNJMawjI';
const URL = 'https://translation.googleapis.com/language/translate/v2';

interface Review {
    author_name: string | null;
    author_url: string | null;
    profile_photo_url: string | null;
    rating: number;
    relative_time_description: string | null;
    text: string | null;
}

export const translateReviews = async (reviews: Review[], targetLanguage: string = 'de') => {
    try {
        const translationPromises = reviews.map(async (review) => {
            if (review.text) {
                try {
                    const response = await axios.post(URL, {}, {
                        params: {
                            key: API_KEY,
                            q: review.text,
                            target: targetLanguage
                        }
                    });
                    review.text = response.data.data.translations[0].translatedText;
                } catch (error) {
                    console.error(`Error translating review by ${review.author_name}:`, error);
                    review.text = 'Translation error';
                }
            }
            return review;
        });

        const translatedReviews = await Promise.all(translationPromises);
        return translatedReviews;
    } catch (error) {
        console.error('Error translating reviews:', error);
        throw error;
    }
};