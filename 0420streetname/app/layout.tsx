import type { Metadata, Viewport } from 'next';
import './globals.css';
import { UnionStoreProvider } from '../lib/store/useUnionStore';
import { PwaInstallPrompt } from '../components/PwaInstallPrompt';

export const metadata: Metadata = {
  title: 'UnionOS • 240 Union Restaurant Operating System',
  description: 'Local-first, zero-SaaS bespoke POS & KDS engineered for 240 Union (Lakewood, CO)',
  manifest: '/manifest.json',
  applicationName: 'UnionOS',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'UnionOS',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="UnionOS" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="application-name" content="UnionOS" />
        <meta name="theme-color" content="#0e0a07" />
      </head>
      <body className="min-h-screen bg-[#0e0a07] text-[#e8dcc4] antialiased selection:bg-[#b4824f]/30">
        <UnionStoreProvider>
          {children}
          <PwaInstallPrompt />
        </UnionStoreProvider>
      </body>
    </html>
  );
}
