"use client";
import { useRouter } from "next/navigation";
import { MapPin, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api";

const fallbackDestinations = [
  {
    name: "Maasai Mara",
    location: "Narok County",
    from: "Nairobi",
    to: "Narok",
    desc: "World-famous wildlife reserve, home to the Great Migration and the Big Five.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80",
    tag: "Wildlife"
  },
  {
    name: "Diani Beach",
    location: "Kwale County",
    from: "Mombasa",
    to: "Ukunda Airstrip (UKA) - Diani",
    desc: "Crystal clear waters and white sandy beaches on Kenya's stunning south coast.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    tag: "Beach"
  },
  {
    name: "Mount Kenya",
    location: "Central Kenya",
    from: "Nairobi",
    to: "Nanyuki",
    desc: "Africa's second highest mountain, perfect for trekking and adventure seekers.",
    image: "https://images.unsplash.com/photo-1611735341450-74d61e660ad2?w=600&q=80",
    tag: "Adventure"
  },
  {
    name: "Lake Nakuru",
    location: "Nakuru County",
    from: "Nairobi",
    to: "Nakuru",
    desc: "Famous for its flamingos and rhino sanctuary within the national park.",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&q=80",
    tag: "Wildlife"
  },
  {
    name: "Amboseli National Park",
    location: "Kajiado County",
    from: "Nairobi",
    to: "Narok",
    desc: "Breathtaking views of Mount Kilimanjaro with large elephant herds.",
    image: "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=600&q=80",
    tag: "Wildlife"
  },
  {
    name: "Lamu Island",
    location: "Lamu County",
    from: "Nairobi",
    to: "Malindi",
    desc: "UNESCO World Heritage Site with Swahili culture and pristine beaches.",
    image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=600&q=80",
    tag: "Culture"
  },
  {
    name: "Tsavo National Park",
    location: "Coast & Eastern",
    from: "Nairobi",
    to: "Voi",
    desc: "Kenya's largest national park, home to the famous red elephants.",
    image: "https://images.unsplash.com/photo-1440778303588-435521a205bc?w=600&q=80",
    tag: "Wildlife"
  },
  {
    name: "Kisumu & Lake Victoria",
    location: "Nyanza",
    from: "Nairobi",
    to: "Kisumu",
    desc: "Vibrant lakeside city on Africa's largest lake, rich in culture and nature.",
    image: "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=600&q=80",
    tag: "Nature"
  },
  {
    name: "Hell's Gate",
    location: "Nakuru County",
    from: "Nairobi",
    to: "Naivasha",
    desc: "Dramatic gorges and geothermal activity near the scenic Lake Naivasha.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80",
    tag: "Adventure"
  },
];

const tagColors: Record<string, string> = {
  Wildlife: "#10B981",
  Beach: "#06B6D4",
  Adventure: "#F59E0B",
  Culture: "#818CF8",
  Nature: "#1D4ED8",
};

export default function GalleryPage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const book = (from: string, to: string) => {
    // Send the user to the homepage search bar with the destination prefilled.
    // They choose their own origin and date — no assumed "from".
    router.push(`/?to=${encodeURIComponent(to)}#book`);
  };

  const [destinations, setDestinations] = useState<any[]>(fallbackDestinations);
  useEffect(() => {
    fetch(`${API}/destinations`)
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.destinations) && data.destinations.length) {
          setDestinations(data.destinations.map((d: any) => ({
            name: d.name, location: d.location, from: d.from_location,
            to: d.to_location, desc: d.description, image: d.image_url, tag: d.tag,
          })));
        }
      })
      .catch(() => {});
  }, []);
  return (
    <div style={{ minHeight: "100vh", background: "#0A1628", paddingTop: 88 }}>
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ color: "#06B6D4", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>Explore Kenya</span>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, color: "white", marginTop: 14, marginBottom: 16 }}>
              Beautiful Destinations
            </h1>
            <p style={{ color: "rgba(232,244,253,0.5)", maxWidth: 560, margin: "0 auto", fontSize: 16, lineHeight: 1.7 }}>
              From wildlife safaris to pristine beaches, Kenya has it all. Book your ride with GM Rides and experience it in comfort.
            </p>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {destinations.map(d => (
              <div key={d.name} style={{ background: "rgba(26,47,74,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden", transition: "border-color 0.2s, transform 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(6,182,212,0.3)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>

                {/* Image */}
                <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                  <img src={d.image} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(10,22,40,0.8))" }} />
                  <span style={{ position: "absolute", top: 14, right: 14, padding: "4px 12px", borderRadius: 50, background: `${tagColors[d.tag]}25`, border: `1px solid ${tagColors[d.tag]}50`, color: tagColors[d.tag], fontSize: 12, fontWeight: 600 }}>
                    {d.tag}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: "20px 22px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <MapPin size={13} color="#06B6D4" />
                    <span style={{ color: "#06B6D4", fontSize: 12, fontWeight: 500 }}>{d.location}</span>
                  </div>
                  <h3 style={{ color: "white", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 10 }}>{d.name}</h3>
                  <p style={{ color: "rgba(232,244,253,0.5)", fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>{d.desc}</p>
                  <button onClick={() => book(d.from, d.to)}
                    style={{ width: "100%", padding: "12px", borderRadius: 12, background: "linear-gradient(135deg,#1D4ED8,#06B6D4)", border: "none", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "opacity 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                    Book Ride to {d.name} <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
