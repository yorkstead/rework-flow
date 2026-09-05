import { NextResponse } from 'next/server';
import os from 'os';

export async function GET() {
  const interfaces = os.networkInterfaces();
  const addresses: { name: string; ip: string; type: 'wifi' | 'tailscale' | 'ethernet' | 'other'; recommended: boolean }[] = [];

  for (const [name, netInterface] of Object.entries(interfaces)) {
    if (!netInterface) continue;
    for (const iface of netInterface) {
      // Filter for IPv4 and non-internal (not 127.0.0.1)
      if (iface.family === 'IPv4' && !iface.internal) {
        const lowerName = name.toLowerCase();
        let type: 'wifi' | 'tailscale' | 'ethernet' | 'other' = 'other';
        let recommended = false;

        if (iface.address.startsWith('100.')) {
          type = 'tailscale';
        } else if (lowerName.includes('wi-fi') || lowerName.includes('wireless') || lowerName.includes('wlan')) {
          type = 'wifi';
          recommended = true; // Primary for phone pairing
        } else if (lowerName.includes('ethernet') || lowerName.includes('eth')) {
          type = 'ethernet';
          recommended = true;
        }

        // If it's a private 192.168.x.x or 10.x.x.x subnet, strongly recommend it for Wi-Fi
        if (iface.address.startsWith('192.168.') || iface.address.startsWith('10.')) {
          recommended = true;
        }

        addresses.push({
          name,
          ip: iface.address,
          type,
          recommended,
        });
      }
    }
  }

  // Sort so recommended (e.g. 192.168.4.146) is first
  addresses.sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));

  return NextResponse.json({
    addresses,
    port: 3005,
    primaryUrl: addresses.length > 0 ? `http://${addresses[0].ip}:3005` : 'http://localhost:3005',
  });
}
