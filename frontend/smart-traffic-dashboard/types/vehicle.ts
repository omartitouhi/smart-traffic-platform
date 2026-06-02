export type Vehicle = {
  id: string;
  matricule: string;
  brand: string;
  model: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type VehiclePosition = {
  id: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number;
  recordedAt: string;
};
