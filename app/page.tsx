"use client";
import { Suspense } from "react";
import SearchBar from "./components/SearchBar";
import { Wifi, Zap, Shield, Clock, CreditCard, Star, Users } from "lucide-react";

const amenities = [
  { icon: Wifi, label: "Free Wi-Fi", desc: "High-speed internet on every journey, every seat." },
  { icon: Zap, label: "Power Outlets", desc: "Charge your devices on the go — USB and plug sockets." },
  { icon: Shield, label: "Safe Travel", desc: "Certified drivers, fully insured modern vehicles." },
];

const whyUs = [
  { icon: CreditCard, label: "M-Pesa, Card & PayPal", desc: "Pay your way — mobile money, debit card, or PayPal from anywhere in the world.", accent: "#10B981" },
  { icon: Star, label: "Premium Comfort", desc: "Modern 7-seater vehicles with extra legroom, air conditioning, and clean interiors.", accent: "#F59E0B" },
  { icon: Clock, label: "On-Time Guarantee", desc: "Punctuality is our promise. Real-time tracking so you always know where your ride is.", accent: "#06B6D4" },
  { icon: Users, label: "Group & Private Hire", desc: "Wedding convoys, corporate travel, or group bookings — we handle it all.", accent: "#818CF8" },
];

const stats = [
  { value: "50+", label: "Towns Covered" },
  { value: "10K+", label: "Happy Travellers" },
  { value: "99%", label: "On-Time Rate" },
  { value: "24/7", label: "Support" },
];

const S = {
  sec: { padding: "88px 24px" } as React.CSSProperties,
  con: { maxWidth: 1200, margin: "0 auto" } as React.CSSProperties,
  label: { color: "#06B6D4", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const, fontWeight: 600, display: "block", marginBottom: 12 },
  h2: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px,5vw,44px)", fontWeight: 700, color: "white" } as React.CSSProperties,
};

export default function Home() {
  return (
    <div style={{ background: "#0A1628" }}>

      {/* ─── HERO ─── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 24px 60px", background: "linear-gradient(135deg, #0A1628 0%, #0F2040 50%, #0A1628 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "15%", left: "5%", width: 500, height: 500, borderRadius: "50%", background: "rgba(29,78,216,0.12)", filter: "blur(100px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "rgba(6,182,212,0.08)", filter: "blur(100px)", pointerEvents: "none" }} />
        <div style={{ ...S.con, position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 50, padding: "6px 18px", marginBottom: 32 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
            <span style={{ color: "#06B6D4", fontSize: 13, fontWeight: 500 }}>Kenya&apos;s Most Modern Transport Platform</span>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(52px,9vw,88px)", fontWeight: 700, color: "white", lineHeight: 1.05, marginBottom: 24 }}>
            Travel Kenya<br />
            <span style={{ background: "linear-gradient(135deg, #06B6D4, #1D4ED8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Smarter.</span>
          </h1>
          <p style={{ color: "rgba(232,244,253,0.58)", fontSize: 19, lineHeight: 1.7, maxWidth: 540, marginBottom: 44 }}>
            Book intercity buses, airport transfers, and private hire across Kenya in seconds. Pay with M-Pesa, card, or PayPal.
          </p>
          <div id="book">
            <Suspense fallback={<div style={{ height: 80 }} />}>
              <SearchBar />
            </Suspense>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 36, maxWidth: 520 }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 12px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, background: "linear-gradient(135deg,#06B6D4,#1D4ED8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.value}</div>
                <div style={{ color: "rgba(232,244,253,0.35)", fontSize: 11, marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AMENITIES ─── */}
      <section style={{ ...S.sec, background: "#0C1829" }}>
        <div style={S.con}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={S.label}>On Every Journey</span>
            <h2 style={S.h2}>Travel in Comfort</h2>
            <div style={{ width: 40, height: 3, background: "linear-gradient(135deg,#1D4ED8,#06B6D4)", borderRadius: 2, margin: "14px auto 0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
            {amenities.map(a => (
              <div key={a.label} className="card" style={{ padding: 36 }}>
                <div style={{ width: 54, height: 54, borderRadius: 15, background: "linear-gradient(135deg,#1D4ED8,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22, boxShadow: "0 0 24px rgba(29,78,216,0.3)" }}>
                  <a.icon size={24} color="white" />
                </div>
                <h3 style={{ color: "white", fontWeight: 600, fontSize: 18, marginBottom: 10 }}>{a.label}</h3>
                <p style={{ color: "rgba(232,244,253,0.48)", fontSize: 14, lineHeight: 1.65 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section style={{ ...S.sec, background: "#0A1628" }}>
        <div style={S.con}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={S.label}>Why GM Rides</span>
            <h2 style={S.h2}>Built Different</h2>
            <div style={{ width: 40, height: 3, background: "linear-gradient(135deg,#1D4ED8,#06B6D4)", borderRadius: 2, margin: "14px auto 0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(440px,1fr))", gap: 18 }}>
            {whyUs.map(w => (
              <div key={w.label} className="card" style={{ padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <w.icon size={21} color={w.accent} />
                </div>
                <div>
                  <h3 style={{ color: "white", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{w.label}</h3>
                  <p style={{ color: "rgba(232,244,253,0.48)", fontSize: 14, lineHeight: 1.65 }}>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
