import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";
import { CurrencyProvider } from "./context/CurrencyContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://gmrides.net"),
  title: "GM Rides — Kenya's Modern Transport Platform",
  description: "Book intercity buses, airport transfers & private hire across Kenya. Pay with M-Pesa, card, or PayPal.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "GM Rides — Kenya's Modern Transport Platform",
    description: "Book intercity buses, airport transfers & private hire across Kenya. Pay with M-Pesa, card, or PayPal.",
    siteName: "GM Rides",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "GM Rides" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GM Rides — Kenya's Modern Transport Platform",
    description: "Book intercity buses, airport transfers & private hire across Kenya.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <CurrencyProvider>
          <ClientLayout>{children}</ClientLayout>
        </CurrencyProvider>
      </body>
    </html>
  );
}
