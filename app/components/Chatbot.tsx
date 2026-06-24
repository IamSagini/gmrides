"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";

interface Msg { role: "user"|"assistant"; content: string; }

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: "Hi! I'm the GM Rides assistant. Ask me about routes, fares, booking, or anything about our services across Kenya." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api";
  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    const next = [...msgs, { role: "user" as const, content: msg }];
    setMsgs(next);
    setLoading(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m, i) => !(i === 0 && m.role === "assistant")).map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMsgs(p => [...p, { role: "assistant", content: data.reply || "Sorry, try again." }]);
    } catch { setMsgs(p => [...p, { role: "assistant", content: "Connection error. Please try again." }]); }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999 }}>
      {open && (
        <div style={{ marginBottom: 12, width: 340, background: "#0F1E35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", height: 420 }}>
          <div style={{ background: "linear-gradient(135deg, #1D4ED8, #06B6D4)", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}><Bot size={15} color="white" /></div>
              <div>
                <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>GM Rides Assistant</div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>Always online</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer" }}><X size={17} /></button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", fontSize: 13, lineHeight: 1.5,
                  background: m.role === "user" ? "linear-gradient(135deg, #1D4ED8, #06B6D4)" : "rgba(255,255,255,0.06)", color: "white", border: m.role === "assistant" ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex" }}>
                <div style={{ padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <Loader2 size={14} color="#06B6D4" style={{ animation: "spin 1s linear infinite" }} />
                </div>
              </div>
            )}
            <div ref={ref} />
          </div>
          <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask anything..." className="input-field" style={{ flex: 1, padding: "9px 14px", fontSize: 13 }} />
            <button onClick={send} disabled={loading || !input.trim()}
              style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #1D4ED8, #06B6D4)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: (!input.trim() || loading) ? 0.4 : 1 }}>
              <Send size={13} color="white" />
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="chatbot-btn">
        {open ? <X size={22} color="white" /> : <MessageCircle size={22} color="white" />}
        {!open && <span style={{ position: "absolute", top: 2, right: 2, width: 10, height: 10, background: "#10B981", borderRadius: "50%", border: "2px solid #0A1628" }} />}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
