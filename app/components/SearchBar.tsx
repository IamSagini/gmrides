"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Calendar, Users, ArrowRight, ArrowLeftRight, Plane } from "lucide-react";
import { useRouter } from "next/navigation";

const towns = [
  "Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Thika","Kisii","Migori",
  "Homa Bay","Siaya","Rongo","Awendo","Oyugis","Keroka","Sotik","Mbita",
  "Kendu Bay","Kehancha","Sirare","Narok","Bomet","Kericho","Naivasha",
  "Nyahururu","Kitale","Bungoma","Kakamega","Webuye","Malindi","Kilifi",
  "Voi","Machakos","Embu","Nyeri","Meru","Nanyuki","Isiolo"
];

const airports = [
  "Jomo Kenyatta International (NBO) - Nairobi",
  "Wilson Airport (WIL) - Nairobi",
  "Moi International (MBA) - Mombasa",
  "Kisumu International (KIS) - Kisumu",
  "Eldoret International (EDL) - Eldoret",
  "Malindi Airport (MYD) - Malindi",
  "Nanyuki Airport (NYK) - Nanyuki",
  "Ukunda Airstrip (UKA) - Diani",
];

const tripTypes = ["One Way","Round Trip","Airport Transfer"];

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const prefillTo = searchParams.get("to");
    const prefillType = searchParams.get("type");
    if (prefillTo) setTo(prefillTo);
    if (prefillType) setTripType(prefillType);
  }, [searchParams]);
  const [tripType, setTripType] = useState("One Way");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [error, setError] = useState("");
  const [pax, setPax] = useState(1);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [direction, setDirection] = useState<"toAirport"|"fromAirport">("toAirport");

  const isAirport = tripType === "Airport Transfer";

  const fromList = isAirport
    ? (direction === "toAirport" ? towns : airports).filter(t => t.toLowerCase().includes(from.toLowerCase()))
    : towns.filter(t => from && t.toLowerCase().includes(from.toLowerCase()) && t !== to);

  const toList = isAirport
    ? (direction === "toAirport" ? airports : towns).filter(t => t.toLowerCase().includes(to.toLowerCase()))
    : towns.filter(t => to && t.toLowerCase().includes(to.toLowerCase()) && t !== from);

  const swap = () => {
    const tmp = from; setFrom(to); setTo(tmp);
    if (isAirport) setDirection(direction === "toAirport" ? "fromAirport" : "toAirport");
  };

  const search = () => {
    if (!from || !to || !date) { setError("Please fill in all fields"); return; }
    if (tripType === "Round Trip" && !returnDate) { setError("Please select a return date"); return; }
    setError("");
    const currency = localStorage.getItem("gmrides_currency") || "KES";
    router.push(`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&pax=${pax}&type=${encodeURIComponent(tripType)}&currency=${currency}${tripType === "Round Trip" ? `&returnDate=${returnDate}` : ""}`);
  };

  return (
    <div className="glass" style={{ borderRadius: 20, padding: "28px 24px", border: "1px solid rgba(255,255,255,0.1)" }}>
      {/* Trip type tabs */}
      <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, width: "fit-content", marginBottom: 20 }}>
        {tripTypes.map(t => (
          <button key={t} onClick={() => { setTripType(t); setFrom(""); setTo(""); }}
            style={{ padding: "8px 18px", borderRadius: 9, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", transition: "all 0.2s",
              background: tripType === t ? "linear-gradient(135deg, #1D4ED8, #06B6D4)" : "transparent",
              color: tripType === t ? "white" : "rgba(232,244,253,0.5)", display: "flex", alignItems: "center", gap: 6 }}>
            {t === "Airport Transfer" && <Plane size={12} />}{t}
          </button>
        ))}
      </div>

      {/* Airport direction toggle */}
      {isAirport && (
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[{ val: "toAirport", label: "Town → Airport" },{ val: "fromAirport", label: "Airport → Town" }].map(d => (
            <button key={d.val} onClick={() => { setDirection(d.val as "toAirport"|"fromAirport"); setFrom(""); setTo(""); }}
              style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: `1px solid ${direction === d.val ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.1)"}`, cursor: "pointer", background: direction === d.val ? "rgba(6,182,212,0.1)" : "transparent", color: direction === d.val ? "#06B6D4" : "rgba(232,244,253,0.45)" }}>
              {d.label}
            </button>
          ))}
        </div>
      )}

      {/* Fields */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr 180px 130px auto", gap: 12, alignItems: "end" }}>
        {/* FROM */}
        <div style={{ position: "relative" }}>
          <label style={{ display: "block", color: "rgba(232,244,253,0.4)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
            {isAirport ? (direction === "toAirport" ? "From (Town)" : "From (Airport)") : "From"}
          </label>
          <div style={{ position: "relative" }}>
            {isAirport && direction === "fromAirport"
              ? <Plane size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#06B6D4" }} />
              : <MapPin size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#06B6D4" }} />}
            <input value={from} onChange={e => { setFrom(e.target.value); setShowFrom(true); }}
              onFocus={() => setShowFrom(true)} onBlur={() => setTimeout(() => setShowFrom(false), 150)}
              placeholder={isAirport && direction === "fromAirport" ? "Select airport..." : "Departure city"}
              className="input-field" style={{ paddingLeft: 34 }} />
          </div>
          {showFrom && from && fromList.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: "#0F1E35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, zIndex: 50, maxHeight: 200, overflowY: "auto" }}>
              {fromList.slice(0,8).map(t => (
                <button key={t} onMouseDown={() => { setFrom(t); setShowFrom(false); }}
                  style={{ width: "100%", textAlign: "left", padding: "10px 16px", fontSize: 13, color: "rgba(232,244,253,0.8)", background: "none", border: "none", cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap */}
        <button onClick={swap} style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#06B6D4", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
          <ArrowLeftRight size={15} />
        </button>

        {/* TO */}
        <div style={{ position: "relative" }}>
          <label style={{ display: "block", color: "rgba(232,244,253,0.4)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
            {isAirport ? (direction === "toAirport" ? "To (Airport)" : "To (Town)") : "To"}
          </label>
          <div style={{ position: "relative" }}>
            {isAirport && direction === "toAirport"
              ? <Plane size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#06B6D4" }} />
              : <MapPin size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#06B6D4" }} />}
            <input value={to} onChange={e => { setTo(e.target.value); setShowTo(true); }}
              onFocus={() => setShowTo(true)} onBlur={() => setTimeout(() => setShowTo(false), 150)}
              placeholder={isAirport && direction === "toAirport" ? "Select airport..." : "Destination"}
              className="input-field" style={{ paddingLeft: 34 }} />
          </div>
          {showTo && to && toList.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: "#0F1E35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, zIndex: 50, maxHeight: 200, overflowY: "auto" }}>
              {toList.slice(0,8).map(t => (
                <button key={t} onMouseDown={() => { setTo(t); setShowTo(false); }}
                  style={{ width: "100%", textAlign: "left", padding: "10px 16px", fontSize: 13, color: "rgba(232,244,253,0.8)", background: "none", border: "none", cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div>
          <label style={{ display: "block", color: "rgba(232,244,253,0.4)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Travel Date</label>
          <div style={{ position: "relative" }}>
            <Calendar size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#06B6D4" }} />
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="input-field" style={{ paddingLeft: 34, colorScheme: "dark" }} />
          </div>
        </div>

        {/* Passengers */}
        <div>
          <label style={{ display: "block", color: "rgba(232,244,253,0.4)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Passengers</label>
          <div style={{ position: "relative" }}>
            <Users size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#06B6D4" }} />
            <select value={pax} onChange={e => setPax(Number(e.target.value))}
              className="input-field" style={{ paddingLeft: 34, appearance: "none" }}>
              {[1,2,3,4,5,6,7].map(n => <option key={n} value={n} style={{ background: "#0F1E35" }}>{n}</option>)}
            </select>
          </div>
        </div>

        {/* Search */}
        <button onClick={search} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, whiteSpace: "nowrap", height: 46 }}>
          Search <ArrowRight size={15} />
        </button>
      </div>

      {/* Return date */}
      {tripType === "Round Trip" && (
        <div style={{ marginTop: 16, maxWidth: 200 }}>
          <label style={{ display: "block", color: "rgba(232,244,253,0.4)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Return Date</label>
          <div style={{ position: "relative" }}>
            <Calendar size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#06B6D4" }} />
            <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)}
              min={date || new Date().toISOString().split("T")[0]}
              className="input-field" style={{ paddingLeft: 34, colorScheme: "dark" }} />
          </div>
        </div>
      )}
      {error && (
        <div style={{ marginTop: 14, color: "#EF4444", fontSize: 13, fontWeight: 500 }}>{error}</div>
      )}
    </div>
  );
}
