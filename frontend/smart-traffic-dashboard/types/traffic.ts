export type CongestionLevel = "LOW" | "MEDIUM" | "HIGH";

export type TrafficZone = {
  id: string;
  name: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  radius: number;
  vehicleCount: number;
  density: number;
  congestionLevel: CongestionLevel;
  isCongested: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTrafficZoneInput = {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  radius: number;
  vehicleCount?: number;
};

export type UpdateTrafficZoneInput = Partial<CreateTrafficZoneInput>;

export type UpdateTrafficDensityInput = {
  zoneId: string;
  vehicleCount: number;
};

export type MeasureTrafficDensityInput = UpdateTrafficDensityInput;
