
export type MobileLineStatus = "Activa" | "Suspendida" | "Cancelada" | "Sin Asignar";

export interface MobileLine {
  id: string; // e.g., LINE-001
  phoneNumber: string;
  carrier: string; // e.g., "Vodafone", "Movistar"
  planName: string; // e.g., "Plan Empresa Total"
  status: MobileLineStatus;
  simCardNumber?: string | null; // ICCID
  pukCode?: string | null;
  activationDate?: string | null; // YYYY-MM-DD
  assignedToUserId?: string | null;
  assignedToUserName?: string | null; // Denormalized for display convenience
  notes?: string | null;
}
