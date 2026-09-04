export interface ReworkJob {
  id: string;
  trailerNumber: string;
  carrierName: string;
  driverName: string;
  driverPhone: string;
  bayNumber: string;
  serviceType: "Shifted Pallets" | "Axle Rebalance" | "Pallet Swap" | "Floor Transload";
  status: "Reserved" | "In Progress" | "Completed" | "Billed";
  eta?: string;
  estimatedRange?: string;
  palletsCount: number;
  wrapCount: number;
  cornersCount: number;
  laborHours: number;
  scaleCheck: boolean;
  debrisFee: boolean;
  totalAmount: number;
  beforePhotos: string[];
  afterPhotos: string[];
  signatureData: string;
  defectTags: string[];
  createdAt: string;
  completedAt?: string;
}

export const RATES = {
  pallets: 18.50,
  wrap: 25.00,
  corners: 3.00,
  labor: 125.00,
  scale: 35.00,
  debris: 45.00,
};
