import { ReworkJob } from "./types";

export const SAMPLE_BEFORE_1 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231a2332"/><rect x="40" y="40" width="520" height="320" fill="%23243147" stroke="%233a4d6b" stroke-width="3"/><text x="60" y="80" fill="%23e2e8f0" font-family="monospace" font-size="16" font-weight="bold">TRAILER REAR INTERIOR - INBOUND SHIFT</text><text x="60" y="105" fill="%23ef4444" font-family="sans-serif" font-size="14" font-weight="bold">CRITICAL MOUNTAIN SHIFT DETECTED</text><g transform="rotate(-14 260 220)"><rect x="180" y="140" width="160" height="150" fill="%23b45309" stroke="%2378350f" stroke-width="4"/><rect x="170" y="290" width="180" height="24" fill="%23d97706"/><line x1="180" y1="180" x2="340" y2="180" stroke="%2378350f" stroke-width="2"/><text x="200" y="220" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold">LEANING CARGO</text></g><g transform="rotate(8 420 220)"><rect x="360" y="150" width="140" height="140" fill="%2392400e" stroke="%2378350f" stroke-width="3"/><rect x="350" y="290" width="160" height="22" fill="%23d97706"/></g><rect x="40" y="325" width="520" height="35" fill="%230b1320" opacity="0.85"/><text x="50" y="348" fill="%23fbbf24" font-family="monospace" font-size="11">DENVER EXPRESS DOCK BAY 2 • GPS: 39.8058°N, 104.9877°W • MT STAMPED</text></svg>`;

export const SAMPLE_BEFORE_2 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e293b"/><rect x="50" y="40" width="500" height="320" fill="%23334155" stroke="%23475569" stroke-width="2"/><text x="70" y="75" fill="%23f8fafc" font-family="monospace" font-size="16" font-weight="bold">DETAIL INSPECTION: BROKEN PALLET RUNNERS</text><rect x="90" y="110" width="420" height="180" fill="%23a16207" stroke="%23713f12" stroke-width="3"/><line x1="90" y1="200" x2="510" y2="200" stroke="%23713f12" stroke-width="4"/><path d="M 220 280 L 290 295 L 340 270" stroke="%23ef4444" stroke-width="8" fill="none"/><text x="180" y="335" fill="%23f87171" font-family="sans-serif" font-size="15" font-weight="bold">CRUSHED PALLET BASE • NON-FORKLIFT COMPLIANT</text><rect x="50" y="330" width="500" height="30" fill="%230f172a" opacity="0.9"/><text x="60" y="350" fill="%2338bdf8" font-family="monospace" font-size="11">EVIDENCE LOG #RW-0842-B2 • CERTIFIED AUDIT TRAIL</text></svg>`;

export const SAMPLE_AFTER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><rect x="40" y="40" width="520" height="320" fill="%231e293b" stroke="%2310b981" stroke-width="3"/><text x="60" y="80" fill="%2310b981" font-family="sans-serif" font-size="18" font-weight="bold">[REWORK COMPLETE: ROAD-READY AND BANDED]</text><rect x="160" y="110" width="280" height="190" fill="%230284c7" opacity="0.85" stroke="%2338bdf8" stroke-width="3"/><line x1="160" y1="160" x2="440" y2="160" stroke="%23ffffff" stroke-width="4" stroke-dasharray="8 6"/><line x1="160" y1="210" x2="440" y2="210" stroke="%23ffffff" stroke-width="4" stroke-dasharray="8 6"/><rect x="150" y="300" width="300" height="26" fill="%23b45309" stroke="%2378350f" stroke-width="2"/><text x="180" y="145" fill="%23ffffff" font-family="sans-serif" font-size="13" font-weight="bold">NEW GMA GRADE-A PALLET</text><text x="180" y="195" fill="%23ffffff" font-family="sans-serif" font-size="13" font-weight="bold">80-GAUGE TIGHT SHRINKWRAP</text><text x="180" y="245" fill="%23ffffff" font-family="sans-serif" font-size="13" font-weight="bold">CORNER BOARDS SECURED</text><rect x="40" y="325" width="520" height="35" fill="%23022c22" opacity="0.9"/><text x="50" y="348" fill="%2334d399" font-family="monospace" font-size="11">INSPECTED BY: DENVER EXPRESS DOCK BAY 2 - RELEASE CONFIRMED</text></svg>`;

export const SAMPLE_SIGNATURE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120"><path d="M 30 70 Q 70 20 110 50 T 170 60 Q 210 30 250 80 T 320 45 Q 360 40 380 75" fill="none" stroke="%230f172a" stroke-width="4" stroke-linecap="round"/><text x="40" y="105" font-family="sans-serif" font-size="13" fill="%2364748b">Marcus Vance - OTR Driver</text></svg>`;

export const INITIAL_JOBS: ReworkJob[] = [
  {
    id: "RW-0841",
    trailerNumber: "KNIG-44102",
    carrierName: "Knight Transportation",
    driverName: "David Ross",
    driverPhone: "(303) 555-9812",
    bayNumber: "Bay 4",
    serviceType: "Axle Rebalance",
    status: "Billed",
    palletsCount: 0,
    wrapCount: 0,
    cornersCount: 0,
    laborHours: 1.5,
    scaleCheck: true,
    debrisFee: false,
    totalAmount: 385.0,
    beforePhotos: [SAMPLE_BEFORE_1],
    afterPhotos: [SAMPLE_AFTER],
    signatureData: SAMPLE_SIGNATURE,
    defectTags: ["Colorado Port of Entry Overweight", "Drive Axle Redistribution"],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 1.2).toISOString(),
  },
  {
    id: "RW-0840",
    trailerNumber: "TQLX-90184",
    carrierName: "TQL Brokered / Apex Line",
    driverName: "John Miller",
    driverPhone: "(720) 555-4311",
    bayNumber: "Bay 6",
    serviceType: "Floor Transload",
    status: "Billed",
    palletsCount: 26,
    wrapCount: 4,
    cornersCount: 0,
    laborHours: 3.0,
    scaleCheck: false,
    debrisFee: true,
    totalAmount: 920.0,
    beforePhotos: [SAMPLE_BEFORE_2],
    afterPhotos: [SAMPLE_AFTER],
    signatureData: SAMPLE_SIGNATURE,
    defectTags: ["Container Breakdown", "Floor to Pallet Transload"],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 3.5).toISOString(),
  },
];
