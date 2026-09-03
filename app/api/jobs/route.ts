import { NextResponse } from "next/server";
import { INITIAL_JOBS } from "@/lib/mock-data";
import { ReworkJob } from "@/lib/types";

// Maintain an in-memory job list across server requests
declare global {
  // eslint-disable-next-line no-var
  var __reworkJobs: ReworkJob[] | undefined;
}

if (!globalThis.__reworkJobs) {
  globalThis.__reworkJobs = [...INITIAL_JOBS];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  if (searchParams.get("reset") === "true") {
    globalThis.__reworkJobs = [...INITIAL_JOBS];
    return NextResponse.json({ success: true, jobs: globalThis.__reworkJobs });
  }

  return NextResponse.json({
    success: true,
    jobs: globalThis.__reworkJobs || INITIAL_JOBS,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ReworkJob>;

    const newJob: ReworkJob = {
      id: body.id || `RW-${Math.floor(1000 + Math.random() * 9000)}`,
      trailerNumber: body.trailerNumber || "SWFT-55219",
      carrierName: body.carrierName || "Swift Transportation",
      driverName: body.driverName || "Marcus Vance",
      driverPhone: body.driverPhone || "(720) 555-0194",
      bayNumber: body.bayNumber || "Bay 2",
      serviceType: body.serviceType || "Shifted Pallets",
      status: body.status || "Completed",
      palletsCount: body.palletsCount ?? 4,
      wrapCount: body.wrapCount ?? 2,
      cornersCount: body.cornersCount ?? 8,
      laborHours: body.laborHours ?? 1.25,
      scaleCheck: body.scaleCheck ?? true,
      debrisFee: body.debrisFee ?? true,
      totalAmount: body.totalAmount ?? 482.5,
      beforePhotos: body.beforePhotos && body.beforePhotos.length > 0 ? body.beforePhotos : [],
      afterPhotos: body.afterPhotos && body.afterPhotos.length > 0 ? body.afterPhotos : [],
      signatureData: body.signatureData || "",
      defectTags: body.defectTags || ["Mountain Shift", "Pallet Wall Collapse"],
      createdAt: body.createdAt || new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    if (!globalThis.__reworkJobs) {
      globalThis.__reworkJobs = [...INITIAL_JOBS];
    }

    // Prepend so latest job appears at top
    globalThis.__reworkJobs = [newJob, ...globalThis.__reworkJobs];

    return NextResponse.json({
      success: true,
      job: newJob,
      totalJobs: globalThis.__reworkJobs.length,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ success: false, error: "Failed to create job" }, { status: 400 });
  }
}
