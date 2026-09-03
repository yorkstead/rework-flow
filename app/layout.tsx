import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReworkFlow • Denver Express Warehousing",
  description: "High-Velocity Cargo Rework & Cross-Dock Evidence Engine",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#060d17] text-slate-100 antialiased selection:bg-[#d4af37] selection:text-[#0b192c]">
        {children}
      </body>
    </html>
  );
}
