
import type { InventoryItemType } from './inventory';

export type OrderStatus = "Solicitado" | "Comprado" | "En Tránsito" | "Recibido" | "Cancelado";

export interface OrderItem {
  id: string; // Unique ID for the order item itself, e.g., within the order
  itemName: string;
  quantity: number;
  category: InventoryItemType;
  model?: string | null;
  characteristics?: string | null;
  // Future enhancements: unitPrice, totalPrice
}

export interface Order {
  id: string; // e.g., ORDER-001
  orderDate: string; // YYYY-MM-DD
  supplier: string;
  status: OrderStatus;
  expectedArrivalDate?: string | null; // YYYY-MM-DD
  actualArrivalDate?: string | null; // YYYY-MM-DD
  items: OrderItem[];
  trackingNumber?: string | null;
  notes?: string | null;
}
