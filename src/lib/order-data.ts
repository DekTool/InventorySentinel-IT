
import type { Order, OrderItem, OrderStatus } from '@/types/order';
import { InventoryItemType } from '@/types/inventory';

let mockOrders: Order[] = [
  {
    id: 'ORD-001',
    orderDate: '2024-05-01',
    supplier: 'TechSupplier Inc.',
    status: 'En Tránsito',
    expectedArrivalDate: '2024-05-15',
    actualArrivalDate: null,
    items: [
      { id: 'ITEM-001-1', itemName: 'Laptop Avanzada X1', quantity: 5, category: 'Portátil', model: 'X1 Carbon Gen 12', characteristics: '16GB RAM, 512GB SSD, Intel i7' },
      { id: 'ITEM-001-2', itemName: 'Monitor Curvo 32"', quantity: 2, category: 'Monitor', model: 'Samsung Odyssey G7', characteristics: '1440p, 240Hz' },
    ],
    trackingNumber: 'TRK123456789',
    notes: 'Pedido urgente para el nuevo departamento.',
  },
  {
    id: 'ORD-002',
    orderDate: '2024-04-20',
    supplier: 'OfficeGadgets Ltd.',
    status: 'Recibido',
    expectedArrivalDate: '2024-05-05',
    actualArrivalDate: '2024-05-03',
    items: [
      { id: 'ITEM-002-1', itemName: 'Teclado Mecánico Ergonómico', quantity: 10, category: 'Teclado', model: 'Keychron K2 Pro', characteristics: 'Retroiluminado, Switch Marrón' },
      { id: 'ITEM-002-2', itemName: 'Ratón Vertical Inalámbrico', quantity: 10, category: 'Ratón', model: 'Logitech MX Vertical', characteristics: 'Recargable' },
    ],
    trackingNumber: 'TRK987654321',
    notes: 'Material para mejorar ergonomía de puestos.',
  },
  {
    id: 'ORD-003',
    orderDate: '2024-05-10',
    supplier: 'Componentes PC Global',
    status: 'Solicitado',
    expectedArrivalDate: '2024-06-01',
    actualArrivalDate: null,
    items: [
      { id: 'ITEM-003-1', itemName: 'Tarjeta Gráfica RTX 4070', quantity: 3, category: 'Otro', model: 'NVIDIA RTX 4070 Founders', characteristics: 'Para equipos de diseño' },
    ],
    trackingNumber: null,
    notes: 'Confirmar stock antes de procesar pago.',
  },
];

let orderItemCounter = 100; // For generating unique order item IDs

// Helper to generate unique order item IDs
const generateOrderItemId = (orderId: string) => `ITEM-${orderId.split('-')[1]}-${orderItemCounter++}`;


export async function getAllOrders(): Promise<Order[]> {
  console.log("Fetching all orders (mock)");
  await new Promise(resolve => setTimeout(resolve, 50));
  return [...mockOrders];
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  console.log(`Fetching order by ID: ${id} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 50));
  const order = mockOrders.find(o => o.id === id);
  return order ? { ...order, items: order.items.map(item => ({...item})) } : undefined;
}

export async function addOrder(orderData: Omit<Order, 'id' | 'items'> & { items: Omit<OrderItem, 'id'>[] }): Promise<Order> {
  console.log("Adding new order (mock):", orderData);
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const newOrderId = `ORD-${String(mockOrders.length + 1).padStart(3, '0')}`;
  const newOrderItems: OrderItem[] = orderData.items.map(item => ({
    ...item,
    id: generateOrderItemId(newOrderId),
  }));

  const newOrder: Order = {
    id: newOrderId,
    ...orderData,
    items: newOrderItems,
  };
  mockOrders.push(newOrder);
  return { ...newOrder, items: newOrder.items.map(item => ({...item})) };
}

export async function updateOrder(id: string, orderUpdateData: Partial<Omit<Order, 'id' | 'items'>> & { items?: Partial<OrderItem>[] }): Promise<Order | null> {
  console.log(`Updating order ID: ${id} (mock) with data:`, orderUpdateData);
  await new Promise(resolve => setTimeout(resolve, 100));
  const orderIndex = mockOrders.findIndex(o => o.id === id);
  if (orderIndex !== -1) {
    const originalOrder = mockOrders[orderIndex];
    
    // Handle item updates carefully. This mock implementation assumes full replacement or careful merging.
    // For a real app, item updates would be more granular.
    let updatedItems = originalOrder.items;
    if (orderUpdateData.items) {
      // This is a simple replacement strategy for mock. A real app might need to merge, add, delete items.
      updatedItems = orderUpdateData.items.map(item => ({
        ...originalOrder.items.find(oi => oi.id === item.id), // Keep original if exists
        ...item, // Apply updates
        id: item.id || generateOrderItemId(id), // Ensure ID exists
      })) as OrderItem[];
    }

    mockOrders[orderIndex] = { 
      ...originalOrder, 
      ...orderUpdateData,
      items: updatedItems 
    };
    return { ...mockOrders[orderIndex], items: mockOrders[orderIndex].items.map(item => ({...item})) };
  }
  return null;
}

export async function deleteOrder(id: string): Promise<boolean> {
  console.log(`Deleting order ID: ${id} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 100));
  const initialLength = mockOrders.length;
  mockOrders = mockOrders.filter(o => o.id !== id);
  return mockOrders.length < initialLength;
}
