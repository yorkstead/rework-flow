# ReworkFlow • Real-Time Cross-Device Logistics Demo

> **Client Showcase:** Denver Express Warehousing & Cross-Docking (6030 Washington St, Denver, CO)  
> **Built By:** Yorkstead Systems  
> **Deployment Target:** Vercel (`rework-flow`)  

---

## The "Two-Device" Live Pitch Setup

This application is built specifically so you can walk into a meeting with **Steve Chapman**, **Dale Burget**, or their dock superintendent and deliver an unforgettable live demonstration:

```
┌──────────────────────────────────────────────┐       ┌──────────────────────────────────────────────┐
│            YOUR SMARTPHONE (Dock)            │       │             YOUR LAPTOP (Office)             │
│                URL: /dock                    │       │                URL: /office                  │
├──────────────────────────────────────────────┤       ├──────────────────────────────────────────────┤
│ • Forklift operator touch interface          │       │ • Office Billing & Dispatch board            │
│ • Intake trailer SWFT-55219 in Bay 2         │       │ • Live bay occupancy & revenue cards         │
│ • Capture Before shifted-cargo photos        │       │ • Real-time polling listener (1.5s)          │
│ • Tap supplies: +4 pallets, +2 wrap, 1.25h   │       │ • Auto-plays chime when job is received      │
│ • Have driver sign glass with finger         │       │ • View/Print signed Evidence Certificate     │
│ • Tap "DISPATCH CERTIFICATE"                 │ ───►  │ • One-click QuickBooks CSV export            │
└──────────────────────────────────────────────┘       └──────────────────────────────────────────────┘
```

---

## Deploying to Vercel in 60 Seconds

1. **Create GitHub Repo:**
   ```bash
   cd demos/rework-flow
   git init
   git add .
   git commit -m "Initial commit of ReworkFlow"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USER/rework-flow.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   * Go to [vercel.com/new](https://vercel.com/new).
   * Select the `rework-flow` repository.
   * Framework Preset: **Next.js** (auto-detected).
   * Click **Deploy**.

3. **Open on Both Devices:**
   * On your laptop: Open `https://rework-flow-xxx.vercel.app/office`
   * On your phone: Open `https://rework-flow-xxx.vercel.app/dock`

---

## Local Development

```bash
cd demos/rework-flow
bun install
bun run dev
```

Open **http://localhost:3000** for the launchpad, or directly open:
* **http://localhost:3000/dock** (Phone View)
* **http://localhost:3000/office** (Laptop View)

---

## Features & Highlights

* **Offline-Resilient Mobile UI**: Big touch-friendly increment counters (`+` / `-`) for GMA pallets, wrap, and labor hours designed for work gloves and glare.
* **Tamper-Proof Audit Stamps**: Automatically stamps GPS coordinates (`39.8058° N, 104.9877° W • Bay 2`) and Colorado Mountain Time onto all photo records.
* **Driver Glass Signature Pad**: HTML5 canvas signature capture with legal release text.
* **Instant Branded PDF/Print Packet**: Official Denver Express header with DOT/MC #, side-by-side Before/After comparison, and itemized bill.
* **Web Audio Notification Chime**: Synthesizes a clean two-tone chime via native browser audio API without external audio dependencies.
* **Accounting CSV Export**: Downloads a ready-to-import spreadsheet for QuickBooks or Xero.
