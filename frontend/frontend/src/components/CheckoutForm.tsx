import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { IoLockClosedOutline } from "react-icons/io5";
import { t } from 'i18next';

export default function CheckoutForm({total}: {total: number}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage("");

    // TODO: Replace PROD URL

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || t('paymentError'));
    } else {
      // onSubmit trigger
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2 className="checkout-form__title">{t('paymentTitle')}</h2>

      <PaymentElement />

      {errorMessage && (
        <p className="checkout-form__error">{errorMessage}</p>
      )}

      <button
        type="submit"
        className="checkout-form__btn"
        disabled={!stripe || isProcessing}
      >
        <IoLockClosedOutline />
        {isProcessing ? "Wird verarbeitet..." : `Jetzt bezahlen (${total} €)`}
      </button>
    </form>
  );
}