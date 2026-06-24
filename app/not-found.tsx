export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "#0A1628", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 48, fontWeight: 700, color: "white" }}>404</h1>
      <p style={{ color: "rgba(232,244,253,0.5)" }}>Page not found</p>
      <a href="/" style={{ color: "#06B6D4", textDecoration: "none" }}>Go Home</a>
    </div>
  );
}
