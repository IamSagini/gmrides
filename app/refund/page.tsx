"use client";
import { useState, useEffect } from "react";

const fallbackSections = [
  { h: "1. Overview", p: ["This Refund Policy explains how cancellations and refunds work for bookings made through GM Rides. By making a booking, you agree to the terms set out below. This policy should be read together with our Terms of Service."] },
  { h: "2. Cancellations by You", p: ["You may request to cancel a booking before your scheduled departure. The refund you are eligible for depends on how far in advance you cancel:", "Cancellations made more than 24 hours before departure: eligible for a full refund, less any non-refundable processing fees.", "Cancellations made between 6 and 24 hours before departure: eligible for a partial refund of up to 50% of the fare.", "Cancellations made less than 6 hours before departure, or no-shows: generally non-refundable.", "These timeframes are a general guideline. Specific operators or fare types may have different terms, which will be indicated at the time of booking."] },
  { h: "3. Cancellations by Us or the Operator", p: ["If a trip is cancelled by GM Rides or the transport operator (for example, due to a service disruption), you are entitled to a full refund of the fare paid, or the option to rebook on an alternative trip at no extra cost where available."] },
  { h: "4. How Refunds Are Processed", p: ["Approved refunds are returned to the original payment method used for the booking. M-Pesa payments are refunded to the paying M-Pesa number, and card payments are refunded to the original card via Stripe.", "Refunds are typically processed within 5 to 10 business days, though the time for funds to appear depends on your payment provider."] },
  { h: "5. Non-Refundable Items", p: ["Certain charges may be non-refundable, including payment processing fees and any clearly marked non-refundable fares or promotional bookings."] },
  { h: "6. How to Request a Refund", p: ["To request a cancellation or refund, contact us at hello@gmrides.net with your booking reference and the reason for your request. We will review your request and confirm your eligibility in line with this policy."] },
  { h: "7. Changes to This Policy", p: ["We may update this Refund Policy from time to time. Any changes will be posted on this page with a revised date. The policy in effect at the time of your booking applies to that booking."] },
  { h: "8. Contact", p: ["For any questions about refunds or cancellations, contact us at hello@gmrides.net. GM Rides is based in Nairobi, Kenya."] },
];

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api";
export default function RefundPage() {
  const [title, setTitle] = useState("Refund Policy");
  const [sections, setSections] = useState<any[]>(fallbackSections);
  useEffect(() => {
    fetch(`${API}/pages/refund`)
      .then(r => r.json())
      .then(d => { if (d.success && d.page) { setTitle(d.page.title); setSections(d.page.sections); } })
      .catch(() => {});
  }, []);
  return (
    <div style={{ minHeight: "100vh", background: "#0A1628", paddingTop: 88 }}>
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 40, fontWeight: 700, color: "white", marginBottom: 12 }}>{title}</h1>
          <p style={{ color: "rgba(232,244,253,0.4)", fontSize: 14, marginBottom: 48 }}>Last updated: June 2026</p>
          {sections.map((s: { h: string; p: string[] }, i: number) => (
            <div key={i} style={{ marginBottom: 36 }}>
              <h2 style={{ color: "#06B6D4", fontSize: 20, fontWeight: 600, marginBottom: 14 }}>{s.h}</h2>
              {s.p.map((para: string, j: number) => (
                <p key={j} style={{ color: "rgba(232,244,253,0.7)", fontSize: 15, lineHeight: 1.8, marginBottom: 14 }}>{para}</p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
