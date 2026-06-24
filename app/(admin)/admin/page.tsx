"use client";
import { useState, useEffect } from "react";
import GmLogo from "../../components/GmLogo";
import Link from "next/link";
import { LayoutDashboard, BookOpen, MapPin, Settings, LogOut, TrendingUp, Users, CreditCard, Clock, CheckCircle, Bus, Plus, Trash2, Edit, Menu, X, Bell, Eye, EyeOff, FileText } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: BookOpen },
  { id: "users", label: "Users", icon: Users },
  { id: "destinations", label: "Destinations", icon: MapPin },
  { id: "pages", label: "Pages", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

const kenyanDestinations = [
  { name: "Maasai Mara", location: "Narok County", tag: "Wildlife", from: "Nairobi", to: "Narok" },
  { name: "Diani Beach", location: "Kwale County", tag: "Beach", from: "Mombasa", to: "Ukunda Airstrip (UKA) - Diani" },
  { name: "Mount Kenya", location: "Central Kenya", tag: "Adventure", from: "Nairobi", to: "Nanyuki" },
  { name: "Lake Nakuru", location: "Nakuru County", tag: "Wildlife", from: "Nairobi", to: "Nakuru" },
  { name: "Amboseli", location: "Kajiado County", tag: "Wildlife", from: "Nairobi", to: "Narok" },
  { name: "Lamu Island", location: "Lamu County", tag: "Culture", from: "Nairobi", to: "Malindi" },
  { name: "Tsavo", location: "Coast & Eastern", tag: "Wildlife", from: "Nairobi", to: "Voi" },
  { name: "Kisumu", location: "Nyanza", tag: "Nature", from: "Nairobi", to: "Kisumu" },
];

export default function AdminPage() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, revenue: 0 });
  const [adminCurrency, setAdminCurrency] = useState("KES");
  const adminRates: Record<string, number> = { KES: 1, GBP: 0.0058, USD: 0.0077, EUR: 0.0071 };
  const adminSymbols: Record<string, string> = { KES: "KES", GBP: "£", USD: "$", EUR: "€" };
  const fmtMoney = (kes: number) => {
    const v = (Number(kes) || 0) * (adminRates[adminCurrency] || 1);
    const sym = adminSymbols[adminCurrency] || adminCurrency;
    return `${sym} ${v % 1 === 0 ? v.toLocaleString() : v.toFixed(2)}`;
  };

  // ---- Page content editor state ----
  const [pageSlug, setPageSlug] = useState("privacy");
  const [pageTitle, setPageTitle] = useState("");
  const [pageSections, setPageSections] = useState<{ h: string; p: string[] }[]>([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageSaving, setPageSaving] = useState(false);
  const [pageMsg, setPageMsg] = useState("");

  const loadPage = async (slug: string) => {
    setPageLoading(true);
    setPageMsg("");
    try {
      const res = await fetch(`${API}/pages/${slug}`);
      const data = await res.json();
      if (data.success && data.page) {
        setPageTitle(data.page.title);
        setPageSections(data.page.sections || []);
      }
    } catch { setPageMsg("Failed to load page"); }
    setPageLoading(false);
  };

  useEffect(() => { if (active === "pages") loadPage(pageSlug); }, [active, pageSlug]);

  const updateSectionHeading = (i: number, val: string) => {
    setPageSections(prev => prev.map((s, idx) => idx === i ? { ...s, h: val } : s));
  };
  const updateParagraph = (si: number, pi: number, val: string) => {
    setPageSections(prev => prev.map((s, idx) => idx === si ? { ...s, p: s.p.map((para, pidx) => pidx === pi ? val : para) } : s));
  };
  const addParagraph = (si: number) => {
    setPageSections(prev => prev.map((s, idx) => idx === si ? { ...s, p: [...s.p, ""] } : s));
  };
  const removeParagraph = (si: number, pi: number) => {
    setPageSections(prev => prev.map((s, idx) => idx === si ? { ...s, p: s.p.filter((_, pidx) => pidx !== pi) } : s));
  };
  const addSection = () => setPageSections(prev => [...prev, { h: "New Section", p: [""] }]);
  const removeSection = (si: number) => setPageSections(prev => prev.filter((_, idx) => idx !== si));

  const savePage = async () => {
    setPageSaving(true);
    setPageMsg("");
    try {
      const token = localStorage.getItem("gmrides_token");
      const res = await fetch(`${API}/admin/pages/${pageSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`, "Accept": "application/json" },
        body: JSON.stringify({ title: pageTitle, sections: pageSections }),
      });
      const data = await res.json();
      if (data.success) { setPageMsg("Saved"); } else { setPageMsg(data.message || "Save failed"); }
    } catch { setPageMsg("Save failed"); }
    setPageSaving(false);
  };
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [destForm, setDestForm] = useState<any>({ name: "", location: "", from_location: "", to_location: "", description: "", image_url: "", tag: "" });
  const [editingDest, setEditingDest] = useState<number | null>(null);
  const [showDestForm, setShowDestForm] = useState(false);
  const [savingDest, setSavingDest] = useState(false);
  const [siteSettings, setSiteSettings] = useState({ support_email: "", brand_name: "", website: "" });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState("");
  const [pwForm, setPwForm] = useState({ current_password: "", new_password: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwShow, setPwShow] = useState<any>({ current_password: false, new_password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rates, setRates] = useState({ base_rate: "", airport_base: "", airport_rate: "" });
  const [savingRates, setSavingRates] = useState(false);
  const [rateMsg, setRateMsg] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("gmrides_user");
    if (u) {
      const parsed = JSON.parse(u);
      if (parsed.isAdmin) { setAuthed(true); loadData(); loadRates(); }
      else window.location.href = "/account";
    } else {
      window.location.href = "/account";
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/bookings`, { headers: { Authorization: `Bearer ${localStorage.getItem("gmrides_token")}` } });
      const data = await res.json();
      if (data.success) {
        const all = data.bookings;
        setBookings(all);
        const confirmed = all.filter((b: any) => b.status === "confirmed");
        const pending = all.filter((b: any) => b.status === "pending");
        const revenue = confirmed.reduce((sum: number, b: any) => sum + Number(b.total_kes), 0);
        setStats({ total: all.length, confirmed: confirmed.length, pending: pending.length, revenue });
        const days: { date: string; count: number }[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(); d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split("T")[0];
          const count = all.filter((b: any) => b.created_at?.startsWith(dateStr)).length;
          days.push({ date: dateStr.slice(5), count });
        }
        setChartData(days);
      }
      const ures = await fetch(`${API}/admin/users`, { headers: { Authorization: `Bearer ${localStorage.getItem("gmrides_token")}` } });
      const udata = await ures.json();
      if (udata.success) setUsers(udata.users);
      const dres = await fetch(`${API}/destinations`);
      const ddata = await dres.json();
      if (ddata.success) setDestinations(ddata.destinations);
      const sres = await fetch(`${API}/site-settings`);
      const sdata = await sres.json();
      if (sdata.success) setSiteSettings(sdata.settings);
    } catch {}
    setLoading(false);
  };

  const openAddDest = () => {
    setEditingDest(null);
    setDestForm({ name: "", location: "", from_location: "", to_location: "", description: "", image_url: "", tag: "" });
    setShowDestForm(true);
  };
  const openEditDest = (d: any) => {
    setEditingDest(d.id);
    setDestForm({ name: d.name || "", location: d.location || "", from_location: d.from_location || "", to_location: d.to_location || "", description: d.description || "", image_url: d.image_url || "", tag: d.tag || "" });
    setShowDestForm(true);
  };
  const saveDestination = async () => {
    if (!destForm.name) return;
    setSavingDest(true);
    try {
      const token = localStorage.getItem("gmrides_token");
      const url = editingDest ? `${API}/admin/destinations/${editingDest}` : `${API}/admin/destinations`;
      const method = editingDest ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(destForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowDestForm(false);
        setEditingDest(null);
        await loadData();
      }
    } catch {}
    setSavingDest(false);
  };
  const deleteDestination = async (id: number) => {
    if (!confirm("Delete this destination? This will remove it from the public gallery too.")) return;
    try {
      const token = localStorage.getItem("gmrides_token");
      const res = await fetch(`${API}/admin/destinations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) await loadData();
    } catch {}
  };
  const loadRates = async () => {
    try {
      const res = await fetch(`${API}/fares`);
      const data = await res.json();
      if (data.success) setRates({
        base_rate: String(data.rates.base_rate),
        airport_base: String(data.rates.airport_base),
        airport_rate: String(data.rates.airport_rate),
      });
    } catch {}
  };

  const saveRates = async () => {
    setSavingRates(true); setRateMsg("");
    try {
      const res = await fetch(`${API}/admin/fares`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("gmrides_token")}` },
        body: JSON.stringify({
          base_rate: Number(rates.base_rate),
          airport_base: Number(rates.airport_base),
          airport_rate: Number(rates.airport_rate),
        }),
      });
      const data = await res.json();
      setRateMsg(data.success ? "Fares updated. Changes are live on the booking site." : "Failed to save.");
    } catch { setRateMsg("Failed to save."); }
    setSavingRates(false);
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    setSettingsMsg("");
    try {
      const res = await fetch(`${API}/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("gmrides_token")}` },
        body: JSON.stringify(siteSettings),
      });
      const data = await res.json();
      if (data.success) setSettingsMsg("Settings saved");
      else setSettingsMsg("Could not save settings");
    } catch {
      setSettingsMsg("Could not save settings");
    }
    setSavingSettings(false);
  };
  const changePassword = async () => {
    setPwMsg("");
    if (!pwForm.current_password || !pwForm.new_password) { setPwMsg("Fill in all fields"); return; }
    if (pwForm.new_password.length < 6) { setPwMsg("New password must be at least 6 characters"); return; }
    if (pwForm.new_password !== pwForm.confirm) { setPwMsg("New passwords do not match"); return; }
    setSavingPw(true);
    try {
      const res = await fetch(`${API}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("gmrides_token")}` },
        body: JSON.stringify({ current_password: pwForm.current_password, new_password: pwForm.new_password }),
      });
      const data = await res.json();
      if (data.success) {
        setPwMsg("Password updated");
        setPwForm({ current_password: "", new_password: "", confirm: "" });
      } else {
        setPwMsg(data.message || "Could not change password");
      }
    } catch {
      setPwMsg("Could not change password");
    }
    setSavingPw(false);
  };
  const logout = () => {
    localStorage.removeItem("gmrides_user");
    localStorage.removeItem("gmrides_token");
    window.location.href = "/";
  };

  if (!authed) return <div style={{ minHeight: "100vh", background: "#060F1E", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: "rgba(232,244,253,0.4)", fontSize: 14 }}>Loading...</div></div>;

  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#060F1E" }}>

      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 260 : 72, background: "#0A1628", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", transition: "width 0.3s", flexShrink: 0, position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 100, overflow: "hidden" }}>
        {/* Logo */}
        <Link href="/" style={{ padding: "20px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div style={{ flexShrink: 0, boxShadow: "0 0 20px rgba(29,78,216,0.4)", borderRadius: 10 }}>
            <GmLogo size={38} radius={10} />
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: "white", fontSize: 16, lineHeight: 1 }}>GM Rides</div>
              <div style={{ color: "#06B6D4", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 3 }}>Admin Panel</div>
            </div>
          )}
        </Link>

        {/* Nav */}
        <div style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, border: "none", cursor: "pointer", transition: "all 0.2s", textAlign: "left", width: "100%",
                background: active === item.id ? "rgba(29,78,216,0.15)" : "transparent",
                color: active === item.id ? "#06B6D4" : "rgba(232,244,253,0.5)",
                borderLeft: active === item.id ? "2px solid #06B6D4" : "2px solid transparent" }}>
              <item.icon size={18} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap" }}>{item.label}</span>}
            </button>
          ))}
        </div>


      </div>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 260 : 72, transition: "margin-left 0.3s", display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <div style={{ height: 64, background: "#0A1628", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: "none", border: "none", color: "rgba(232,244,253,0.5)", cursor: "pointer", display: "flex" }}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 600, color: "white" }}>
              {navItems.find(n => n.id === active)?.label}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <select value={adminCurrency} onChange={e => setAdminCurrency(e.target.value)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", fontSize: 13, padding: "7px 10px", cursor: "pointer", outline: "none" }}>
              {["KES", "GBP", "USD", "EUR"].map(c => <option key={c} value={c} style={{ background: "#0A1628" }}>{c}</option>)}
            </select>
            <div style={{ position: "relative" }}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#1D4ED8,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>ES</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>Enoch Sagini</span>
                  <span style={{ color: "rgba(232,244,253,0.4)", fontSize: 11 }}>Administrator</span>
                </div>
              </button>
              {menuOpen && (
                <>
                  <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90 }} />
                  <div style={{ position: "absolute", top: 48, right: 0, width: 180, background: "#0A1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 6, zIndex: 100, boxShadow: "0 12px 32px rgba(0,0,0,0.5)" }}>
                    <button onClick={() => { setActive("settings"); setMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: "none", color: "rgba(232,244,253,0.8)", fontSize: 14, cursor: "pointer", textAlign: "left" }}>
                      <Settings size={16} /> Settings
                    </button>
                    <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: "none", color: "#EF4444", fontSize: 14, cursor: "pointer", textAlign: "left" }}>
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>

          {/* DASHBOARD */}
          {active === "dashboard" && (
            <div>
              <p style={{ color: "rgba(232,244,253,0.45)", fontSize: 14, marginBottom: 28 }}>GM Rides Overview</p>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
                {[
                  { icon: BookOpen, label: "Total Bookings", value: stats.total, color: "#06B6D4", sub: "All time" },
                  { icon: CheckCircle, label: "Confirmed", value: stats.confirmed, color: "#10B981", sub: "Paid bookings" },
                  { icon: Clock, label: "Pending", value: stats.pending, color: "#F59E0B", sub: "Awaiting payment" },
                  { icon: CreditCard, label: `Revenue (${adminCurrency})`, value: fmtMoney(stats.revenue), color: "#818CF8", sub: "Confirmed only" },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 22 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <span style={{ color: "rgba(232,244,253,0.45)", fontSize: 13 }}>{s.label}</span>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: `${s.color}20`, border: `1px solid ${s.color}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <s.icon size={16} color={s.color} />
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 30, fontWeight: 700, color: "white", marginBottom: 4 }}>{s.value}</div>
                    <div style={{ color: "rgba(232,244,253,0.3)", fontSize: 12 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 28, marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
                  <TrendingUp size={18} color="#06B6D4" />
                  <h2 style={{ color: "white", fontWeight: 600, fontSize: 16 }}>Bookings Trend — Last 7 Days</h2>
                </div>
                {(() => {
                  const W = 720, H = 180, padX = 30, padY = 24;
                  const n = chartData.length;
                  const innerW = W - padX * 2, innerH = H - padY * 2;
                  const xAt = (i: number) => n <= 1 ? padX + innerW / 2 : padX + (i / (n - 1)) * innerW;
                  const yAt = (c: number) => padY + innerH - (maxCount > 0 ? (c / maxCount) * innerH : 0);
                  const pts = chartData.map((d, i) => [xAt(i), yAt(d.count)] as const);
                  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
                  const areaPath = pts.length ? `${linePath} L${pts[pts.length-1][0].toFixed(1)},${padY+innerH} L${pts[0][0].toFixed(1)},${padY+innerH} Z` : "";
                  return (
                    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 180, overflow: "visible" }}>
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#1D4ED8" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(6,182,212,0.25)" />
                          <stop offset="100%" stopColor="rgba(6,182,212,0)" />
                        </linearGradient>
                      </defs>
                      {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}
                      <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                      {pts.map((p, i) => (
                        <g key={i}>
                          <circle cx={p[0]} cy={p[1]} r={4} fill="#06B6D4" stroke="#0A1628" strokeWidth={2} />
                          <text x={p[0]} y={p[1] - 12} textAnchor="middle" fill="rgba(232,244,253,0.55)" fontSize={11}>{chartData[i].count}</text>
                          <text x={p[0]} y={H - 4} textAnchor="middle" fill="rgba(232,244,253,0.35)" fontSize={11}>{chartData[i].date}</text>
                        </g>
                      ))}
                    </svg>
                  );
                })()}
              </div>

              {/* Recent bookings preview */}
              <div style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
                <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ color: "white", fontWeight: 600, fontSize: 16 }}>Recent Bookings</h2>
                  <button onClick={() => setActive("bookings")} style={{ color: "#06B6D4", fontSize: 13, background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>View all →</button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        {["Reference","Route","Passenger","Amount","Status"].map(h => (
                          <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "rgba(232,244,253,0.35)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0,5).map((b: any) => (
                        <tr key={b.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ padding: "14px 20px", color: "#06B6D4", fontSize: 13, fontWeight: 600 }}>{b.booking_reference}</td>
                          <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.7)", fontSize: 13, whiteSpace: "nowrap" }}>{b.from_location} → {b.to_location}</td>
                          <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.7)", fontSize: 13 }}>{b.passenger_name}</td>
                          <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.7)", fontSize: 13, whiteSpace: "nowrap" }}>{fmtMoney(Number(b.total_kes))}</td>
                          <td style={{ padding: "14px 20px" }}>
                            <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: b.status === "confirmed" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: b.status === "confirmed" ? "#10B981" : "#F59E0B", border: `1px solid ${b.status === "confirmed" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}` }}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* BOOKINGS */}
          {active === "bookings" && (
            <div>
              <p style={{ color: "rgba(232,244,253,0.45)", fontSize: 14, marginBottom: 28 }}>All bookings on the platform</p>
              <div style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
                <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ color: "white", fontWeight: 600, fontSize: 16 }}>All Bookings ({bookings.length})</h2>
                  <button onClick={loadData} style={{ color: "#06B6D4", fontSize: 13, background: "none", border: "none", cursor: "pointer" }}>Refresh</button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        {["Reference","Route","Passenger","Phone","Date","Seats","Amount","Status"].map(h => (
                          <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "rgba(232,244,253,0.35)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b: any) => (
                        <tr key={b.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ padding: "14px 20px", color: "#06B6D4", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>{b.booking_reference}</td>
                          <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.7)", fontSize: 13, whiteSpace: "nowrap" }}>{b.from_location} → {b.to_location}</td>
                          <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.7)", fontSize: 13 }}>{b.passenger_name}</td>
                          <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.5)", fontSize: 13 }}>{b.passenger_phone}</td>
                          <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.5)", fontSize: 13, whiteSpace: "nowrap" }}>{b.travel_date}</td>
                          <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.5)", fontSize: 13 }}>{Array.isArray(b.seats) ? b.seats.join(", ") : b.seats}</td>
                          <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.7)", fontSize: 13, whiteSpace: "nowrap" }}>{fmtMoney(Number(b.total_kes))}</td>
                          <td style={{ padding: "14px 20px" }}>
                            <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: b.status === "confirmed" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: b.status === "confirmed" ? "#10B981" : "#F59E0B", border: `1px solid ${b.status === "confirmed" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}` }}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* USERS */}
          {active === "users" && (
            <div>
              <p style={{ color: "rgba(232,244,253,0.45)", fontSize: 14, marginBottom: 28 }}>Registered users on the platform</p>
              <div style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
                <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ color: "white", fontWeight: 600, fontSize: 16 }}>All Users ({users.length})</h2>
                  <button onClick={loadData} style={{ color: "#06B6D4", fontSize: 13, background: "none", border: "none", cursor: "pointer" }}>Refresh</button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        {["Name","Email","Role","Bookings","Total Spent","Joined"].map(h => (
                          <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "rgba(232,244,253,0.35)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u: any) => {
                        const roleColor = u.role === "super_admin" ? "#F59E0B" : u.role === "admin" ? "#06B6D4" : "#10B981";
                        return (
                          <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <td style={{ padding: "14px 20px", color: "white", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>{u.name}</td>
                            <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.7)", fontSize: 13 }}>{u.email}</td>
                            <td style={{ padding: "14px 20px" }}>
                              <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: `${roleColor}22`, color: roleColor, border: `1px solid ${roleColor}44`, whiteSpace: "nowrap" }}>{u.role}</span>
                            </td>
                            <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.7)", fontSize: 13 }}>{u.bookings_count}</td>
                            <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.7)", fontSize: 13, whiteSpace: "nowrap" }}>{fmtMoney(Number(u.total_spent))}</td>
                            <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.5)", fontSize: 13, whiteSpace: "nowrap" }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}</td>
                          </tr>
                        );
                      })}
                      {users.length === 0 && (
                        <tr><td colSpan={6} style={{ padding: "24px 20px", textAlign: "center", color: "rgba(232,244,253,0.4)", fontSize: 13 }}>No users yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* DESTINATIONS */}
          {active === "destinations" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <p style={{ color: "rgba(232,244,253,0.45)", fontSize: 14 }}>Manage gallery destinations shown to users</p>
                <button onClick={openAddDest} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, background: "linear-gradient(135deg,#1D4ED8,#06B6D4)", border: "none", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  <Plus size={15} />Add Destination
                </button>
              </div>

              {showDestForm && (
                <div style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(6,182,212,0.25)", borderRadius: 18, padding: 24, marginBottom: 24 }}>
                  <h3 style={{ color: "white", fontWeight: 600, fontSize: 16, marginBottom: 18 }}>{editingDest ? "Edit Destination" : "Add Destination"}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 14 }}>
                    {[
                      { k: "name", label: "Name", ph: "Maasai Mara" },
                      { k: "tag", label: "Tag", ph: "Wildlife" },
                      { k: "location", label: "Location", ph: "Narok County" },
                      { k: "from_location", label: "From", ph: "Nairobi" },
                      { k: "to_location", label: "To", ph: "Narok" },
                      { k: "image_url", label: "Image URL", ph: "https://..." },
                    ].map(f => (
                      <div key={f.k}>
                        <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 12, marginBottom: 6 }}>{f.label}</label>
                        <input value={destForm[f.k]} onChange={e => setDestForm({ ...destForm, [f.k]: e.target.value })} placeholder={f.ph} className="input-field" style={{ fontSize: 14 }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 12, marginBottom: 6 }}>Description</label>
                    <textarea value={destForm.description} onChange={e => setDestForm({ ...destForm, description: e.target.value })} placeholder="Short description shown on the gallery card" rows={3} className="input-field" style={{ fontSize: 14, resize: "vertical" }} />
                  </div>
                  {destForm.image_url && (
                    <img src={destForm.image_url} alt="preview" style={{ width: 160, height: 90, objectFit: "cover", borderRadius: 10, marginBottom: 16, border: "1px solid rgba(255,255,255,0.1)" }} />
                  )}
                  <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={saveDestination} disabled={savingDest || !destForm.name} style={{ padding: "11px 22px", borderRadius: 10, background: "linear-gradient(135deg,#1D4ED8,#06B6D4)", border: "none", color: "white", fontSize: 14, fontWeight: 600, cursor: savingDest ? "wait" : "pointer", opacity: !destForm.name ? 0.5 : 1 }}>
                      {savingDest ? "Saving..." : editingDest ? "Update" : "Create"}
                    </button>
                    <button onClick={() => { setShowDestForm(false); setEditingDest(null); }} style={{ padding: "11px 22px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(232,244,253,0.7)", fontSize: 14, cursor: "pointer" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {destinations.map((d: any) => (
                  <div key={d.id} style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden" }}>
                    <div style={{ height: 120, background: "linear-gradient(135deg,rgba(29,78,216,0.2),rgba(6,182,212,0.1))", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      {d.image_url ? (
                        <img src={d.image_url} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <MapPin size={40} color="#06B6D4" strokeWidth={1.2} />
                      )}
                    </div>
                    <div style={{ padding: "16px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <h3 style={{ color: "white", fontWeight: 600, fontSize: 15 }}>{d.name}</h3>
                        {d.tag && <span style={{ padding: "2px 8px", borderRadius: 50, background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#06B6D4", fontSize: 11, fontWeight: 500 }}>{d.tag}</span>}
                      </div>
                      <p style={{ color: "rgba(232,244,253,0.4)", fontSize: 12, marginBottom: 14 }}>{d.location}{d.from_location ? ` · ${d.from_location} → ${d.to_location}` : ""}</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => openEditDest(d)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", borderRadius: 8, background: "rgba(29,78,216,0.1)", border: "1px solid rgba(29,78,216,0.2)", color: "#06B6D4", fontSize: 12, cursor: "pointer" }}>
                          <Edit size={13} />Edit
                        </button>
                        <button onClick={() => deleteDestination(d.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 12px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#EF4444", fontSize: 12, cursor: "pointer" }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {destinations.length === 0 && (
                  <p style={{ color: "rgba(232,244,253,0.4)", fontSize: 14 }}>No destinations yet. Click "Add Destination" to create one.</p>
                )}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {active === "settings" && (
            <div>
              <p style={{ color: "rgba(232,244,253,0.45)", fontSize: 14, marginBottom: 28 }}>Platform configuration and account settings</p>
              <div style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 18, padding: 24, marginBottom: 28 }}>
                <h3 style={{ color: "white", fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Fare Rates</h3>
                <p style={{ color: "rgba(232,244,253,0.4)", fontSize: 13, marginBottom: 20 }}>Adjust pricing. Changes apply instantly to search and booking.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 18 }}>
                  {[
                    { key: "base_rate", label: "Base Rate (KES per km)" },
                    { key: "airport_base", label: "Airport Base Fee (KES)" },
                    { key: "airport_rate", label: "Airport Rate (KES per km)" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: "block", color: "rgba(232,244,253,0.4)", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{f.label}</label>
                      <input type="number" step="0.1" value={(rates as any)[f.key]}
                        onChange={e => setRates({ ...rates, [f.key]: e.target.value })}
                        style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "11px 14px", color: "white", fontSize: 14, outline: "none" }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <button onClick={saveRates} disabled={savingRates}
                    style={{ padding: "11px 24px", borderRadius: 10, background: "linear-gradient(135deg,#1D4ED8,#06B6D4)", border: "none", color: "white", fontSize: 14, fontWeight: 600, cursor: savingRates ? "default" : "pointer", opacity: savingRates ? 0.6 : 1 }}>
                    {savingRates ? "Saving..." : "Save Fares"}
                  </button>
                  {rateMsg && <span style={{ color: rateMsg.includes("live") ? "#10B981" : "#EF4444", fontSize: 13 }}>{rateMsg}</span>}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
                <div style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 24 }}>
                  <label style={{ display: "block", color: "rgba(232,244,253,0.4)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Admin Email (login)</label>
                  <input value={(typeof window !== "undefined" && JSON.parse(localStorage.getItem("gmrides_user") || "{}").email) || "orareenoch@gmail.com"} readOnly style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "11px 14px", color: "rgba(232,244,253,0.5)", fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif", cursor: "not-allowed" }} />
                </div>
                {[
                  { key: "brand_name", label: "Brand Name", ph: "GM Rides" },
                  { key: "support_email", label: "Contact Email", ph: "hello@gmrides.net" },
                  { key: "website", label: "Website", ph: "gmrides.net" },
                ].map(s => (
                  <div key={s.key} style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 24 }}>
                    <label style={{ display: "block", color: "rgba(232,244,253,0.4)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>{s.label}</label>
                    <input value={(siteSettings as any)[s.key]} onChange={e => setSiteSettings({ ...siteSettings, [s.key]: e.target.value })} placeholder={s.ph} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "11px 14px", color: "white", fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif" }} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24 }}>
                <button onClick={saveSettings} disabled={savingSettings} style={{ padding: "12px 28px", borderRadius: 12, background: "linear-gradient(135deg,#1D4ED8,#06B6D4)", border: "none", color: "white", fontSize: 14, fontWeight: 600, cursor: savingSettings ? "wait" : "pointer" }}>
                  {savingSettings ? "Saving..." : "Save Settings"}
                </button>
                {settingsMsg && <span style={{ color: settingsMsg === "Settings saved" ? "#10B981" : "#EF4444", fontSize: 14 }}>{settingsMsg}</span>}
              </div>

              <div style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 18, padding: 24, marginTop: 28, maxWidth: 480 }}>
                <h3 style={{ color: "white", fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Change Password</h3>
                <p style={{ color: "rgba(232,244,253,0.4)", fontSize: 13, marginBottom: 20 }}>Update your admin account password.</p>
                {[
                  { key: "current_password", label: "Current Password" },
                  { key: "new_password", label: "New Password" },
                  { key: "confirm", label: "Confirm New Password" },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 12, marginBottom: 6 }}>{f.label}</label>
                    <div style={{ position: "relative" }}>
                      <input type={pwShow[f.key] ? "text" : "password"} value={(pwForm as any)[f.key]} onChange={e => setPwForm({ ...pwForm, [f.key]: e.target.value })} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "11px 40px 11px 14px", color: "white", fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif" }} />
                      <button type="button" onClick={() => setPwShow({ ...pwShow, [f.key]: !pwShow[f.key] })} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(232,244,253,0.4)", display: "flex" }}>
                        {pwShow[f.key] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 6 }}>
                  <button onClick={changePassword} disabled={savingPw} style={{ padding: "11px 24px", borderRadius: 10, background: "linear-gradient(135deg,#1D4ED8,#06B6D4)", border: "none", color: "white", fontSize: 14, fontWeight: 600, cursor: savingPw ? "wait" : "pointer" }}>
                    {savingPw ? "Updating..." : "Update Password"}
                  </button>
                  {pwMsg && <span style={{ color: pwMsg === "Password updated" ? "#10B981" : "#EF4444", fontSize: 14 }}>{pwMsg}</span>}
                </div>
              </div>
            </div>
          )}

          {active === "pages" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ s: "privacy", l: "Privacy Policy" }, { s: "terms", l: "Terms" }, { s: "refund", l: "Refund Policy" }].map(t => (
                    <button key={t.s} onClick={() => setPageSlug(t.s)} style={{ padding: "9px 16px", borderRadius: 9, border: "1px solid " + (pageSlug === t.s ? "#06B6D4" : "rgba(255,255,255,0.1)"), background: pageSlug === t.s ? "rgba(6,182,212,0.12)" : "transparent", color: pageSlug === t.s ? "#06B6D4" : "rgba(232,244,253,0.6)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{t.l}</button>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {pageMsg && <span style={{ color: pageMsg === "Saved" ? "#10B981" : "#EF4444", fontSize: 14 }}>{pageMsg}</span>}
                  <button onClick={savePage} disabled={pageSaving || pageLoading} style={{ padding: "11px 24px", borderRadius: 10, background: "linear-gradient(135deg,#1D4ED8,#06B6D4)", border: "none", color: "white", fontSize: 14, fontWeight: 600, cursor: pageSaving ? "wait" : "pointer" }}>{pageSaving ? "Saving..." : "Save Changes"}</button>
                </div>
              </div>

              {pageLoading ? (
                <p style={{ color: "rgba(232,244,253,0.5)" }}>Loading...</p>
              ) : (
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                  <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Page Title</label>
                  <input value={pageTitle} onChange={e => setPageTitle(e.target.value)} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 16, fontWeight: 600, marginBottom: 28, outline: "none" }} />

                  {pageSections.map((sec, si) => (
                    <div key={si} style={{ marginBottom: 24, padding: 18, borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <input value={sec.h} onChange={e => updateSectionHeading(si, e.target.value)} placeholder="Section heading" style={{ flex: 1, padding: "9px 13px", borderRadius: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#06B6D4", fontSize: 15, fontWeight: 600, outline: "none" }} />
                        <button onClick={() => removeSection(si)} title="Remove section" style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Trash2 size={15} /></button>
                      </div>
                      {sec.p.map((para, pi) => (
                        <div key={pi} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                          <textarea value={para} onChange={e => updateParagraph(si, pi, e.target.value)} rows={2} style={{ flex: 1, padding: "10px 13px", borderRadius: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(232,244,253,0.85)", fontSize: 14, lineHeight: 1.6, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
                          <button onClick={() => removeParagraph(si, pi)} title="Remove paragraph" style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(232,244,253,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, alignSelf: "flex-start" }}><X size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => addParagraph(si)} style={{ marginTop: 4, padding: "7px 13px", borderRadius: 8, background: "transparent", border: "1px dashed rgba(255,255,255,0.15)", color: "rgba(232,244,253,0.5)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Plus size={13} /> Add paragraph</button>
                    </div>
                  ))}

                  <button onClick={addSection} style={{ padding: "11px 18px", borderRadius: 10, background: "rgba(6,182,212,0.08)", border: "1px dashed rgba(6,182,212,0.3)", color: "#06B6D4", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}><Plus size={15} /> Add Section</button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
