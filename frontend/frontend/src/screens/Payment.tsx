import { loadStripe, Appearance } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { useEffect, useState } from "react";
import axiosInstance from "../axios/axiosInstance";
import { useLocation } from "react-router-dom";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

const stripePromise = loadStripe(stripeKey);

const appearance: Appearance = {
  theme: 'flat',
  variables: {
    colorPrimary: '#4C79D4',
    colorBackground: '#f9fafb',
    colorText: '#1f2937',
    colorDanger: '#df1b41',
    fontFamily: '"Rubik", sans-serif',
    borderRadius: '10px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      border: '1px solid #e0e0e0',
      backgroundColor: '#ffffff',
      boxShadow: 'none',
      padding: '12px 14px',
      fontSize: '0.9375rem',
      transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    },
    '.Input:focus': {
      border: '1px solid #4C79D4',
      boxShadow: '0 0 0 2px rgba(76, 121, 212, 0.15)',
    },
    '.Label': {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '6px',
    },
    '.Tab': {
      border: '1px solid #e0e0e0',
      borderRadius: '10px',
      backgroundColor: '#ffffff',
      boxShadow: 'none',
    },
    '.Tab:hover': {
      border: '1px solid #4C79D4',
      backgroundColor: '#fafbff',
    },
    '.Tab--selected': {
      border: '1px solid #4C79D4',
      backgroundColor: '#f0f5ff',
      boxShadow: '0 0 0 1px #4C79D4',
    },
    '.Error': {
      fontSize: '0.8125rem',
      color: '#df1b41',
    },
  },
};

export const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState("");

  const location = useLocation();

  const { total, orderId, guestUuid } = location.state as { total: number; orderId: string; guestUuid: string | null };

  useEffect(() => {

    const fetchClientSecret = async () => {
        try {
            const response = await axiosInstance.post("/payments/payment-intent/", {
                order_id: orderId,
                ...(guestUuid ? { uuid: guestUuid } : {}),
            });
            setClientSecret(response.data.clientSecret);
        } catch (error) {
            console.error("Error fetching client secret:", error);
        }
    }

    fetchClientSecret();
  }, []);

  return (
    <div className="payment-page">
      {clientSecret && (
        <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
          <CheckoutForm total={total}/>
        </Elements>
      )}
    </div>
  );
}

export default PaymentPage;