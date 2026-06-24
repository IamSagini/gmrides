"use client";
import { useState } from "react";
import { Mail, MessageCircle, Clock } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A1628", paddingTop: 88 }}>
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ color: "#06B6D4", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>Get in Touch</span>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, color: "white", marginTop: 14, marginBottom: 16 }}>Contact Us</h1>
            <p style={{ color: "rgba(232,244,253,0.5)", maxWidth: 500, margin: "0 auto" }}>Have a question or need help with a booking? We are here for you 24/7.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, alignItems: "start" }}>
            <div>
              {[
                { icon: Mail, title: "Email Us", desc: "hello@gmrides.net", sub: "We respond within 2 hours", color: "#06B6D4" },
                { icon: MessageCircle, title: "Live Chat", desc: "Use the chat bubble", sub: "Bottom right of any page", color: "#10B981" },
                { icon: Clock, title: "Support Hours", desc: "24 hours, 7 days a week", sub: "Always here for you", color: "#818CF8" },
              ].map(item => (
                <div key={item.title} style={{ display: "flex", gap: 16, marginBottom: 32 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 13, background: `${item.color}20`, border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <item.icon size={20} color={item.color} />
                  </div>
                  <div>
                    <h3 style={{ color: "white", fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{item.title}</h3>
                    <p style={{ color: item.color, fontSize: 14, marginBottom: 2 }}>{item.desc}</p>
                    <p style={{ color: "rgba(232,244,253,0.4)", fontSize: 13 }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: 36 }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#10B981,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                    <Mail size={32} color="white" />
                  </div>
                  <h3 style={{ color: "white", fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Message Sent!</h3>
                  <p style={{ color: "rgba(232,244,253,0.5)", fontSize: 15 }}>We will get back to you at {email} within 2 hours.</p>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: "white", marginBottom: 28 }}>Send a Message</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div>
                      <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 13, marginBottom: 8 }}>Your Name</label>
                      <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" className="input-field" required />
                    </div>
                    <div>
                      <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 13, marginBottom: 8 }}>Email Address</label>
                      <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="your@email.com" className="input-field" required />
                    </div>
                    <div>
                      <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 13, marginBottom: 8 }}>Message</label>
                      <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="How can we help you?" rows={5}
                        className="input-field" style={{ resize: "vertical", minHeight: 120 }} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ fontSize: 15, padding: "14px" }}>Send Message</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
