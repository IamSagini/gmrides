"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Lock, Loader2 } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api";

interface Props {
  bookingId: number;
  amount: number;
  currency: string;
  formatted: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

const fieldStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "13px 14px",
};

const elementOptions = {
  style: {
    base: {
      fontSize: "15px",
      color: "#ffffff",
      fontFamily: "Inter, sans-serif",
      "::placeholder": { color: "rgba(232,244,253,0.35)" },
    },
    invalid: { color: "#EF4444" },
  },
};

function CardForm({ bookingId, amount, currency, formatted, onSuccess, onError }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const pay = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);
    try {
      const res = await fetch(`${API}/payments/stripe/intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId, amount, currency }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Could not start payment");

      const cardNumber = elements.getElement(CardNumberElement);
      if (!cardNumber) throw new Error("Card field not ready");

      const { error, paymentIntent } = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: { card: cardNumber },
      });

      if (error) throw new Error(error.message || "Card was declined");
      if (paymentIntent?.status === "succeeded") {
        await fetch(`${API}/payments/stripe/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ intent_id: paymentIntent.id }),
        });
        onSuccess();
      } else {
        throw new Error("Payment not completed");
      }
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : "Card payment failed");
    }
    setProcessing(false);
  };

  return (
    <div style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
      <h3 style={{ color: "#06B6D4", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Card Details</h3>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 13, marginBottom: 8 }}>Card Number</label>
        <div style={fieldStyle}>
          <CardNumberElement options={{ ...elementOptions, showIcon: true, placeholder: "1234 5678 9012 3456" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 13, marginBottom: 8 }}>Expiry</label>
          <div style={fieldStyle}>
            <CardExpiryElement options={elementOptions} />
          </div>
        </div>
        <div>
          <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 13, marginBottom: 8 }}>CVC</label>
          <div style={fieldStyle}>
            <CardCvcElement options={elementOptions} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, marginBottom: 16 }}>
        <Lock size={11} color="rgba(232,244,253,0.3)" />
        <span style={{ color: "rgba(232,244,253,0.3)", fontSize: 11 }}>Secured by Stripe. Test card: 4242 4242 4242 4242, any future date, any CVC.</span>
      </div>

      <button onClick={pay} disabled={processing || !stripe}
        className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14, padding: "14px" }}>
        {processing ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />Processing...</> : <>Pay {formatted} <Lock size={14} /></>}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function StripePayment(props: Props) {
  return (
    <Elements stripe={stripePromise}>
      <CardForm {...props} />
    </Elements>
  );
}
