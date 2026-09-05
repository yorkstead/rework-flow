# UnionOS • The 240 Union Restaurant Operating System

> **Bespoke Hospitality Engineering by Yorkstead Systems**  
> **Client / Target:** 240 Union Restaurant (240 Union Blvd, Lakewood, CO 80228)  
> **Mission:** One-and-done, zero-SaaS, local-first POS & KDS appliance that runs for eternity.

---

## The "Run for Eternity" Philosophy

Most restaurants get trapped into paying **\$500–\$2,000/month** in SaaS rent to cloud POS giants like Toast, while being subjected to:
1. **Cloud Fragility:** When CenturyLink, Comcast, or AWS hiccups, floor terminals freeze and the kitchen stops getting tickets.
2. **Payment Tolls:** Toast extracts high card processing margins and charges proprietary hardware replacement markups.
3. **Generic Fast-Casual UX:** Cloud POS systems are optimized for counter service and fast-food turn-and-burn. They crumble during upscale coursed dining, cellar wine allocations, and 8-top corporate split-check lunches.

**UnionOS is a local-first appliance.** It runs on a local Mac Mini, mini-PC, or touchscreen terminal inside 240 Union's Wi-Fi network. It syncs across all stations with sub-5ms latency and **100% offline capability**.

---

## Tailored Specifically to 240 Union's Real Operations

### 1. The Denver Federal Center / Union Blvd Speed-Split Engine
* **The Problem:** Weekday corporate lunches (11:30 AM – 1:30 PM) where 6 to 12 federal officials, attorneys, and executives demand separate checks in under 45 minutes, with shared appetizers split fractionally.
* **The UnionOS Solution:**
  * One-tap **"Auto-Split by Seat"** splits the whole table instantly.
  * Shared appetizers (e.g. Crispy Calamari, Burrata) are portioned automatically with exact cent rounding.
  * One-tap batch closeouts for Corporate AMEX, Visa, or Apple Pay.
  * Itemized print chits with Lakewood 8.25% tax and 20% auto-grat for 6+ parties.

### 2. 60-Foot Open-Kitchen KDS & Visual Coursing
* **The Problem:** 240 Union features an open 60-foot kitchen counter with wood-burning grill, sauté, pizza oven, and pantry/raw bar stations. Toast's "Hold/Fire" or automated course timers cause food to fire before guests finish starters or get cold in the window.
* **The UnionOS Solution:**
  * **Station Routing:** Filter line tickets by Wood Grill, Sauté Line & Pasta, Wood Pizza Oven, Pantry/Raw Bar, or Expo Pass.
  * **Visual Coursing State Machine:** `HOLD` ➔ `PREP` ➔ `FIRE` ➔ `PLATED` ➔ `BUMPED`.
  * Real-time timer alerts (Green <10m, Amber 10-18m, Crimson Rush 18m+).
  * Synthesized zero-asset Web Audio kitchen chimes for crisp auditory cues.

### 3. Private Dining & Banquet Minimums
* **The Problem:** Managing The Wine Room (28 guests), The Lakewood Room (45 guests), and the Enclosed Patio requires tracking F&B minimums (\$2,200 – \$3,500), OpenTable upfront deposits, and master folios.
* **The UnionOS Solution:**
  * Live spend-to-minimum progress meters on every private dining tab.
  * Auto-credit calculation for pre-paid deposits.
  * One-click master banquet folio generation.

### 4. Sommelier Cellar & Live 86 Sync
* **The Problem:** Selling allocated reserve bottles (Silver Oak, Caymus, Jordan) only to discover the cellar is out of stock.
* **The UnionOS Solution:**
  * Live vintage, bin number, and bottle stock counter on the floor order touch screen.
  * Real-time 86 board that syncs across all floor terminals instantly.

---

## Live Demonstration Modes

### 1. Single Screen Interactive Mode
Navigate between:
* **Floor Plan** (`/` or Floor tab)
* **Terminal POS** (Table seat-ordering with speed modifiers)
* **Speed-Split & Pay** (Corporate lunch split checks)
* **60-ft Open Kitchen KDS** (Multi-station line routing)
* **Private Events & Cellar** (Room minimums & 86 board)

### 2. "Two-Screen Pitch" Mode
Click the floating **"Simulate Dual-Screen (POS + KDS)"** button in the bottom right corner to show the POS and the Kitchen Pass running side-by-side in real time:
1. Tap an order on Table 23 on the left.
2. Hit **"FIRE ENTREES"**.
3. Watch the Kitchen KDS on the right instantly flash orange, trigger the kitchen bell, and advance the line status with 0ms latency.

---

## Local Development

```bash
bun install
bun run dev --port 3005
```

Open `http://localhost:3005` in your browser.
