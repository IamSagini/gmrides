import { Shield, Star, Clock, CreditCard, Bus, Users, Code2, Zap } from "lucide-react";

export default function AboutPage() {
  const values = [
    { icon: Shield, title: "Safety First", desc: "Every vehicle is inspected and every driver certified before hitting the road.", color: "#10B981" },
    { icon: Star, title: "Comfort", desc: "Modern 7-seater vehicles with air conditioning, Wi-Fi, and power outlets.", color: "#F59E0B" },
    { icon: Clock, title: "Reliability", desc: "Punctuality is our promise. We get you there on time, every time.", color: "#06B6D4" },
    { icon: CreditCard, title: "Affordability", desc: "Competitive fares with no hidden charges. What you see is what you pay.", color: "#818CF8" },
  ];

  const team = [
    { name: "Enoch Sagini", role: "Founder & CEO", icon: Code2, color: "#06B6D4", desc: "Senior Full-Stack Developer and AI Engineer behind GM Rides. Enoch built the platform from the ground up with a vision to modernise transport across Kenya and serve the diaspora globally." },
    { name: "Operations Team", role: "Fleet & Logistics", icon: Bus, color: "#10B981", desc: "Ensuring every journey is safe, comfortable, and on time across all routes." },
    { name: "Support Team", role: "Customer Experience", icon: Zap, color: "#F59E0B", desc: "Available 24/7 to assist with bookings, queries, and any travel needs." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0A1628", paddingTop: 88 }}>

      {/* Hero */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(135deg, #0A1628, #0F2040)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "rgba(29,78,216,0.1)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: "rgba(6,182,212,0.08)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <span style={{ color: "#06B6D4", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>Our Story</span>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px,6vw,64px)", fontWeight: 700, color: "white", margin: "16px 0 24px", lineHeight: 1.1 }}>
            Driven by Comfort,<br />
            <span style={{ background: "linear-gradient(135deg,#06B6D4,#1D4ED8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Powered by Trust.</span>
          </h1>
          <p style={{ color: "rgba(232,244,253,0.6)", fontSize: 18, lineHeight: 1.7, maxWidth: 620 }}>
            GM Rides was built from a simple belief — that every Kenyan deserves safe, comfortable, and affordable transport. We built the platform we wished existed.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: "80px 24px", background: "#0C1829" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 60, alignItems: "center" }}>
          <div>
            <span style={{ color: "#06B6D4", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>Our Mission</span>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "white", margin: "16px 0 20px" }}>Making Kenya Move Smarter</h2>
            <p style={{ color: "rgba(232,244,253,0.55)", fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
              We connect travellers to drivers across Kenya through a seamless booking experience. Whether you are heading upcountry, catching a flight, or planning a wedding convoy — GM Rides has you covered.
            </p>
            <p style={{ color: "rgba(232,244,253,0.55)", fontSize: 16, lineHeight: 1.8 }}>
              Our platform supports M-Pesa, card, and PayPal payments in multiple currencies, making it accessible to Kenyans at home and in the diaspora worldwide.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { num: "50+", label: "Towns Covered" },
              { num: "10K+", label: "Happy Travellers" },
              { num: "99%", label: "On-Time Rate" },
              { num: "24/7", label: "Support" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24, textAlign: "center" }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 32, fontWeight: 700, background: "linear-gradient(135deg,#06B6D4,#1D4ED8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.num}</div>
                <div style={{ color: "rgba(232,244,253,0.45)", fontSize: 13, marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "80px 24px", background: "#0A1628" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ color: "#06B6D4", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>What We Stand For</span>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "white", marginTop: 14 }}>Our Core Values</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {values.map(v => (
              <div key={v.title} style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: `${v.color}20`, border: `1px solid ${v.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <v.icon size={22} color={v.color} />
                </div>
                <h3 style={{ color: "white", fontWeight: 600, fontSize: 17, marginBottom: 10 }}>{v.title}</h3>
                <p style={{ color: "rgba(232,244,253,0.48)", fontSize: 14, lineHeight: 1.65 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: "80px 24px", background: "#0C1829" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ color: "#06B6D4", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>The People</span>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "white", marginTop: 14 }}>Behind GM Rides</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {team.map(t => (
              <div key={t.name} style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 32, textAlign: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${t.color}40, ${t.color}20)`, border: `2px solid ${t.color}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <t.icon size={32} color={t.color} />
                </div>
                <h3 style={{ color: "white", fontWeight: 700, fontSize: 19, marginBottom: 6 }}>{t.name}</h3>
                <p style={{ color: t.color, fontSize: 13, fontWeight: 600, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.role}</p>
                <p style={{ color: "rgba(232,244,253,0.48)", fontSize: 14, lineHeight: 1.7 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
