export type LicenseStatus = "Activa" | "Expirada" | "Sin Asignar" | "Archivada";
export type LicenseType = 
  | "Perpetua" 
  | "Suscripción Anual" 
  | "Suscripción Mensual" 
  | "OEM" 
  | "Freeware" 
  | "Shareware" 
  | "Otro";

export interface License {
  id: string; // e.g., LIC-001
  softwareName: string;
  licenseKey: string;
  licenseType: LicenseType;
  seats: number; // Number of users/devices allowed
  status: LicenseStatus;
  purchaseDate?: string | null; // YYYY-MM-DD
  expirationDate?: string | null; // YYYY-MM-DD, for subscriptions
  vendor?: string | null;
  assignedTo?: string | null; // Could be a user ID, device ID, or department name
  notes?: string | null;
}