import type { Metadata, Viewport } from 'next';
import './globals.css';
import { UnionStoreProvider } from '../lib/store/useUnionStore';

export const metadata: Metadata = {
  title: 'UnionOS • 240 Union Restaurant Operating System',
  description: 'Local-first, zero-SaaS bespoke POS & KDS engineered for 240 Union (Lakewood, CO)',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'UnionOS',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#0e0a07',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
      </head>
      <body className="min-h-screen bg-[#0e0a07] text-[#e8dcc4] antialiased selection:bg-[#b4824f]/30">
        <UnionStoreProvider>
          {children}
        </UnionStoreProvider>
      </body>
    </html>
  );
}
