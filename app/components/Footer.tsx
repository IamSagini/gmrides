"use client";
import Link from "next/link";
import GmLogo from "./GmLogo";
import { Bus, Mail } from "lucide-react";

export default function Footer() {
  const services = ["Intercity Travel","Airport Transfers","Private Hire","Wedding Convoys","Corporate Travel","Group Bookings"];
  const links = ["Home","About","Gallery","Contact","My Account"];
  return (
    <footer style={{ background: "#060F1E", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 40px", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <GmLogo size={36} radius={9} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "white", fontSize: 18 }}>GM Rides</span>
          </div>
          <p style={{ color: "rgba(232,244,253,0.4)", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>Your journey, your comfort. Premium transport across Kenya — book in seconds, travel in style.</p>
          <div style={{ display: "flex", gap: 8 }}>
            {["M-Pesa","Stripe","PayPal"].map(p => (
              <span key={p} style={{ padding: "4px 10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, fontSize: 12, color: "rgba(232,244,253,0.5)" }}>{p}</span>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ color: "rgba(232,244,253,0.9)", fontWeight: 600, fontSize: 13, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Our Services</h4>
          {services.map(s => (
            <div key={s} style={{ marginBottom: 10 }}>
              <span style={{ color: "rgba(232,244,253,0.4)", fontSize: 13 }}>{s}</span>
            </div>
          ))}
        </div>
        <div>
          <h4 style={{ color: "rgba(232,244,253,0.9)", fontWeight: 600, fontSize: 13, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Quick Links</h4>
          {links.map(l => (
            <div key={l} style={{ marginBottom: 10 }}>
              <Link href={l === "Home" ? "/" : `/${l.toLowerCase().replace(" ", "-")}`} style={{ color: "rgba(232,244,253,0.4)", fontSize: 13, textDecoration: "none" }}>{l}</Link>
            </div>
          ))}
        </div>
        <div>
          <h4 style={{ color: "rgba(232,244,253,0.9)", fontWeight: 600, fontSize: 13, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Get in Touch</h4>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Mail size={13} color="#06B6D4" />
            <span style={{ color: "rgba(232,244,253,0.45)", fontSize: 13 }}>hello@gmrides.net</span>
          </div>
          <p style={{ color: "rgba(232,244,253,0.3)", fontSize: 13, lineHeight: 1.6 }}>Available 24/7 for bookings and support.</p>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "rgba(232,244,253,0.25)", fontSize: 12 }}>© 2026 GM Rides. Built by <a href="https://sagini.me" target="_blank" rel="noopener noreferrer" style={{ color: "#06B6D4", textDecoration: "none" }}>Sagini Technologies</a>.</p>
          <div style={{ display: "flex", gap: 20 }}>
            {[{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms", href: "/terms" }, { label: "Refund Policy", href: "/refund" }].map(l => (
              <Link key={l.label} href={l.href} style={{ color: "rgba(232,244,253,0.25)", fontSize: 12, textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
