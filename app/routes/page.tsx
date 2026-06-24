"use client";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

const groups = [
  { region: "Nairobi Routes", accent: "#06B6D4", routes: ["Nairobi → Kisii","Nairobi → Kisumu","Nairobi → Mombasa","Nairobi → Nakuru","Nairobi → Eldoret","Nairobi → Homabay","Nairobi → Migori","Nairobi → Kericho","Nairobi → Bomet","Nairobi → Narok","Nairobi → Bungoma","Nairobi → Kakamega"] },
  { region: "Nyanza & Western", accent: "#10B981", routes: ["Kisii → Mombasa","Kisii → Kisumu","Kisumu → Eldoret","Kisumu → Mombasa","Migori → Nairobi","Homabay → Kisumu","Rongo → Nairobi","Awendo → Kisumu","Oyugis → Nairobi","Keroka → Kisii","Mbita → Kisumu","Kendu Bay → Nairobi"] },
  { region: "Coast & Eastern", accent: "#F59E0B", routes: ["Mombasa → Kisumu","Mombasa → Nairobi","Mombasa → Kisii","Malindi → Nairobi","Kilifi → Mombasa","Voi → Nairobi","Machakos → Nairobi","Embu → Nairobi","Nyeri → Nairobi","Meru → Nairobi","Nanyuki → Nairobi","Isiolo → Nairobi"] },
  { region: "Airport Transfers", accent: "#818CF8", routes: ["JKIA → CBD Nairobi","Wilson Airport → Westlands","JKIA → Thika Road","Kisumu Airport → CBD","Moi Int'l → Mombasa CBD","JKIA → Karen","JKIA → Langata","Wilson → South C","JKIA → Westlands","JKIA → Gigiri","JKIA → Runda","JKIA → Kitisuru"] },
];

export default function RoutesPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0A1628", paddingTop: 88, paddingBottom: 64 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", padding: "56px 0 52px" }}>
          <span style={{ color: "#06B6D4", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>50+ Destinations</span>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(32px,6vw,52px)", fontWeight: 700, color: "white", margin: "14px 0 16px" }}>All Routes</h1>
          <p style={{ color: "rgba(232,244,253,0.45)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>From Nairobi to the coast, upcountry, and everywhere in between. GM Rides covers Kenya.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(480px,1fr))", gap: 20 }}>
          {groups.map(g => (
            <div key={g.region} style={{ background: "rgba(26,47,74,0.6)", border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 20, overflow: "hidden" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: `${g.accent}10` }}>
                <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 17, fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: 8 }}>
                  <MapPin size={16} color={g.accent} />{g.region}
                </h2>
              </div>
              <div style={{ padding: "8px 12px" }}>
                {g.routes.map(r => {
                  const [f, t] = r.split(" → ");
                  return (
                    <Link key={r} href={`/?from=${encodeURIComponent(f)}&to=${encodeURIComponent(t)}`}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: 10, textDecoration: "none", transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <span style={{ color: "rgba(232,244,253,0.65)", fontSize: 14 }}>{r}</span>
                      <ArrowRight size={13} color="rgba(232,244,253,0.2)" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
