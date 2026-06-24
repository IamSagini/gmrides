"use client";
import { useState, useEffect } from "react";
import GmLogo from "../components/GmLogo";
import Link from "next/link";
import { User, Mail, Phone, Lock, Eye, EyeOff, LogOut, BarChart3, Clock, CheckCircle, CreditCard, TrendingUp, Bus, LayoutDashboard, BookOpen, Plus, Menu, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api";

export default function AccountPage() {
  const [mode, setMode] = useState<"login"|"register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{email: string; name: string; isAdmin: boolean} | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, revenue: 0 });
  const [loyalty, setLoyalty] = useState<{ confirmed_trips: number; qualifies: boolean; discount_percent: number; trips_until_discount: number } | null>(null);
  const [section, setSection] = useState("dashboard");
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chartData, setChartData] = useState<{date: string; count: number}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Handle Google OAuth return: /account?token=...&name=...&role=...
    const params = new URLSearchParams(window.location.search);
    const gToken = params.get("token");
    if (gToken) {
      const role = params.get("role") || "user";
      const u = {
        email: "",
        name: params.get("name") || "Google User",
        role,
        isAdmin: role === "admin" || role === "super_admin",
      };
      localStorage.setItem("gmrides_token", gToken);
      localStorage.setItem("gmrides_user", JSON.stringify(u));
      window.history.replaceState({}, "", "/account");
      if (u.isAdmin) {
        window.location.href = "/admin";
        return;
      }
      setUser(u);
      loadData(u);
      return;
    }
    const saved = localStorage.getItem("gmrides_user");
    if (saved) {
      const u = JSON.parse(saved);
      if (u.isAdmin) {
        window.location.href = "/admin";
        return;
      }
      setUser(u);
      loadData(u);
    }
  }, []);

  const register = async () => {
    setError("");
    if (!name || !email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (!data.success) {
        const msg = data.errors ? Object.values(data.errors).flat()[0] : (data.message || "Registration failed");
        setError(String(msg));
        setLoading(false);
        return;
      }
      const u = {
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        isAdmin: data.user.role === "admin" || data.user.role === "super_admin",
      };
      localStorage.setItem("gmrides_token", data.token);
      localStorage.setItem("gmrides_user", JSON.stringify(u));
      setUser(u);
      loadData(u);
    } catch {
      setError("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const login = async () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }
      const u = {
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        isAdmin: data.user.role === "admin" || data.user.role === "super_admin",
      };
      localStorage.setItem("gmrides_token", data.token);
      localStorage.setItem("gmrides_user", JSON.stringify(u));
      if (u.isAdmin) {
        window.location.href = "/admin";
        return;
      }
      setUser(u);
      loadData(u);
    } catch {
      setError("Login failed. Please try again.");
    }
    setLoading(false);
  };

  const loadData = async (u?: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/my-bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("gmrides_token")}` },
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
        setLoyalty(data.loyalty || null);
      }
    } catch {}
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("gmrides_user");
    localStorage.removeItem("gmrides_token");
    setUser(null);
    setBookings([]);
    setEmail("");
    setPassword("");
    window.location.href = "/";
  };

  const changePassword = async () => {
    setPwMsg("");
    if (!curPw || !newPw || !confirmPw) { setPwMsg("Please fill in all fields"); return; }
    if (newPw.length < 6) { setPwMsg("New password must be at least 6 characters"); return; }
    if (newPw !== confirmPw) { setPwMsg("New passwords do not match"); return; }
    setSavingPw(true);
    try {
      const token = localStorage.getItem("gmrides_token");
      const res = await fetch(`${API}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`, "Accept": "application/json" },
        body: JSON.stringify({ current_password: curPw, new_password: newPw }),
      });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        setPwMsg("Password updated");
        setCurPw(""); setNewPw(""); setConfirmPw("");
      } else {
        setPwMsg(data.message || "Could not update password");
      }
    } catch { setPwMsg("Connection error"); }
    setSavingPw(false);
  };
  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  // Login screen
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A1628", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, paddingTop: 100 }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ margin: "0 auto 16px", boxShadow: "0 0 30px rgba(29,78,216,0.3)", borderRadius: 16, width: 56 }}>
              <GmLogo size={56} radius={16} />
            </div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, color: "#06B6D4", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>GM Rides</div>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, color: "white", marginBottom: 8 }}>
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p style={{ color: "rgba(232,244,253,0.45)", fontSize: 15 }}>
              {mode === "login" ? "Sign in to manage your bookings" : "Join GM Rides to start booking"}
            </p>
          </div>

          <div style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, padding: 32 }}>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, marginBottom: 28 }}>
              {(["login","register"] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setError(""); }}
                  style={{ flex: 1, padding: "9px", borderRadius: 9, fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer", transition: "all 0.2s",
                    background: mode === m ? "linear-gradient(135deg,#1D4ED8,#06B6D4)" : "transparent",
                    color: mode === m ? "white" : "rgba(232,244,253,0.45)" }}>
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {mode === "register" && (
                <div>
                  <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 13, marginBottom: 8 }}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <User size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#06B6D4" }} />
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="input-field" style={{ paddingLeft: 40 }} />
                  </div>
                </div>
              )}
              <div>
                <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 13, marginBottom: 8 }}>Email</label>
                <div style={{ position: "relative" }}>
                  <Mail size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#06B6D4" }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="input-field" style={{ paddingLeft: 40 }} />
                </div>
              </div>
              {mode === "register" && (
                <div>
                  <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 13, marginBottom: 8 }}>Phone</label>
                  <div style={{ position: "relative" }}>
                    <Phone size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#06B6D4" }} />
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 7XX XXX XXX" className="input-field" style={{ paddingLeft: 40 }} />
                  </div>
                </div>
              )}
              <div>
                <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 13, marginBottom: 8 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#06B6D4" }} />
                  <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && login()}
                    placeholder="••••••••" className="input-field" style={{ paddingLeft: 40, paddingRight: 40 }} />
                  <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(232,244,253,0.4)" }}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              {error && <p style={{ color: "#EF4444", fontSize: 13 }}>{error}</p>}
              <button onClick={mode === "login" ? login : register} className="btn-primary" style={{ marginTop: 8, fontSize: 15, padding: "14px" }}>
                {mode === "login" ? "Sign In" : "Create Account"}
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                <span style={{ color: "rgba(232,244,253,0.35)", fontSize: 12 }}>or</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
              </div>
              <button onClick={async () => {
                try {
                  const res = await fetch(`${API}/auth/google/redirect`);
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                  else setError("Could not start Google sign-in");
                } catch { setError("Could not reach Google sign-in"); }
              }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "13px", borderRadius: 12, background: "white", color: "#1F2937", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                <svg width="17" height="17" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5.4 0 10.3-2.1 14-5.4l-6.5-5.5c-2 1.5-4.6 2.4-7.5 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39 16.2 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.5 5.5c-.5.4 7-5.1 7-15.2 0-1.2-.1-2.3-.4-3.5z"/></svg>
                Continue with Google
              </button>
            </div>
            <p style={{ textAlign: "center", color: "rgba(232,244,253,0.35)", fontSize: 13, marginTop: 20 }}>
              {mode === "login" ? "No account? " : "Already have one? "}
              <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                style={{ color: "#06B6D4", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in user account shell
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "bookings", label: "My Bookings", icon: BookOpen },
  ];

  const confirmedCount = bookings.filter((b: any) => b.status === "confirmed").length;
  const pendingCount = bookings.filter((b: any) => b.status === "pending").length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#060F1E" }}>

      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 260 : 72, background: "#0A1628", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", transition: "width 0.3s", flexShrink: 0, position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 100, overflow: "hidden" }}>
        <Link href="/" style={{ padding: "20px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div style={{ flexShrink: 0, boxShadow: "0 0 20px rgba(29,78,216,0.4)", borderRadius: 10 }}>
            <GmLogo size={38} radius={10} />
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: "white", fontSize: 16, lineHeight: 1 }}>GM Rides</div>
              <div style={{ color: "#06B6D4", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 3 }}>My Account</div>
            </div>
          )}
        </Link>

        <div style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, border: "none", cursor: "pointer", transition: "all 0.2s", textAlign: "left", width: "100%",
                background: section === item.id ? "rgba(29,78,216,0.15)" : "transparent",
                color: section === item.id ? "#06B6D4" : "rgba(232,244,253,0.5)",
                borderLeft: section === item.id ? "2px solid #06B6D4" : "2px solid transparent" }}>
              <item.icon size={18} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap" }}>{item.label}</span>}
            </button>
          ))}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, textDecoration: "none", marginTop: 8, background: "rgba(16,185,129,0.08)", color: "#10B981" }}>
            <Plus size={18} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>Book a Ride</span>}
          </a>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 260 : 72, transition: "margin-left 0.3s", display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <div style={{ height: 64, background: "#0A1628", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: "rgba(232,244,253,0.5)", cursor: "pointer", display: "flex" }}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 600, color: "white" }}>
              {navItems.find(n => n.id === section)?.label}
            </h1>
          </div>
          <div style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#1D4ED8,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>{user.name.split(" ").map((n:string)=>n[0]).slice(0,2).join("")}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{user.name}</span>
                <span style={{ color: "rgba(232,244,253,0.4)", fontSize: 11 }}>Member</span>
              </div>
            </button>
            {menuOpen && (
              <>
                <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90 }} />
                <div style={{ position: "absolute", top: 48, right: 0, width: 180, background: "#0A1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 6, zIndex: 100, boxShadow: "0 12px 32px rgba(0,0,0,0.5)" }}>
                  <button onClick={() => { setSection("profile"); setMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: "none", color: "rgba(232,244,253,0.8)", fontSize: 14, cursor: "pointer", textAlign: "left" }}>
                    <User size={16} /> Profile
                  </button>
                  <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: "none", color: "#EF4444", fontSize: 14, cursor: "pointer", textAlign: "left" }}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>

          {section === "dashboard" && (
            <div>
              <p style={{ color: "rgba(232,244,253,0.45)", fontSize: 14, marginBottom: 28 }}>Welcome back, {user.name.split(" ")[0]}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
                {[
                  { icon: BookOpen, label: "Total Trips", value: bookings.length, color: "#06B6D4" },
                  { icon: CheckCircle, label: "Confirmed", value: confirmedCount, color: "#10B981" },
                  { icon: Clock, label: "Pending", value: pendingCount, color: "#F59E0B" },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 22 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <span style={{ color: "rgba(232,244,253,0.45)", fontSize: 13 }}>{s.label}</span>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: s.color + "20", border: "1px solid " + s.color + "25", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <s.icon size={16} color={s.color} />
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 30, fontWeight: 700, color: "white" }}>{s.value}</div>
                  </div>
                ))}
              </div>
              {loyalty && (
                <div style={{ background: loyalty.qualifies ? "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.08))" : "rgba(26,47,74,0.6)", border: loyalty.qualifies ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <h2 style={{ color: "white", fontWeight: 600, fontSize: 17 }}>Loyalty</h2>
                    {loyalty.qualifies && <span style={{ padding: "4px 12px", borderRadius: 50, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", color: "#10B981", fontSize: 13, fontWeight: 600 }}>10% discount unlocked</span>}
                  </div>
                  {loyalty.qualifies ? (
                    <p style={{ color: "rgba(232,244,253,0.7)", fontSize: 14 }}>You have {loyalty.confirmed_trips} confirmed trips. Your next booking gets 10% off automatically.</p>
                  ) : (
                    <>
                      <p style={{ color: "rgba(232,244,253,0.6)", fontSize: 14, marginBottom: 14 }}>{loyalty.confirmed_trips} of 6 confirmed trips. {loyalty.trips_until_discount} more to unlock 10% off.</p>
                      <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 50, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: Math.min((loyalty.confirmed_trips / 6) * 100, 100) + "%", background: "linear-gradient(90deg,#1D4ED8,#06B6D4)", borderRadius: 50, transition: "width 0.4s" }} />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {section === "bookings" && (
            <div style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ color: "white", fontWeight: 600, fontSize: 16 }}>My Bookings ({bookings.length})</h2>
                <button onClick={() => loadData(user)} style={{ color: "#06B6D4", fontSize: 13, background: "none", border: "none", cursor: "pointer" }}>Refresh</button>
              </div>
              {bookings.length === 0 ? (
                <div style={{ padding: 60, textAlign: "center" }}>
                  <Bus size={48} color="rgba(232,244,253,0.15)" style={{ margin: "0 auto 16px" }} />
                  <p style={{ color: "rgba(232,244,253,0.4)", fontSize: 15 }}>No bookings yet</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["Reference","Route","Date","Seats","Amount","Status"].map(h => (
                        <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "rgba(232,244,253,0.4)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {bookings.map((b: any) => (
                        <tr key={b.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ padding: "14px 20px", color: "#06B6D4", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>{b.booking_reference}</td>
                          <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.7)", fontSize: 13, whiteSpace: "nowrap" }}>{b.from_location} → {b.to_location}</td>
                          <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.5)", fontSize: 13 }}>{b.travel_date}</td>
                          <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.5)", fontSize: 13 }}>{Array.isArray(b.seats) ? b.seats.join(", ") : b.seats}</td>
                          <td style={{ padding: "14px 20px", color: "rgba(232,244,253,0.7)", fontSize: 13, whiteSpace: "nowrap" }}>KES {Number(b.total_kes).toLocaleString()}</td>
                          <td style={{ padding: "14px 20px" }}>
                            <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: b.status === "confirmed" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: b.status === "confirmed" ? "#10B981" : "#F59E0B", border: "1px solid " + (b.status === "confirmed" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)") }}>{b.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {section === "profile" && (
            <div style={{ maxWidth: 520 }}>
              <div style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 28 }}>
                <h2 style={{ color: "white", fontWeight: 600, fontSize: 17, marginBottom: 24 }}>Profile</h2>
                {[
                  { icon: User, label: "Full Name", value: user.name },
                  { icon: Mail, label: "Email", value: user.email },
                ].map((f: any) => (
                  <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(6,182,212,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <f.icon size={17} color="#06B6D4" />
                    </div>
                    <div>
                      <div style={{ color: "rgba(232,244,253,0.4)", fontSize: 12, marginBottom: 2 }}>{f.label}</div>
                      <div style={{ color: "white", fontSize: 15 }}>{f.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 28, marginTop: 20 }}>
                <h2 style={{ color: "white", fontWeight: 600, fontSize: 17, marginBottom: 6 }}>Change Password</h2>
                <p style={{ color: "rgba(232,244,253,0.4)", fontSize: 13, marginBottom: 22 }}>Update the password you use to sign in.</p>
                {[
                  { label: "Current Password", val: curPw, set: setCurPw, show: showCur, setShow: setShowCur },
                  { label: "New Password", val: newPw, set: setNewPw, show: showNew, setShow: setShowNew },
                  { label: "Confirm New Password", val: confirmPw, set: setConfirmPw, show: showConf, setShow: setShowConf },
                ].map((f: any) => (
                  <div key={f.label} style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", color: "rgba(232,244,253,0.5)", fontSize: 13, marginBottom: 7 }}>{f.label}</label>
                    <div style={{ position: "relative" }}>
                      <input type={f.show ? "text" : "password"} value={f.val} onChange={e => f.set(e.target.value)} placeholder={"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"} className="input-field" style={{ paddingRight: 40 }} />
                      <button type="button" onClick={() => f.setShow(!f.show)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(232,244,253,0.4)", display: "flex" }}>
                        {f.show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
                  <button onClick={changePassword} disabled={savingPw} style={{ padding: "11px 24px", borderRadius: 10, background: "linear-gradient(135deg,#1D4ED8,#06B6D4)", border: "none", color: "white", fontSize: 14, fontWeight: 600, cursor: savingPw ? "wait" : "pointer" }}>
                    {savingPw ? "Updating..." : "Save Changes"}
                  </button>
                  {pwMsg && <span style={{ color: pwMsg === "Password updated" ? "#10B981" : "#EF4444", fontSize: 14 }}>{pwMsg}</span>}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
