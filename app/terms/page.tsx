"use client";
import { useState, useEffect } from "react";

const fallbackSections = [
  { h: "1. Acceptance of Terms", p: ["By accessing or using GM Rides, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform. These terms apply to all users, including guests and registered account holders."] },
  { h: "2. Our Services", p: ["GM Rides is a transport booking platform that allows users to book intercity travel, airport transfers, and private hire across Kenya. We facilitate bookings and payments between you and transport operators.", "We aim to keep route, fare, and availability information accurate, but details may change and are subject to confirmation at the time of booking."] },
  { h: "3. Bookings and Payments", p: ["When you make a booking, you agree to provide accurate information and to pay the fare shown at checkout. Payment is processed through our supported methods: M-Pesa, debit/credit card (via Stripe), and other methods as made available.", "A booking is only confirmed once payment has been successfully completed. You will receive a confirmation with a booking reference by SMS and on screen.", "Fares are displayed in your selected currency. Where currency conversion applies, the amount charged may vary slightly due to exchange rates and processing."] },
  { h: "4. Loyalty Discounts", p: ["Registered and returning customers may qualify for loyalty discounts based on the number of confirmed trips, as described on the platform. Discounts are applied automatically when eligibility criteria are met and may be changed or withdrawn at our discretion."] },
  { h: "5. Cancellations and Changes", p: ["Cancellation and refund eligibility are governed by our Refund Policy. Please review it before booking. Some bookings may be non-refundable or subject to fees depending on timing and operator terms."] },
  { h: "6. User Responsibilities", p: ["You agree to use GM Rides lawfully and not to misuse the platform, attempt unauthorised access, or interfere with its operation. You are responsible for keeping your account credentials secure.", "You must arrive on time for your booked trips. GM Rides and its operators are not liable for missed departures due to late arrival."] },
  { h: "7. Limitation of Liability", p: ["GM Rides acts as a booking platform. While we work with operators to provide safe and reliable transport, we are not liable for delays, cancellations, loss, injury, or damages arising from the transport services themselves, except where required by law.", "Our total liability for any claim related to a booking shall not exceed the amount paid for that booking."] },
  { h: "8. Account Suspension", p: ["We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or misuse the platform."] },
  { h: "9. Changes to These Terms", p: ["We may update these Terms of Service from time to time. Changes will be posted on this page with a revised date. Continued use of GM Rides constitutes acceptance of the updated terms."] },
  { h: "10. Governing Law", p: ["These terms are governed by the laws of Kenya. Any disputes shall be subject to the jurisdiction of the Kenyan courts."] },
  { h: "11. Contact", p: ["For questions about these Terms of Service, contact us at hello@gmrides.net. GM Rides is based in Nairobi, Kenya."] },
];

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api";
export default function TermsPage() {
  const [title, setTitle] = useState("Terms of Service");
  const [sections, setSections] = useState<any[]>(fallbackSections);
  useEffect(() => {
    fetch(`${API}/pages/terms`)
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
