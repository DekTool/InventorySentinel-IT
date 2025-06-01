
import type { Entrega, EntregaDetalleItem, EntregaStatus } from '@/types/entrega';

let mockEntregas: Entrega[] = [
  {
    id: 'ENT-001',
    userId: 'USR-001',
    userName: 'Alice Smith',
    deliveryDate: '2024-05-10',
    status: 'Completada',
    items: [
      { id: 'DI-001-1', inventoryItemId: 'ASSET-001', itemName: 'Laptop Pro 15"', quantity: 1, serialNumber: 'SN123XYZ', notes: 'Entregado con cargador y funda.' },
      { id: 'DI-001-2', inventoryItemId: 'ASSET-005', itemName: 'Monitor 27" 4K', quantity: 1, serialNumber: 'SNMON4K01', notes: 'Cable HDMI incluido.' },
    ],
    notes: 'Usuario recogió el material en la oficina de IT.',
  },
  {
    id: 'ENT-002',
    userId: 'USR-002',
    userName: 'Bob Johnson',
    deliveryDate: '2024-05-15',
    status: 'Pendiente',
    items: [
      { id: 'DI-002-1', itemName: 'Nuevo Teclado Ergonómico', quantity: 1, notes: 'Modelo específico solicitado.' },
      { id: 'DI-002-2', itemName: 'Ratón Inalámbrico', quantity: 1 },
    ],
    notes: 'Preparar para envío a la sucursal norte.',
  },
  {
    id: 'ENT-003',
    userId: 'USR-004',
    userName: 'Diana Prince',
    deliveryDate: '2024-04-20',
    status: 'Completada',
    items: [
      { id: 'DI-003-1', inventoryItemId: 'ASSET-006', itemName: 'Keyboard K1', quantity: 1, serialNumber: 'SNKB001' },
    ],
    notes: 'Entrega estándar de equipamiento.',
  },
];

let entregaItemCounter = 10; // For generating unique delivery item IDs

const generateEntregaDetalleItemId = (entregaId: string): string => {
  entregaItemCounter += 1;
  return `DI-${entregaId.split('-')[1]}-${entregaItemCounter}`;
};

export async function getAllEntregas(): Promise<Entrega[]> {
  console.log("Fetching all entregas (mock)");
  await new Promise(resolve => setTimeout(resolve, 50));
  return [...mockEntregas];
}

export async function getEntregaById(id: string): Promise<Entrega | undefined> {
  console.log(`Fetching entrega by ID: ${id} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 50));
  const entrega = mockEntregas.find(e => e.id === id);
  return entrega ? { ...entrega, items: entrega.items.map(item => ({...item})) } : undefined;
}

// For adding, items will not have 'id' initially for EntregaDetalleItem
export async function addEntrega(entregaData: Omit<Entrega, 'id' | 'items'> & { items: Omit<EntregaDetalleItem, 'id'>[] }): Promise<Entrega> {
  console.log("Adding new entrega (mock):", entregaData);
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const newEntregaId = `ENT-${String(mockEntregas.length + 1).padStart(3, '0')}`;
  const newEntregaItems: EntregaDetalleItem[] = entregaData.items.map(item => ({
    ...item,
    id: generateEntregaDetalleItemId(newEntregaId),
  }));

  const newEntrega: Entrega = {
    id: newEntregaId,
    ...entregaData,
    items: newEntregaItems,
  };
  mockEntregas.push(newEntrega);
  return { ...newEntrega, items: newEntrega.items.map(item => ({...item})) };
}

export async function updateEntrega(id: string, entregaUpdateData: Partial<Omit<Entrega, 'id' | 'items'>> & { items?: Partial<EntregaDetalleItem>[] }): Promise<Entrega | null> {
  console.log(`Updating entrega ID: ${id} (mock) with data:`, entregaUpdateData);
  await new Promise(resolve => setTimeout(resolve, 100));
  const entregaIndex = mockEntregas.findIndex(e => e.id === id);

  if (entregaIndex !== -1) {
    const originalEntrega = mockEntregas[entregaIndex];
    
    let updatedItems = originalEntrega.items;
    if (entregaUpdateData.items) {
      updatedItems = entregaUpdateData.items.map(item => ({
        ...originalEntrega.items.find(oi => oi.id === item.id), // Keep original if exists
        ...item,
        id: item.id || generateEntregaDetalleItemId(id),
      })) as EntregaDetalleItem[];
    }

    mockEntregas[entregaIndex] = { 
      ...originalEntrega, 
      ...entregaUpdateData,
      items: updatedItems 
    };
    return { ...mockEntregas[entregaIndex], items: mockEntregas[entregaIndex].items.map(item => ({...item})) };
  }
  return null;
}

export async function deleteEntrega(id: string): Promise<boolean> {
  console.log(`Deleting entrega ID: ${id} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 100));
  const initialLength = mockEntregas.length;
  mockEntregas = mockEntregas.filter(e => e.id !== id);
  return mockEntregas.length < initialLength;
}
