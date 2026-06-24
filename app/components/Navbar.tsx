"use client";
import { useState } from "react";
import GmLogo from "./GmLogo";
import Link from "next/link";
import { Menu, X, Globe, ChevronDown, Bus } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showCurr, setShowCurr] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const currencies = ["KES","GBP","USD","EUR"];

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,22,40,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, padding: "0 24px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ boxShadow: "0 0 20px rgba(29,78,216,0.4)", borderRadius: 10 }}>
            <GmLogo size={38} radius={10} />
          </div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "white", fontSize: 18, lineHeight: 1 }}>GM</div>
            <div style={{ color: "#06B6D4", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", lineHeight: 1 }}>Rides</div>
          </div>
        </Link>

        <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="hidden-mobile">
          {navLinks.map(l => (
            <Link key={l.label} href={l.href} style={{ color: "rgba(232,244,253,0.65)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>{l.label}</Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="hidden-mobile">
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowCurr(!showCurr)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 12px", color: "rgba(232,244,253,0.8)", fontSize: 13, cursor: "pointer" }}>
              <Globe size={13} /> {currency} <ChevronDown size={11} />
            </button>
            {showCurr && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#0F1E35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", minWidth: 90, zIndex: 200 }}>
                {currencies.map(c => (
                  <button key={c} onClick={() => { setCurrency(c); setShowCurr(false); }}
                    style={{ width: "100%", textAlign: "left", padding: "10px 16px", fontSize: 13, color: c === currency ? "#06B6D4" : "rgba(232,244,253,0.7)", background: "none", border: "none", cursor: "pointer" }}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link href="/account" className="btn-primary" style={{ fontSize: 14, padding: "9px 20px", textDecoration: "none" }}>My Account</Link>
        </div>

        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", display: "none" }} className="show-mobile">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div style={{ background: "rgba(10,22,40,0.97)", padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {navLinks.map(l => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)}
              style={{ display: "block", color: "rgba(232,244,253,0.7)", textDecoration: "none", fontSize: 15, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              {l.label}
            </Link>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <Link href="/account" className="btn-primary" style={{ flex: 1, textAlign: "center", textDecoration: "none", fontSize: 14 }}>My Account</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } .show-mobile { display: block !important; } }
      `}</style>
    </nav>
  );
}
