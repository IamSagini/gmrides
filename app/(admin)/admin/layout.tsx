export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#060F1E", fontFamily: "Inter, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
