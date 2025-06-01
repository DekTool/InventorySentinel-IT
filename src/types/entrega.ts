
export type EntregaStatus = "Pendiente" | "En Proceso" | "Completada" | "Cancelada";

// Similar a OrderItem, pero específico para lo que se entrega.
// Podría simplificarse si no se necesita tanta granularidad como en Pedidos.
export interface EntregaDetalleItem {
  id: string; // Unique ID for this detail line, e.g., auto-generated or linked to an inventory item
  inventoryItemId?: string | null; // Optional: Specific Asset Tag if linked directly
  itemName: string; // Description of the item
  quantity: number;
  serialNumber?: string | null; // If applicable and known
  notes?: string | null; // Notes specific to this item in this delivery
}

export interface Entrega {
  id: string; // e.g., ENTREGA-001
  userId: string; // ID of the user receiving the items
  userName: string; // Name of the user (denormalized for display convenience)
  deliveryDate: string; // YYYY-MM-DD, fecha en que se realiza o se programa la entrega
  status: EntregaStatus;
  items: EntregaDetalleItem[];
  // DocumentoDeEntregaId?: string | null; // ID del documento de entrega/acta firmada
  notes?: string | null; // Notas generales sobre la entrega
}
