"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ChevronRight, User, Mail, Phone, Lock, Loader2, CheckCircle, Smartphone, CreditCard, DollarSign } from "lucide-react";
import { calculateFare, getTravelTime, getArrivalTime } from "../lib/pricing";
import StripePayment from "../components/StripePayment";
import { useCurrency } from "../context/CurrencyContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const seatLayout = [
  ["1A","1B","","1C","1D"],["2A","2B","","2C","2D"],["3A","3B","","3C","3D"],
  ["4A","4B","","4C","4D"],["5A","5B","","5C","5D"],["6A","6B","","6C","6D"],["7A","7B","","7C","7D"],
];
const booked = ["1A","2C","3B","5D","6A"];

function Booking() {
  const p = useSearchParams();
  const from = p.get("from") || "";
  const to = p.get("to") || "";
  const pax = Number(p.get("pax") || 1);
  const type = p.get("type") || "One Way";
  const depTime = p.get("dep") || "06:00";
  const returnDate = p.get("returnDate") || "";
  const isRoundTrip = type === "Round Trip";
  const tripMultiplier = isRoundTrip ? 1.8 : 1;
  const isAirport = type === "Airport Transfer";
  const { currency, format } = useCurrency();

  const passedFare = Number(p.get("fare") || 0);
  const fareKES = passedFare > 0 ? passedFare : calculateFare(from, to, isAirport);
  const totalKES = Math.round(fareKES * pax * tripMultiplier);
  const { label: duration } = getTravelTime(from, to, isAirport);
  const arrTime = getArrivalTime(depTime, from, to, isAirport);

  const [step, setStep] = useState(1);
  const [selSeats, setSelSeats] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [payMethod, setPayMethod] = useState("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [bookingId, setBookingId] = useState<number|null>(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState("");
  const [discount, setDiscount] = useState<{ percent: number; amount: number; total: number } | null>(null);
  const [payStatus, setPayStatus] = useState<"idle"|"waiting"|"confirmed"|"timeout">("idle");

  const pollMpesa = (checkoutId: string) => {
    let elapsed = 0;
    const interval = setInterval(async () => {
      elapsed += 4;
      try {
        const res = await fetch(`${API}/payments/mpesa/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkout_request_id: checkoutId }),
        });
        const data = await res.json();
        if (data.booking_status === "confirmed") {
          clearInterval(interval);
          setPayStatus("confirmed");
        }
      } catch {}
      if (elapsed >= 90) {
        clearInterval(interval);
        setPayStatus((s) => (s === "confirmed" ? s : "timeout"));
      }
    }, 4000);
  };

  const toggleSeat = (s: string) => {
    if (booked.includes(s)) return;
    if (selSeats.includes(s)) setSelSeats(selSeats.filter(x => x !== s));
    else if (selSeats.length < pax) setSelSeats([...selSeats, s]);
  };

  const createBooking = async () => {
    const token = localStorage.getItem("gmrides_token");
    const res = await fetch(`${API}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({
        from_location: from, to_location: to, trip_type: type,
        travel_date: p.get("date") || new Date().toISOString().split("T")[0],
        departure_time: depTime, arrival_time: arrTime, duration,
        passengers: pax, seats: selSeats,
        passenger_name: name, passenger_email: email, passenger_phone: phone,
        fare_kes: fareKES, total_kes: totalKES, currency, total_paid: totalKES,
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Booking failed");
    if (data.discount_percent > 0) {
      setDiscount({ percent: data.discount_percent, amount: data.discount_amount, total: Number(data.booking.total_kes) });
    }
    return data.booking;
  };

  const processPayment = async () => {
    setProcessing(true);
    setError("");
    try {
      const booking = await createBooking();
      setBookingId(booking.id);
      setBookingRef(booking.booking_reference);

      if (payMethod === "mpesa") {
        const res = await fetch(`${API}/payments/mpesa/initiate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking_id: booking.id, phone: mpesaPhone || phone, amount: totalKES })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setCheckoutRequestId(data.checkout_request_id);
        setPayStatus("waiting");
        setStep(4);
        pollMpesa(data.checkout_request_id);

      } else if (payMethod === "card") {
        // Booking created. StripePayment handles the card via Stripe Elements.
        setProcessing(false);
        return;
      } else if (payMethod === "paypal") {
        const res = await fetch(`${API}/payments/paypal/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking_id: booking.id, amount: totalKES, currency })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        if (data.approval_url) window.location.href = data.approval_url;
      }

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
    }
    setProcessing(false);
  };

  const steps = ["Select Seats","Passenger Details","Payment","Confirmation"];

  return (
    <div style={{ minHeight: "100vh", background: "#0A1628", paddingTop: 88, paddingBottom: 64 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>

        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40, gap: 0, paddingTop: 32 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700,
                  background: step === 4 ? 'linear-gradient(135deg,#10B981,#06B6D4)' : i + 1 < step ? 'linear-gradient(135deg,#10B981,#06B6D4)' : i + 1 === step ? 'linear-gradient(135deg,#1D4ED8,#06B6D4)' : 'rgba(255,255,255,0.06)',
                  color: i + 1 <= step ? "white" : "rgba(232,244,253,0.3)" }}>
                  {i + 1 < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span style={{ fontSize: 11, color: i + 1 === step ? "#06B6D4" : "rgba(232,244,253,0.3)", whiteSpace: "nowrap" }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: i + 1 < step ? "linear-gradient(90deg,#10B981,#06B6D4)" : "rgba(255,255,255,0.07)", margin: "0 8px", marginBottom: 20 }} />}
            </div>
          ))}
        </div>

        {/* Fare bar */}
        {step < 4 && (
          <div style={{ background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: 14, padding: "14px 20px", marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <span style={{ color: "rgba(232,244,253,0.6)", fontSize: 14 }}>{from} → {to} · {pax} passenger{pax > 1 ? "s" : ""}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "rgba(232,244,253,0.4)", fontSize: 13 }}>{format(fareKES)} × {pax} =</span>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: "#06B6D4" }}>{format(totalKES)}</span>
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, color: "white", marginBottom: 8 }}>Select Your Seats</h2>
            <p style={{ color: "rgba(232,244,253,0.45)", fontSize: 14, marginBottom: 28 }}>Select {pax} seat{pax > 1 ? "s" : ""}</p>
            <div style={{ display: "flex", gap: 20, marginBottom: 28 }}>
              {[{ cls: "seat-avail", label: "Available" },{ cls: "seat-sel", label: "Selected" },{ cls: "seat-booked", label: "Booked" }].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className={l.cls} style={{ cursor: "default" }} /><span style={{ color: "rgba(232,244,253,0.5)", fontSize: 13 }}>{l.label}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "32px 24px" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
                <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 16px", color: "rgba(232,244,253,0.4)", fontSize: 12 }}>🚌 Driver</div>
              </div>
              {seatLayout.map((row, ri) => (
                <div key={ri} style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 8 }}>
                  {row.map((s, ci) => s === "" ? <div key={ci} style={{ width: 38 }} /> : (
                    <button key={s} onClick={() => toggleSeat(s)} className={booked.includes(s) ? "seat-booked" : selSeats.includes(s) ? "seat-sel" : "seat-avail"}>{s}</button>
                  ))}
                </div>
              ))}
            </div>
            {selSeats.length > 0 && (
              <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(232,244,253,0.6)", fontSize: 14 }}>Selected: <strong style={{ color: "#06B6D4" }}>{selSeats.join(", ")}</strong></span>
                <button onClick={() => setStep(2)} disabled={selSeats.length < pax} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                  Continue <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, color: "white", marginBottom: 8 }}>Passenger Details</h2>
            <p style={{ color: "rgba(232,244,253,0.45)", fontSize: 14, marginBottom: 28 }}>Seats: {selSeats.join(", ")}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                { icon: User, label: "Full Name", val: name, set: setName, ph: "Enter your full name", type: "text" },
                { icon: Mail, label: "Email Address", val: email, set: setEmail, ph: "your@email.com", type: "email" },
                { icon: Phone, label: "Phone Number", val: phone, set: setPhone, ph: "+254 7XX XXX XXX", type: "tel" },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 13, marginBottom: 8 }}>{f.label}</label>
                  <div style={{ position: "relative" }}>
                    <f.icon size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#06B6D4" }} />
                    <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} type={f.type} className="input-field" style={{ paddingLeft: 40 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button onClick={() => setStep(1)} className="btn-secondary" style={{ fontSize: 14 }}>Back</button>
              <button onClick={() => setStep(3)} disabled={!name || !email || !phone} className="btn-primary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14 }}>
                Continue <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, color: "white", marginBottom: 8 }}>Payment</h2>
            <p style={{ color: "rgba(232,244,253,0.45)", fontSize: 14, marginBottom: 28 }}>Total: {format(totalKES)}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {[
                { id: "mpesa", label: "M-Pesa", desc: "STK Push to your phone", icon: Smartphone, color: "#10B981" },
                { id: "card", label: "Debit / Credit Card", desc: "Visa, Mastercard — powered by Stripe", icon: CreditCard, color: "#06B6D4" },
                { id: "paypal", label: "PayPal", desc: "Pay with your PayPal account", icon: DollarSign, color: "#818CF8", comingSoon: true },
              ].map(m => (
                <button key={m.id} onClick={() => { if (!(m as any).comingSoon) setPayMethod(m.id); }} disabled={(m as any).comingSoon}
                  style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 14, background: payMethod === m.id ? "rgba(29,78,216,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${payMethod === m.id ? "rgba(6,182,212,0.4)" : "rgba(255,255,255,0.07)"}`, cursor: (m as any).comingSoon ? "not-allowed" : "pointer", textAlign: "left", opacity: (m as any).comingSoon ? 0.5 : 1 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `${m.color}18`, border: `1px solid ${m.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <m.icon size={19} color={m.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "white", fontWeight: 600, fontSize: 15 }}>{m.label}</div>
                    <div style={{ color: "rgba(232,244,253,0.4)", fontSize: 13 }}>{m.desc}</div>
                  </div>
                  {(m as any).comingSoon ? (
                    <span style={{ padding: "4px 10px", borderRadius: 50, background: "rgba(255,255,255,0.08)", color: "rgba(232,244,253,0.5)", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>Coming soon</span>
                  ) : (
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${payMethod === m.id ? "#06B6D4" : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {payMethod === m.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#06B6D4" }} />}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* M-Pesa */}
            {payMethod === "mpesa" && (
              <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <h3 style={{ color: "#10B981", fontSize: 15, fontWeight: 600, marginBottom: 12 }}>M-Pesa STK Push</h3>
                <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 13, marginBottom: 8 }}>M-Pesa Phone Number</label>
                <div style={{ position: "relative", marginBottom: 12 }}>
                  <Smartphone size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#10B981" }} />
                  <input value={mpesaPhone || phone} onChange={e => setMpesaPhone(e.target.value)} placeholder="+254 7XX XXX XXX" className="input-field" style={{ paddingLeft: 40, borderColor: "rgba(16,185,129,0.3)" }} />
                </div>
                <p style={{ color: "rgba(232,244,253,0.35)", fontSize: 12, lineHeight: 1.6 }}>
                  After clicking Pay, you will receive an STK Push on your phone. Enter your M-Pesa PIN to complete payment of <strong style={{ color: "#10B981" }}>{format(totalKES)}</strong>.
                </p>
              </div>
            )}

            {/* Card */}
            {payMethod === "card" && (
              !bookingId ? (
                <div style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
                  <p style={{ color: "rgba(232,244,253,0.6)", fontSize: 14, marginBottom: 16 }}>You will pay securely by card via Stripe.</p>
                  <button onClick={async () => { setProcessing(true); setError(""); try { const b = await createBooking(); setBookingId(b.id); setBookingRef(b.booking_reference); } catch (e: unknown) { setError(e instanceof Error ? e.message : "Could not start payment"); } setProcessing(false); }}
                    disabled={processing} className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14, padding: "14px" }}>
                    {processing ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />Preparing...</> : <>Continue to Secure Payment <Lock size={14} /></>}
                  </button>
                </div>
              ) : (
                <StripePayment
                  bookingId={bookingId}
                  amount={totalKES}
                  currency={currency}
                  formatted={format(totalKES)}
                  onSuccess={() => setStep(4)}
                  onError={(msg) => setError(msg)}
                />
              )
            )}
            {/* PayPal */}
            {payMethod === "paypal" && (
              <div style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.2)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <h3 style={{ color: "#818CF8", fontSize: 15, fontWeight: 600, marginBottom: 12 }}>PayPal</h3>
                <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 13, marginBottom: 8 }}>PayPal Email</label>
                <div style={{ position: "relative", marginBottom: 12 }}>
                  <Mail size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#818CF8" }} />
                  <input value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)} placeholder="your@paypal.com" type="email" className="input-field" style={{ paddingLeft: 40, borderColor: "rgba(129,140,248,0.3)" }} />
                </div>
                <p style={{ color: "rgba(232,244,253,0.35)", fontSize: 12, lineHeight: 1.6 }}>
                  You will be redirected to PayPal to complete payment of <strong style={{ color: "#818CF8" }}>{format(totalKES)}</strong>.
                </p>
              </div>
            )}

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, color: "#EF4444", fontSize: 14 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(2)} className="btn-secondary" style={{ fontSize: 14 }}>Back</button>
              {payMethod !== "card" && (
                <button onClick={processPayment} disabled={processing ||
                  (payMethod === "paypal" && !paypalEmail)}
                  className="btn-primary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14 }}>
                  {processing ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />Processing...</> : <>Pay {format(totalKES)} <Lock size={14} /></>}
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Confirmation */}
        {step === 4 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#10B981,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 36 }}>✓</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, color: "white", marginBottom: 12 }}>
              {payMethod === "mpesa" ? (payStatus === "confirmed" ? "Payment Confirmed!" : payStatus === "timeout" ? "Awaiting Confirmation" : "STK Push Sent!") : "Booking Confirmed!"}
            </h2>
            <p style={{ color: "rgba(232,244,253,0.55)", fontSize: 16, marginBottom: 32, maxWidth: 460, margin: "0 auto 32px" }}>
              {payMethod === "mpesa"
                ? `Check your phone (${mpesaPhone || phone}) for the M-Pesa prompt. Enter your PIN to complete payment.`
                : `Your e-ticket has been sent to ${email}. An SMS confirmation has been sent to ${phone}.`}
            </p>
            <div style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 28, marginBottom: 28, textAlign: "left", maxWidth: 480, margin: "0 auto 28px" }}>
              <div style={{ color: "rgba(232,244,253,0.4)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Booking Reference</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, color: "#06B6D4", letterSpacing: "0.1em", marginBottom: 20 }}>{bookingRef}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  ["Route", `${from} → ${to}`],
                  ["Seats", selSeats.join(", ")],
                  ["Passenger", name],
                  ...(discount ? [["Loyalty Discount", `-${format(discount.amount)} (${discount.percent}%)`]] : []),
                  ["Total", discount ? format(discount.total) : format(totalKES)],
                  ["Payment", payMethod.toUpperCase()],
                  ["Status", payMethod === "mpesa" ? (payStatus === "confirmed" ? "Confirmed ✓" : payStatus === "timeout" ? "Pending" : "Awaiting Payment...") : "Confirmed ✓"],
                ].map(([k,v]) => (
                  <div key={k}>
                    <div style={{ color: "rgba(232,244,253,0.35)", fontSize: 12, marginBottom: 2 }}>{k}</div>
                    <div style={{ color: k === "Status" ? (v.includes("✓") ? "#10B981" : "#F59E0B") : "white", fontSize: 14, fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <a href="/" className="btn-primary" style={{ textDecoration: "none", display: "inline-block", fontSize: 15, padding: "14px 36px" }}>Back to Home</a>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0A1628" }} />}>
      <Booking />
    </Suspense>
  );
}
