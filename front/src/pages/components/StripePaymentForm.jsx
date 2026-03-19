import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { paymentService } from "../../services/paymentService";
import { toast } from "react-hot-toast";
import { Loader, Lock } from "lucide-react";
import "./StripePaymentForm.scss";

export const StripePaymentForm = ({ onSuccess, amount, isDirectPayment = false }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  const handleCardChange = (event) => {
    setCardError(event.error ? event.error.message : null);
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      toast.error("Card element not found");
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setCardError(error.message);
        toast.error(error.message);
        setIsProcessing(false);
        return;
      }

      const response = await paymentService.processStripePayment({
        paymentMethodId: paymentMethod.id,
        amount: Math.round(amount * 100),
        isDirectPayment,
      });

      if (response.data.success) {
        cardElement.clear();
        setCardError(null);
        toast.success(
          isDirectPayment ? "Booking completed successfully!" : "Balance topped up!"
        );
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.data.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#0f172a",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        "::placeholder": {
          color: "#cbd5e1",
        },
        lineHeight: "1.5",
      },
      invalid: {
        color: "#ef4444",
      },
    },
  };

  return (
    <form onSubmit={handlePayment} className="stripe-payment-form">
      <div className="stripe-payment-form__field">
        <label className="stripe-payment-form__label">
          <Lock size={14} />
          Card Details
        </label>
        <div className="stripe-payment-form__card-wrapper">
          <CardElement
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>
        {cardError && (
          <p className="stripe-payment-form__error">{cardError}</p>
        )}
      </div>

      <div className="stripe-payment-form__amount">
        <p className="stripe-payment-form__amount-label">Amount</p>
        <p className="stripe-payment-form__amount-value">
          ${(amount / 100).toFixed(2)} USD
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="stripe-payment-form__submit"
      >
        {isProcessing ? (
          <>
            <Loader size={18} className="stripe-payment-form__spinner" />
            Processing...
          </>
        ) : (
          `Pay ${(amount / 100).toFixed(2)} USD`
        )}
      </button>
    </form>
  );
};
