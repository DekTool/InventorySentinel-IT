
import type { InventoryItem, InventoryItemStatus, InventoryItemType } from '@/types/inventory';

let mockInventoryItems: InventoryItem[] = [
  { 
    id: 'ASSET-001', 
    name: 'Laptop Pro 15"', 
    type: 'Portátil', 
    status: 'Asignado', 
    assignedTo: 'Alice Smith (asmith@example.com)', 
    assignedToId: 'USR-001', 
    barcode: '123456789012', 
    serialNumber: 'SN123XYZ', 
    purchaseDate: '2023-01-15', 
    warrantyEndDate: '2026-01-14', 
    notes: 'Pequeño arañazo en la tapa.' 
  },
  { 
    id: 'ASSET-002', 
    name: 'Ratón Inalámbrico X', 
    type: 'Ratón', 
    status: 'En Stock', 
    assignedTo: null, 
    assignedToId: null, 
    barcode: '987654321098', 
    serialNumber: 'SN456ABC', 
    purchaseDate: '2023-05-20', 
    warrantyEndDate: '2024-05-19', 
    notes: '' 
  },
  { 
    id: 'ASSET-003', 
    name: 'Docking Station Z', 
    type: 'Docking Station', 
    status: 'Asignado', 
    assignedTo: 'Bob Johnson (bjohnson@example.com)', 
    assignedToId: 'USR-002', 
    barcode: '112233445566', 
    serialNumber: 'SNDEF789', 
    purchaseDate: '2022-11-01', 
    warrantyEndDate: '2024-10-31', 
    notes: 'Requiere adaptador de corriente específico.' 
  },
  { 
    id: 'ASSET-004', 
    name: 'Teléfono Móvil S23', 
    type: 'Móvil', 
    status: 'En Stock', 
    assignedTo: null, 
    assignedToId: null, 
    barcode: '778899001122', 
    serialNumber: 'SNMOB001', 
    purchaseDate: '2024-02-10', 
    warrantyEndDate: '2026-02-09', 
    notes: 'Versión desbloqueada.' 
  },
  { 
    id: 'ASSET-005', 
    name: 'Monitor 27" 4K', 
    type: 'Monitor', 
    status: 'Asignado', 
    assignedTo: 'Alice Smith (asmith@example.com)', 
    assignedToId: 'USR-001', 
    barcode: '334455667788', 
    serialNumber: 'SNMON4K01', 
    purchaseDate: '2023-08-05', 
    warrantyEndDate: '2026-08-04', 
    notes: 'Incluye cable HDMI.' 
  },
   { id: 'ASSET-006', name: 'Keyboard K1', type: 'Teclado', status: 'Asignado', assignedToId: 'USR-004', assignedTo: 'Diana Prince (dprince@example.com)', barcode: 'KB001', purchaseDate: '2021-06-01', serialNumber: 'SNKB001', warrantyEndDate: '2023-05-31', notes: '' },
   { id: 'ASSET-007', name: 'Dev Laptop X', type: 'Portátil', status: 'Asignado', assignedToId: 'USR-005', assignedTo: 'Ethan Hunt (ehunt@example.com)', barcode: 'DEVLP01', purchaseDate: '2020-01-15', serialNumber: 'SNDEVLP01', warrantyEndDate: '2023-01-14', notes: 'For development purposes' },
   { id: 'ASSET-008', name: 'Server Rack R1', type: 'Servidor', status: 'Asignado', assignedToId: 'USR-005', assignedTo: 'Ethan Hunt (ehunt@example.com)', barcode: 'SRVR01', purchaseDate: '2020-01-15', serialNumber: 'SNSRVR01', warrantyEndDate: '2025-01-14', notes: 'Main web server' },
];

export async function getAllInventoryItems(): Promise<InventoryItem[]> {
  console.log("Fetching all inventory items (mock)");
  await new Promise(resolve => setTimeout(resolve, 50));
  return [...mockInventoryItems];
}

export async function getInventoryItemById(id: string): Promise<InventoryItem | undefined> {
  console.log(`Fetching inventory item by ID: ${id} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 50));
  const item = mockInventoryItems.find(i => i.id === id);
  return item ? { ...item } : undefined;
}

export async function findInventoryItemByBarcodeOrId(query: string): Promise<InventoryItem | undefined> {
  console.log(`Finding inventory item by barcode/ID: ${query} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 50));
  const item = mockInventoryItems.find(i => i.barcode === query || i.id === query);
  return item ? { ...item } : undefined;
}

export async function addInventoryItem(itemData: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
  console.log("Adding new inventory item (mock):", itemData);
  await new Promise(resolve => setTimeout(resolve, 100));
  const newId = `ASSET-${String(mockInventoryItems.length + 1).padStart(3, '0')}`;
  const newItem: InventoryItem = {
    id: newId,
    ...itemData,
  };
  mockInventoryItems.push(newItem);
  // TODO: If itemData.assignedToId is set, update the corresponding user's assignedItems count in user-data.ts
  return { ...newItem };
}

export async function updateInventoryItem(id: string, itemUpdateData: Partial<Omit<InventoryItem, 'id'>>): Promise<InventoryItem | null> {
  console.log(`Updating inventory item ID: ${id} (mock) with data:`, itemUpdateData);
  await new Promise(resolve => setTimeout(resolve, 100));
  const itemIndex = mockInventoryItems.findIndex(i => i.id === id);
  if (itemIndex !== -1) {
    // TODO: Handle changes to assignedToId to update user's assignedItems count
    mockInventoryItems[itemIndex] = { ...mockInventoryItems[itemIndex], ...itemUpdateData };
    return { ...mockInventoryItems[itemIndex] };
  }
  return null;
}

export async function deleteInventoryItem(id: string): Promise<boolean> {
  console.log(`Deleting inventory item ID: ${id} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 100));
  const itemIndex = mockInventoryItems.findIndex(i => i.id === id);
  if (itemIndex !== -1) {
    // TODO: If item was assigned, update the corresponding user's assignedItems count
    mockInventoryItems.splice(itemIndex, 1);
    return true;
  }
  return false;
}

export async function getInventoryItemsByUserId(userId: string): Promise<InventoryItem[]> {
    console.log(`Fetching inventory items for user ID: ${userId} (mock)`);
    await new Promise(resolve => setTimeout(resolve, 50));
    return mockInventoryItems.filter(item => item.assignedToId === userId).map(item => ({...item}));
}
