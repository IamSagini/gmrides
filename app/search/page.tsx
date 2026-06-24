"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Clock, Users, Star, ChevronRight, CheckCircle, Wifi, Zap, Wind } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "../context/CurrencyContext";
import { calculateFare, getTravelTime, getArrivalTime } from "../lib/pricing";

const amenityIcons: Record<string, React.ReactElement> = {
  WiFi: <Wifi size={11} />, AC: <Wind size={11} />, Power: <Zap size={11} />,
};

const departures = [
  { id: 1, name: "GM Express", dep: "06:00", seats: 8, rating: 4.8, amenities: ["WiFi","AC","Power"] },
  { id: 2, name: "GM Shuttle", dep: "09:00", seats: 3, rating: 4.6, amenities: ["WiFi","AC"] },
  { id: 3, name: "GM VIP", dep: "14:00", seats: 5, rating: 4.9, amenities: ["WiFi","AC","Power","Snacks"], premium: true },
  { id: 4, name: "GM Night Rider", dep: "22:00", seats: 12, rating: 4.5, amenities: ["AC"] },
];

function Results() {
  const p = useSearchParams();
  const from = p.get("from") || "";
  const to = p.get("to") || "";
  const date = p.get("date") || "";
  const pax = p.get("pax") || "1";
  const type = p.get("type") || "One Way";
  const returnDate = p.get("returnDate") || "";
  const tripMultiplier = type === "Round Trip" ? 1.8 : 1;
  const { format } = useCurrency();
  const [sel, setSel] = useState<number|null>(null);

  const isAirport = type === "Airport Transfer";
  const fareKES = calculateFare(from, to, isAirport);
  const { label: duration } = getTravelTime(from, to, isAirport);

  const trips = departures.map(t => ({
    ...t,
    arr: getArrivalTime(t.dep, from, to, isAirport),
    dur: duration,
    fare: fareKES + (t.premium ? 500 : 0),
  }));

  return (
    <div style={{ minHeight: "100vh", background: "#0A1628", paddingTop: 88, paddingBottom: 64 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 0" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(232,244,253,0.45)", fontSize: 13, marginBottom: 10 }}>
            <span>{from}</span><ChevronRight size={13} /><span>{to}</span>
            <span style={{ opacity: 0.4 }}>•</span><span>{date}</span>
            <span style={{ opacity: 0.4 }}>•</span><span>{pax} passenger{Number(pax) > 1 ? "s" : ""}</span>
            <span style={{ opacity: 0.4 }}>•</span><span style={{ color: "#06B6D4" }}>{duration} journey</span>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, color: "white" }}>{trips.length} trips available</h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {trips.map(t => (
            <div key={t.id} onClick={() => setSel(t.id === sel ? null : t.id)}
              style={{ background: "rgba(26,47,74,0.6)", border: `1px solid ${sel === t.id ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.07)"}`, borderRadius: 18, padding: "22px 24px", cursor: "pointer", transition: "border-color 0.2s", boxShadow: sel === t.id ? "0 0 24px rgba(6,182,212,0.12)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 700, color: "white" }}>{t.dep}</div>
                    <div style={{ color: "rgba(232,244,253,0.4)", fontSize: 12 }}>{from.split("(")[0].trim()}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "rgba(232,244,253,0.35)", fontSize: 12, marginBottom: 4 }}>{t.dur}</div>
                    <div style={{ width: 80, height: 1, background: "linear-gradient(90deg,#1D4ED8,#06B6D4)", position: "relative" }}>
                      <div style={{ position: "absolute", right: -4, top: -3, width: 7, height: 7, borderRadius: "50%", background: "#06B6D4" }} />
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 700, color: "white" }}>{t.arr}</div>
                    <div style={{ color: "rgba(232,244,253,0.4)", fontSize: 12 }}>{to.split("(")[0].trim()}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {t.amenities.map(a => (
                      <span key={a} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 9px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, fontSize: 11, color: "rgba(232,244,253,0.5)" }}>
                        {amenityIcons[a]}{a}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(232,244,253,0.45)", fontSize: 13 }}><Users size={13} />{t.seats} left</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#F59E0B", fontSize: 13 }}><Star size={12} fill="#F59E0B" />{t.rating}</div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: "white" }}>{format(t.fare)}</div>
                    <div style={{ color: "rgba(232,244,253,0.3)", fontSize: 11 }}>per seat</div>
                  </div>
                  <button style={{ padding: "10px 20px", borderRadius: 12, background: sel === t.id ? "linear-gradient(135deg,#10B981,#06B6D4)" : "linear-gradient(135deg,#1D4ED8,#06B6D4)", border: "none", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                    {sel === t.id ? <><CheckCircle size={14} />Selected</> : "Select"}
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: "linear-gradient(135deg,#1D4ED8,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>G</span>
                  </div>
                  <span style={{ color: "rgba(232,244,253,0.45)", fontSize: 12 }}>{t.name}</span>
                  {t.premium && <span style={{ padding: "2px 8px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 6, fontSize: 11, color: "#F59E0B" }}>Premium</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#06B6D4", fontSize: 12 }}><Clock size={11} />Departs at {t.dep}</div>
              </div>
            </div>
          ))}
        </div>

        {sel && (
          <div style={{ marginTop: 20, background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 16, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: "white", fontWeight: 600 }}>1 trip selected</div>
              <div style={{ color: "rgba(232,244,253,0.45)", fontSize: 13 }}>Total: {format((trips.find(t => t.id === sel)?.fare || fareKES) * Number(pax) * tripMultiplier)}{type === "Round Trip" ? " (round trip)" : ""}</div>
            </div>
            <Link href={`/booking?trip=${sel}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&pax=${pax}&type=${encodeURIComponent(type)}&date=${date}&dep=${trips.find(t => t.id === sel)?.dep || "06:00"}&fare=${trips.find(t => t.id === sel)?.fare || fareKES}${type === "Round Trip" ? `&returnDate=${returnDate}` : ""}`}
              style={{ padding: "12px 24px", borderRadius: 12, background: "linear-gradient(135deg,#1D4ED8,#06B6D4)", color: "white", fontWeight: 600, textDecoration: "none", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
              Continue <ChevronRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0A1628", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(232,244,253,0.5)" }}>Loading trips...</div>}>
      <Results />
    </Suspense>
  );
}
