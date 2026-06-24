"use client";
import { useState, useEffect } from "react";

const fallbackSections = [
  {
    h: "1. Introduction",
    p: ["GM Rides (\"we\", \"us\", \"our\") operates a transport booking platform offering intercity travel, airport transfers, and private hire across Kenya. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website and services.", "We are committed to handling your data responsibly and in accordance with the Kenya Data Protection Act, 2019, and other applicable laws. By using GM Rides, you agree to the practices described in this policy."],
  },
  {
    h: "2. Information We Collect",
    p: ["We collect information you provide directly when you make a booking or create an account, including your name, email address, phone number, and travel details (origin, destination, dates, and number of passengers).", "When you make a payment, payment processing is handled by our third-party providers (M-Pesa, Stripe). We do not store full card numbers or M-Pesa PINs on our servers. We retain transaction references and booking confirmation details.", "If you sign in with Google, we receive your name and email address from Google to create or access your account.", "We may also collect limited technical information such as your browser type and general usage data to keep the service running smoothly."],
  },
  {
    h: "3. How We Use Your Information",
    p: ["We use your information to process and confirm your bookings, send you booking confirmations and travel updates (by SMS and email), provide customer support, calculate loyalty discounts, and improve our services.", "We may use your contact details to communicate important information about your trips. We do not sell your personal information to third parties."],
  },
  {
    h: "4. Sharing Your Information",
    p: ["We share information only as necessary to provide the service: with payment processors to complete transactions, with SMS providers to deliver booking confirmations, and with transport operators to fulfil your bookings.", "We may disclose information if required by law, or to protect the rights, safety, and security of GM Rides, our users, or others."],
  },
  {
    h: "5. Data Storage and Security",
    p: ["We take reasonable technical and organisational measures to protect your personal information against unauthorised access, loss, or misuse. Passwords are stored in encrypted (hashed) form and are never visible to us.", "While we work to safeguard your data, no method of transmission or storage is completely secure, and we cannot guarantee absolute security."],
  },
  {
    h: "6. Your Rights",
    p: ["Under the Kenya Data Protection Act, 2019, you have the right to access the personal data we hold about you, request corrections, request deletion, and object to certain processing.", "To exercise any of these rights, please contact us using the details below. We will respond to your request within a reasonable timeframe."],
  },
  {
    h: "7. Data Retention",
    p: ["We retain your booking and account information for as long as your account is active or as needed to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements."],
  },
  {
    h: "8. Cookies",
    p: ["Our website uses minimal local storage to remember your preferences (such as your selected currency and login session). We do not use invasive tracking cookies for advertising."],
  },
  {
    h: "9. Changes to This Policy",
    p: ["We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Continued use of GM Rides after changes constitutes acceptance of the revised policy."],
  },
  {
    h: "10. Contact Us",
    p: ["If you have questions about this Privacy Policy or how we handle your data, contact us at hello@gmrides.net. GM Rides is based in Nairobi, Kenya."],
  },
];

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api";
export default function PrivacyPage() {
  const [title, setTitle] = useState("Privacy Policy");
  const [sections, setSections] = useState<any[]>(fallbackSections);
  useEffect(() => {
    fetch(`${API}/pages/privacy`)
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
