'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, X, Wifi, Copy, Check, Sparkles, RefreshCw, Globe } from 'lucide-react';

interface NetworkAddress {
  name: string;
  ip: string;
  type: 'wifi' | 'tailscale' | 'ethernet' | 'other';
  recommended: boolean;
}

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lanUrl?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, lanUrl: initialLanUrl }) => {
  const [copied, setCopied] = useState(false);
  const [addresses, setAddresses] = useState<NetworkAddress[]>([]);
  const [selectedIp, setSelectedIp] = useState<string>('192.168.4.146');
  const [port, setPort] = useState<number>(3005);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    fetch('/api/network')
      .then(res => res.json())
      .then(data => {
        if (data.addresses && data.addresses.length > 0) {
          setAddresses(data.addresses);
          setPort(data.port || 3005);
          // Pick the first recommended (Wi-Fi) IP
          const rec = data.addresses.find((a: NetworkAddress) => a.recommended) || data.addresses[0];
          setSelectedIp(rec.ip);
        }
      })
      .catch(() => {
        // Fallback to detected Wi-Fi IP
        setSelectedIp('192.168.4.146');
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const activeUrl = `http://${selectedIp}:${port}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // High-reliability QR Code URL with multiple fallbacks
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(activeUrl)}`;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#16181d] border border-[#262a34] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#1a1d24] border-b border-[#262a34] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#111215] border border-[#262a34] flex items-center justify-center text-[#c29b68]">
              <Smartphone className="w-4 h-4 text-[#c29b68]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#e2e4ea] font-serif">Live Phone & Tablet Pairing</h3>
              <p className="text-[11px] text-[#9ca3af]">Two-device cross-docking / table demo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-[#e2e4ea] p-1.5 rounded-lg hover:bg-[#111215] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Network Interface Switcher */}
        <div className="px-5 pt-4">
          <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider block mb-1.5 font-serif">
            Select Live Demo Connection:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {/* Live Cloud Domain Option */}
            <button
              type="button"
              onClick={() => setSelectedIp('240.yorkstead.com')}
              className={`p-2.5 rounded-xl text-left border transition text-xs flex flex-col justify-between col-span-2 ${
                selectedIp === '240.yorkstead.com'
                  ? 'bg-[#1a1d24] border-[#c29b68] text-[#e2e4ea] ring-1 ring-[#c29b68]/50 font-bold'
                  : 'bg-[#111215] border-[#262a34] text-[#9ca3af] hover:border-[#c29b68]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="capitalize text-[10px] font-semibold text-[#c29b68] flex items-center gap-1">
                  <Globe className="w-3 h-3 text-[#c29b68]" />
                  Official Live Cloud URL (Worldwide Access)
                </span>
                <span className="text-[9px] font-mono bg-emerald-950/60 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/50">
                  Active HTTPS
                </span>
              </div>
              <span className="font-mono text-xs mt-1 text-[#e2e4ea]">https://240.yorkstead.com</span>
            </button>

            {addresses.map(addr => {
              const isSelected = selectedIp === addr.ip;
              return (
                <button
                  key={addr.ip}
                  type="button"
                  onClick={() => setSelectedIp(addr.ip)}
                  className={`p-2 rounded-xl text-left border transition text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1a1d24] border-[#c29b68] text-[#e2e4ea] ring-1 ring-[#c29b68]/50 font-bold'
                      : 'bg-[#111215] border-[#262a34] text-[#9ca3af] hover:border-[#c29b68]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="capitalize text-[10px] font-semibold text-[#9ca3af]">
                      {addr.name}
                    </span>
                    {addr.recommended && (
                      <span className="text-[9px] font-mono bg-emerald-950/60 text-emerald-300 px-1 py-0.2 rounded border border-emerald-500/50">
                        Local Wi-Fi
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] mt-1">{addr.ip}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* QR Code Canvas */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-2xl flex items-center justify-center relative border border-[#262a34]">
            <img
              src={selectedIp === '240.yorkstead.com'
                ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent('https://240.yorkstead.com')}`
                : qrCodeUrl}
              alt={`Scan QR for ${selectedIp === '240.yorkstead.com' ? 'https://240.yorkstead.com' : activeUrl}`}
              className="w-52 h-52 object-contain"
            />
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#e2e4ea] flex items-center justify-center gap-1.5 font-serif">
              <span>Scan with iPhone / Android Camera</span>
              <Sparkles className="w-3.5 h-3.5 text-[#c29b68]" />
            </h4>
            <p className="text-xs text-[#9ca3af] max-w-xs">
              {selectedIp === '240.yorkstead.com'
                ? 'Opens the live production demo directly on cellular or Wi-Fi.'
                : 'Make sure your phone is on the same Wi-Fi network as this laptop.'}
            </p>
          </div>

          {/* Direct URL with Copy Button */}
          <div className="w-full bg-[#111215] p-2.5 rounded-xl border border-[#262a34] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#e2e4ea] truncate">
              <Globe className="w-3.5 h-3.5 text-[#c29b68] shrink-0" />
              <span className="truncate select-all">{selectedIp === '240.yorkstead.com' ? 'https://240.yorkstead.com' : activeUrl}</span>
            </div>
            <button
              onClick={() => {
                const target = selectedIp === '240.yorkstead.com' ? 'https://240.yorkstead.com' : activeUrl;
                navigator.clipboard.writeText(target);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-2.5 py-1 bg-[#1a1d24] hover:bg-[#222731] text-[#e2e4ea] border border-[#262a34] rounded-lg text-xs font-medium transition flex items-center gap-1 shrink-0"
              title="Copy URL to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#c29b68]" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* "Save-A-Ho" Pocket Savior Callout */}
          <div className="w-full bg-[#1e1724] border border-[#f43f5e]/40 rounded-xl p-3 text-left space-y-1.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#e2e4ea] flex items-center gap-1.5 font-serif">
                <span>🚬 Pocket POS • The "Save-A-Ho" Superpower</span>
              </span>
              <span className="text-[9px] font-mono uppercase bg-[#f43f5e]/20 text-[#f43f5e] px-1.5 py-0.2 rounded border border-[#f43f5e]/40 font-bold">
                PWA Ready
              </span>
            </div>
            <p className="text-[11px] text-[#9ca3af] leading-relaxed font-serif">
              Servers don’t need or want to stare at their phones all shift. But when someone is out back taking a drag and suddenly remembers <em className="text-[#e2e4ea]">"Holy shit, Table 12’s ribeyes!"</em>—they whip this out of their back pocket and fire the line in <strong className="text-rose-400">3 seconds flat</strong>. Zero terminal line, zero manager override.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[10px] text-[#c29b68] font-mono">
              <span>📱 iOS: Tap Share ➔ Add to Home Screen</span>
              <span>•</span>
              <span>Android: Tap Install App</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#111215] border-t border-[#262a34] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-[#c29b68] hover:bg-[#d4b07d] text-[#0c0d10] font-bold text-xs rounded-xl transition shadow"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
