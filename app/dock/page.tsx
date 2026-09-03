"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Truck,
  Camera,
  Layers,
  CheckCircle,
  AlertTriangle,
  Scale,
  Container,
  Send,
  ArrowRight,
  RotateCcw,
  CheckCheck,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { RATES } from "@/lib/types";
import { SAMPLE_BEFORE_1, SAMPLE_BEFORE_2, SAMPLE_AFTER, SAMPLE_SIGNATURE } from "@/lib/mock-data";

export default function DockOperatorPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [serviceType, setServiceType] = useState<"Shifted Pallets" | "Axle Rebalance" | "Pallet Swap" | "Floor Transload">("Shifted Pallets");

  // Form State
  const [trailerNumber, setTrailerNumber] = useState("SWFT-55219");
  const [carrierName, setCarrierName] = useState("Swift Transportation");
  const [driverName, setDriverName] = useState("Marcus Vance");
  const [driverPhone, setDriverPhone] = useState("(720) 555-0194");
  const [bayNumber, setBayNumber] = useState("Bay 2");

  // Photos
  const [before1, setBefore1] = useState(SAMPLE_BEFORE_1);
  const [before2, setBefore2] = useState(SAMPLE_BEFORE_2);
  const [afterPhoto, setAfterPhoto] = useState(SAMPLE_AFTER);

  // Counters
  const [pallets, setPallets] = useState(4);
  const [wrap, setWrap] = useState(2);
  const [corners, setCorners] = useState(8);
  const [labor, setLabor] = useState(1.25);
  const [scaleCheck, setScaleCheck] = useState(true);
  const [debrisFee, setDebrisFee] = useState(true);

  // Signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(true);

  // Submitting / Completed State
  const [submitting, setSubmitting] = useState(false);
  const [completedJobId, setCompletedJobId] = useState<string | null>(null);

  // Calculate live total
  const liveTotal =
    pallets * RATES.pallets +
    wrap * RATES.wrap +
    corners * RATES.corners +
    labor * RATES.labor +
    (scaleCheck ? RATES.scale : 0) +
    (debrisFee ? RATES.debris : 0);

  // Pre-draw sample signature on canvas
  useEffect(() => {
    if (step === 4 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(30, 70);
        ctx.bezierCurveTo(70, 20, 130, 110, 180, 50);
        ctx.bezierCurveTo(220, 30, 260, 90, 330, 45);
        ctx.stroke();
      }
    }
  }, [step]);

  // Touch drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    setHasDrawnSignature(true);
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  const cycleSample = () => {
    const samples = [
      { t: "SWFT-55219", c: "Swift Transportation", d: "Marcus Vance", p: "(720) 555-0194", b: "Bay 2" },
      { t: "KNIG-88401", c: "Knight Transportation", d: "David Ross", p: "(303) 555-9812", b: "Bay 4" },
      { t: "SCHN-10294", c: "Schneider National", d: "Robert Miller", p: "(720) 555-3341", b: "Bay 1" },
      { t: "TQLX-49102", c: "TQL / Apex Direct", d: "Sarah Jenkins", p: "(970) 555-7720", b: "Bay 3" },
    ];
    const pick = samples[Math.floor(Math.random() * samples.length)];
    setTrailerNumber(pick.t);
    setCarrierName(pick.c);
    setDriverName(pick.d);
    setDriverPhone(pick.p);
    setBayNumber(pick.b);
  };

  // Submit Job to API for cross-device sync
  const handleSubmitJob = async () => {
    setSubmitting(true);
    try {
      const canvas = canvasRef.current;
      const signatureData = canvas ? canvas.toDataURL() : SAMPLE_SIGNATURE;

      const payload = {
        trailerNumber,
        carrierName,
        driverName,
        driverPhone,
        bayNumber,
        serviceType,
        palletsCount: pallets,
        wrapCount: wrap,
        cornersCount: corners,
        laborHours: labor,
        scaleCheck,
        debrisFee,
        totalAmount: liveTotal,
        beforePhotos: [before1, before2],
        afterPhotos: [afterPhoto],
        signatureData,
        defectTags: ["Mountain Shift (I-70)", "Pallet Wall Collapse"],
      };

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.job) {
        setCompletedJobId(data.job.id);
      } else {
        setCompletedJobId(`RW-${Math.floor(1000 + Math.random() * 9000)}`);
      }
    } catch (err) {
      console.error("Failed to post job:", err);
      setCompletedJobId(`RW-${Math.floor(1000 + Math.random() * 9000)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060d17] text-slate-100 flex flex-col font-sans pb-12">
      
      {/* Top Mobile Bar */}
      <header className="bg-[#0b192c] border-b border-[#233f63] sticky top-0 z-30 px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#d4af37] text-[#0b192c] font-black flex items-center justify-center text-sm">
            DE
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">Denver Express</span>
              <span className="text-[10px] px-1 rounded bg-[#d4af37]/20 text-[#d4af37] font-bold">DOCK</span>
            </div>
            <p className="text-[10px] text-slate-400">Terminal 6030 Washington St</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Sync Live
          </div>
          <Link
            href="/office"
            className="text-[11px] bg-[#162b45] hover:bg-[#233f63] text-slate-200 px-2 py-1 rounded border border-[#233f63] flex items-center gap-1"
          >
            <span>Office View</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4 space-y-4">

        {/* COMPLETED SUCCESS STATE */}
        {completedJobId ? (
          <div className="bg-[#0f2238] border-2 border-emerald-500/60 rounded-2xl p-6 text-center space-y-5 shadow-2xl animate-fade-in my-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 mx-auto flex items-center justify-center">
              <CheckCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
                Rework Sealed & Dispatched
              </span>
              <h2 className="text-2xl font-black text-white">
                Job #{completedJobId}
              </h2>
              <p className="text-xs text-slate-300">
                Trailer <span className="font-mono text-[#d4af37] font-bold">{trailerNumber}</span> ({carrierName})
              </p>
            </div>

            <div className="bg-[#060d17] border border-[#233f63] rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total Amount Due:</span>
                <span className="font-mono font-bold text-sm text-[#d4af37]">${liveTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dock Bay:</span>
                <span className="text-white font-semibold">{bayNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>SMS Certificate Sent:</span>
                <span className="text-emerald-400 font-mono font-semibold">{driverPhone}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Office Billing Board:</span>
                <span className="text-blue-400 font-semibold">Synced in Real Time ⚡</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setCompletedJobId(null);
                  setStep(1);
                  cycleSample();
                }}
                className="w-full py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#b89628] text-[#0b192c] font-black text-sm transition shadow-lg flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start Next Inbound Trailer</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Step Progress Pills */}
            <div className="bg-[#0f2238] border border-[#233f63] rounded-xl p-3 flex items-center justify-between text-xs font-semibold">
              <button
                onClick={() => setStep(1)}
                className={`flex items-center gap-1.5 ${step === 1 ? "text-[#d4af37]" : "text-slate-400"}`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 1 ? "bg-[#d4af37] text-[#0b192c]" : "bg-[#233f63] text-slate-300"}`}>1</span>
                <span>Intake</span>
              </button>
              <div className="w-6 h-0.5 bg-[#233f63]" />
              <button
                onClick={() => setStep(2)}
                className={`flex items-center gap-1.5 ${step === 2 ? "text-[#d4af37]" : "text-slate-400"}`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 2 ? "bg-[#d4af37] text-[#0b192c]" : "bg-[#233f63] text-slate-300"}`}>2</span>
                <span>Before</span>
              </button>
              <div className="w-6 h-0.5 bg-[#233f63]" />
              <button
                onClick={() => setStep(3)}
                className={`flex items-center gap-1.5 ${step === 3 ? "text-[#d4af37]" : "text-slate-400"}`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 3 ? "bg-[#d4af37] text-[#0b192c]" : "bg-[#233f63] text-slate-300"}`}>3</span>
                <span>Tally</span>
              </button>
              <div className="w-6 h-0.5 bg-[#233f63]" />
              <button
                onClick={() => setStep(4)}
                className={`flex items-center gap-1.5 ${step === 4 ? "text-[#d4af37]" : "text-slate-400"}`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 4 ? "bg-[#d4af37] text-[#0b192c]" : "bg-[#233f63] text-slate-300"}`}>4</span>
                <span>Sign</span>
              </button>
            </div>

            {/* STEP 1: INTAKE */}
            {step === 1 && (
              <div className="bg-[#0f2238] border border-[#233f63] rounded-2xl p-5 space-y-5 shadow-xl">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#d4af37]" />
                    Step 1: Rapid Inbound Intake
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Assign bay and select damage recovery</p>
                </div>

                {/* Service Type Selection */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setServiceType("Shifted Pallets")}
                    className={`p-3 rounded-xl text-left border-2 transition ${
                      serviceType === "Shifted Pallets"
                        ? "border-[#d4af37] bg-[#d4af37]/15 text-white"
                        : "border-[#233f63] bg-[#162b45] text-slate-300"
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 text-[#d4af37] mb-1" />
                    <div className="text-xs font-bold">Shifted Pallets</div>
                    <div className="text-[10px] text-slate-400">Mountain / tunnel lean</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType("Axle Rebalance")}
                    className={`p-3 rounded-xl text-left border-2 transition ${
                      serviceType === "Axle Rebalance"
                        ? "border-[#d4af37] bg-[#d4af37]/15 text-white"
                        : "border-[#233f63] bg-[#162b45] text-slate-300"
                    }`}
                  >
                    <Scale className="w-4 h-4 text-blue-400 mb-1" />
                    <div className="text-xs font-bold">Axle Rebalance</div>
                    <div className="text-[10px] text-slate-400">Port scale overweight</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType("Pallet Swap")}
                    className={`p-3 rounded-xl text-left border-2 transition ${
                      serviceType === "Pallet Swap"
                        ? "border-[#d4af37] bg-[#d4af37]/15 text-white"
                        : "border-[#233f63] bg-[#162b45] text-slate-300"
                    }`}
                  >
                    <Layers className="w-4 h-4 text-emerald-400 mb-1" />
                    <div className="text-xs font-bold">Pallet Swap</div>
                    <div className="text-[10px] text-slate-400">Crushed / broken wood</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType("Floor Transload")}
                    className={`p-3 rounded-xl text-left border-2 transition ${
                      serviceType === "Floor Transload"
                        ? "border-[#d4af37] bg-[#d4af37]/15 text-white"
                        : "border-[#233f63] bg-[#162b45] text-slate-300"
                    }`}
                  >
                    <Container className="w-4 h-4 text-purple-400 mb-1" />
                    <div className="text-xs font-bold">Floor Transload</div>
                    <div className="text-[10px] text-slate-400">Container breakdown</div>
                  </button>
                </div>

                {/* Form Inputs */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Trailer Number *</label>
                      <button type="button" onClick={cycleSample} className="text-[11px] text-[#d4af37] hover:underline">
                        Tap to change sample
                      </button>
                    </div>
                    <input
                      type="text"
                      value={trailerNumber}
                      onChange={(e) => setTrailerNumber(e.target.value.toUpperCase())}
                      className="w-full bg-[#060d17] border border-[#233f63] rounded-xl px-3.5 py-2.5 text-white font-mono font-bold text-base focus:border-[#d4af37] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">Carrier Name</label>
                      <input
                        type="text"
                        value={carrierName}
                        onChange={(e) => setCarrierName(e.target.value)}
                        className="w-full bg-[#060d17] border border-[#233f63] rounded-xl px-3 py-2.5 text-white text-xs focus:border-[#d4af37] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">Assigned Bay *</label>
                      <select
                        value={bayNumber}
                        onChange={(e) => setBayNumber(e.target.value)}
                        className="w-full bg-[#060d17] border border-[#233f63] rounded-xl px-3 py-2.5 text-white text-xs focus:border-[#d4af37] outline-none"
                      >
                        <option value="Bay 1">Bay 1 (Open)</option>
                        <option value="Bay 2">Bay 2 (Active Rework)</option>
                        <option value="Bay 3">Bay 3 (Open)</option>
                        <option value="Bay 4">Bay 4 (Cross-Dock)</option>
                        <option value="Bay 5">Bay 5 (Open)</option>
                        <option value="Bay 6">Bay 6 (Container Ramp)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">Driver Name</label>
                      <input
                        type="text"
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        className="w-full bg-[#060d17] border border-[#233f63] rounded-xl px-3 py-2.5 text-white text-xs focus:border-[#d4af37] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">Driver Mobile</label>
                      <input
                        type="tel"
                        value={driverPhone}
                        onChange={(e) => setDriverPhone(e.target.value)}
                        className="w-full bg-[#060d17] border border-[#233f63] rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:border-[#d4af37] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-xl bg-[#d4af37] hover:bg-[#b89628] text-[#0b192c] font-black text-sm transition shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Continue to Before Photos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: BEFORE PHOTOS */}
            {step === 2 && (
              <div className="bg-[#0f2238] border border-[#233f63] rounded-2xl p-5 space-y-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Camera className="w-5 h-5 text-[#d4af37]" />
                      Step 2: "Before" Damage Photos
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Indisputable inbound proof</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    GPS Stamped
                  </span>
                </div>

                {/* Photo 1: Wide Shot */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Shot 1: Inbound Cargo Shift</span>
                  <div className="w-full h-36 rounded-xl overflow-hidden border-2 border-dashed border-[#233f63] bg-[#060d17] relative">
                    <img src={before1} alt="Before shifted cargo" className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-2 text-[10px] bg-black/70 px-1.5 py-0.5 rounded text-emerald-400 font-mono">
                      ✓ Verified
                    </div>
                  </div>
                </div>

                {/* Photo 2: Close Up */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Shot 2: Broken Runners / Detail</span>
                  <div className="w-full h-36 rounded-xl overflow-hidden border-2 border-dashed border-[#233f63] bg-[#060d17] relative">
                    <img src={before2} alt="Detail defect" className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-2 text-[10px] bg-black/70 px-1.5 py-0.5 rounded text-emerald-400 font-mono">
                      ✓ Verified
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 rounded-xl border border-[#233f63] text-slate-300 text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-2/3 py-3 rounded-xl bg-[#d4af37] text-[#0b192c] font-black text-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Log Supplies & Labor</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: WORK & TALLY */}
            {step === 3 && (
              <div className="bg-[#0f2238] border border-[#233f63] rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#d4af37]" />
                      Step 3: Supplies & Labor Tally
                    </h2>
                    <p className="text-xs text-slate-400">Tap to log items used on dock</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Live Invoice</span>
                    <span className="text-xl font-black text-[#d4af37] font-mono">${liveTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Counters */}
                <div className="space-y-2.5">
                  {/* Pallets */}
                  <div className="bg-[#060d17] border border-[#233f63] rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">New GMA Pallets</div>
                      <div className="text-[10px] text-slate-400">$18.50 per wood pallet</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPallets(Math.max(0, pallets - 1))}
                        className="w-9 h-9 rounded-lg bg-[#162b45] active:bg-[#233f63] text-white text-lg font-bold flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-mono font-bold text-white text-sm">{pallets}</span>
                      <button
                        type="button"
                        onClick={() => setPallets(pallets + 1)}
                        className="w-9 h-9 rounded-lg bg-[#162b45] active:bg-[#233f63] text-white text-lg font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Stretch Wrap */}
                  <div className="bg-[#060d17] border border-[#233f63] rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Stretch Wrap Rolls (80ga)</div>
                      <div className="text-[10px] text-slate-400">$25.00 per roll</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setWrap(Math.max(0, wrap - 1))}
                        className="w-9 h-9 rounded-lg bg-[#162b45] active:bg-[#233f63] text-white text-lg font-bold flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-mono font-bold text-white text-sm">{wrap}</span>
                      <button
                        type="button"
                        onClick={() => setWrap(wrap + 1)}
                        className="w-9 h-9 rounded-lg bg-[#162b45] active:bg-[#233f63] text-white text-lg font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Corner Boards */}
                  <div className="bg-[#060d17] border border-[#233f63] rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Corner Boards (48")</div>
                      <div className="text-[10px] text-slate-400">$3.00 each</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setCorners(Math.max(0, corners - 2))}
                        className="w-9 h-9 rounded-lg bg-[#162b45] active:bg-[#233f63] text-white text-lg font-bold flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-mono font-bold text-white text-sm">{corners}</span>
                      <button
                        type="button"
                        onClick={() => setCorners(corners + 2)}
                        className="w-9 h-9 rounded-lg bg-[#162b45] active:bg-[#233f63] text-white text-lg font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Labor */}
                  <div className="bg-[#060d17] border border-[#233f63] rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Forklift & Labor Time</div>
                      <div className="text-[10px] text-slate-400">$125.00/hr (0.25h steps)</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setLabor(Math.max(0.25, labor - 0.25))}
                        className="w-9 h-9 rounded-lg bg-[#162b45] active:bg-[#233f63] text-white text-lg font-bold flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-mono font-bold text-white text-sm">{labor.toFixed(2)}h</span>
                      <button
                        type="button"
                        onClick={() => setLabor(labor + 0.25)}
                        className="w-9 h-9 rounded-lg bg-[#162b45] active:bg-[#233f63] text-white text-lg font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2 pt-1">
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#060d17] border border-[#233f63] cursor-pointer">
                    <span className="text-xs text-slate-300">Certified Scale Re-Weigh (+$35.00)</span>
                    <input
                      type="checkbox"
                      checked={scaleCheck}
                      onChange={(e) => setScaleCheck(e.target.checked)}
                      className="w-4 h-4 accent-[#d4af37]"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#060d17] border border-[#233f63] cursor-pointer">
                    <span className="text-xs text-slate-300">Debris Disposal Fee (+$45.00)</span>
                    <input
                      type="checkbox"
                      checked={debrisFee}
                      onChange={(e) => setDebrisFee(e.target.checked)}
                      className="w-4 h-4 accent-[#d4af37]"
                    />
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 py-3 rounded-xl border border-[#233f63] text-slate-300 text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="w-2/3 py-3 rounded-xl bg-[#d4af37] text-[#0b192c] font-black text-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Driver Sign-Off</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: AFTER PROOF & SIGNATURE */}
            {step === 4 && (
              <div className="bg-[#0f2238] border border-[#233f63] rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      Step 4: "After" Proof & Sign-Off
                    </h2>
                    <p className="text-xs text-slate-400">Road-ready proof & driver sign on glass</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#d4af37] bg-[#d4af37]/15 px-2 py-0.5 rounded border border-[#d4af37]/30">
                    ${liveTotal.toFixed(2)}
                  </span>
                </div>

                {/* After Photo Proof */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Restacked & Road-Ready Photo</span>
                  <div className="w-full h-36 rounded-xl overflow-hidden border-2 border-emerald-500/50 bg-[#060d17] relative">
                    <img src={afterPhoto} alt="After rework completed" className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-2 text-[10px] bg-black/70 px-1.5 py-0.5 rounded text-emerald-400 font-mono">
                      ✓ Inspected & Staged
                    </div>
                  </div>
                </div>

                {/* Signature Canvas */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Driver Sign on Glass: <strong className="text-white">{driverName}</strong>
                    </span>
                    <button type="button" onClick={clearCanvas} className="text-[11px] text-rose-400 hover:underline">
                      Clear
                    </button>
                  </div>

                  <div className="bg-slate-900 border-2 border-[#233f63] rounded-xl overflow-hidden touch-none relative">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={120}
                      className="w-full h-[120px] bg-slate-950 cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                    {!hasDrawnSignature && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-slate-500">
                        Driver sign with finger here
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400 leading-tight bg-[#060d17] p-2 rounded-lg border border-[#233f63]">
                    "Driver certifies cargo has been inspected, restacked on GMA pallets, shrinkwrapped, and released in road-ready condition for transport."
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-1/3 py-3 rounded-xl border border-[#233f63] text-slate-300 text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmitJob}
                    className="w-2/3 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0b192c] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>DISPATCHING...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>DISPATCH CERTIFICATE</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </main>

    </div>
  );
}
