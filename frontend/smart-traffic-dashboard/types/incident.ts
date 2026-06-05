export type IncidentType =
  | "ACCIDENT"
  | "TRAVAUX"
  | "ROUTE_FERMEE"
  | "EMBOUTEILLAGE";

export type IncidentStatus = "SIGNALE" | "EN_COURS" | "RESOLU";

export type Incident = {
  id: string;
  title: string;
  description?: string | null;
  type: IncidentType;
  status: IncidentStatus;
  latitude: number;
  longitude: number;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateIncidentInput = {
  title: string;
  description?: string;
  type: IncidentType;
  latitude: number;
  longitude: number;
  address?: string;
};

export type UpdateIncidentInput = Partial<CreateIncidentInput>;

export type UpdateIncidentStatusInput = {
  id: string;
  status: IncidentStatus;
};
