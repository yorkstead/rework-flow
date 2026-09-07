'use client';

import React, { useEffect, useState } from 'react';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[UnionOS PWA] Service Worker active:', reg.scope);
        })
        .catch((err) => {
          console.warn('[UnionOS PWA] Service Worker registration failed:', err);
        });
    }

    // Check standalone state
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Check iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isAppleDevice);

    // Intercept Chrome/Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!mounted || isStandalone || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIos) {
      setShowIosModal(true);
    } else {
      alert(
        'To install UnionOS on your mobile device:\n1. Tap your browser menu (⋮)\n2. Select "Install app" or "Add to Home screen"'
      );
    }
  };

  return (
    <>
      {/* Floating Install Pill */}
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-[#b4824f]/40 bg-[#16181d]/95 px-4 py-2.5 shadow-2xl backdrop-blur-md transition-all hover:border-[#b4824f]">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0e0a07] text-xs font-bold text-[#b4824f] border border-[#b4824f]/30">
          240
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold tracking-wide text-[#e8dcc4]">
            Install UnionOS App
          </span>
          <span className="text-[10px] text-[#b4824f]">
            {isIos ? 'Full Screen Standalone Mode' : 'Instant Offline POS App'}
          </span>
        </div>
        <button
          onClick={handleInstallClick}
          className="ml-2 rounded-full bg-gradient-to-r from-[#b4824f] to-[#c29b68] px-3 py-1 text-xs font-bold text-[#0e0a07] shadow hover:brightness-110 active:scale-95 transition-transform"
        >
          {isIos ? 'How to Install' : 'Install'}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="ml-1 text-[#8b5a3c] hover:text-[#e8dcc4] text-xs px-1"
          title="Dismiss"
        >
          ✕
        </button>
      </div>

      {/* iOS Instructions Modal */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl border border-[#b4824f]/40 bg-[#16181d] p-6 text-[#e8dcc4] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#2a2f3d]">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0e0a07] text-sm font-bold text-[#b4824f] border border-[#b4824f]/50">
                  240
                </div>
                <h3 className="font-serif text-lg font-bold text-[#b4824f]">
                  Install on iPhone / iPad
                </h3>
              </div>
              <button
                onClick={() => setShowIosModal(false)}
                className="text-gray-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs leading-relaxed text-gray-300">
              <div className="flex items-start gap-3 rounded-lg bg-[#0e0a07] p-3 border border-[#2a2f3d]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#b4824f] font-bold text-[#0e0a07]">
                  1
                </span>
                <p>
                  Tap the <strong className="text-white">Share</strong> button at the bottom of Safari (box with arrow up).
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-[#0e0a07] p-3 border border-[#2a2f3d]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#b4824f] font-bold text-[#0e0a07]">
                  2
                </span>
                <p>
                  Scroll down the menu and tap <strong className="text-white">Add to Home Screen</strong>.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-[#0e0a07] p-3 border border-[#2a2f3d]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#b4824f] font-bold text-[#0e0a07]">
                  3
                </span>
                <p>
                  Tap <strong className="text-white">Add</strong> in the top-right corner. UnionOS will now launch in full-screen standalone mode with no browser address bar!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIosModal(false)}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#b4824f] to-[#c29b68] py-2.5 text-center text-xs font-bold text-[#0e0a07] shadow-lg hover:brightness-110"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
