import { NextResponse } from "next/server";
import { INITIAL_JOBS } from "@/lib/mock-data";
import { ReworkJob } from "@/lib/types";

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

    if (!globalThis.__reworkJobs) {
      globalThis.__reworkJobs = [...INITIAL_JOBS];
    }

    // Check if updating an existing job (e.g. converting a Reserved truck to Completed)
    const existingIndex = body.id
      ? globalThis.__reworkJobs.findIndex((j) => j.id === body.id)
      : -1;

    const jobData: ReworkJob = {
      id: body.id || `RW-${Math.floor(1000 + Math.random() * 9000)}`,
      trailerNumber: body.trailerNumber || "SWFT-55219",
      carrierName: body.carrierName || "Swift Transportation",
      driverName: body.driverName || "Marcus Vance",
      driverPhone: body.driverPhone || "(720) 555-0194",
      bayNumber: body.bayNumber || "Bay 2",
      serviceType: body.serviceType || "Shifted Pallets",
      status: body.status || "Completed",
      eta: body.eta,
      estimatedRange: body.estimatedRange,
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
      completedAt: body.status === "Completed" ? new Date().toISOString() : undefined,
    };

    if (existingIndex >= 0) {
      globalThis.__reworkJobs[existingIndex] = {
        ...globalThis.__reworkJobs[existingIndex],
        ...jobData,
      };
    } else {
      globalThis.__reworkJobs = [jobData, ...globalThis.__reworkJobs];
    }

    return NextResponse.json({
      success: true,
      job: jobData,
      totalJobs: globalThis.__reworkJobs.length,
    });
  } catch (error) {
    console.error("Error creating/updating job:", error);
    return NextResponse.json({ success: false, error: "Failed to process job" }, { status: 400 });
  }
}
