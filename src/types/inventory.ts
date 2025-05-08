
export type InventoryItemStatus = "En Stock" | "Asignado" | "Mantenimiento" | "Retirado";
export type InventoryItemType = 
  | "Portátil" 
  | "Sobremesa" 
  | "Monitor" 
  | "Móvil" 
  | "Tablet" 
  | "Teclado" 
  | "Ratón" 
  | "Docking Station" 
  | "Impresora" 
  | "Servidor" 
  | "Redes" 
  | "Almacenamiento" 
  | "Otro";

export interface InventoryItem {
  id: string; // e.g., ASSET-001
  name: string;
  type: InventoryItemType;
  status: InventoryItemStatus;
  barcode: string;
  serialNumber?: string | null;
  purchaseDate?: string | null; // YYYY-MM-DD
  warrantyEndDate?: string | null; // YYYY-MM-DD
  notes?: string | null;
  assignedTo?: string | null; // Display name/email string for who it's assigned to, e.g., "Alice Smith (asmith@example.com)"
  assignedToId?: string | null; // User ID, e.g., "USR-001"
}
