
import type { MobileLine, MobileLineStatus } from '@/types/mobile-line';
import type { User } from '@/types/user'; // To link to users

// Mock data for mobile lines
let mockMobileLines: MobileLine[] = [
  {
    id: 'LINE-001',
    phoneNumber: '600112233',
    carrier: 'Movistar Empresas',
    planName: 'Fusión Pro Negocios',
    status: 'Activa',
    simCardNumber: '8934012345678901234F',
    pukCode: '12345678',
    activationDate: '2023-01-10',
    assignedToUserId: 'USR-001',
    assignedToUserName: 'Alice Smith',
    notes: 'Línea principal para Alice.',
  },
  {
    id: 'LINE-002',
    phoneNumber: '611223344',
    carrier: 'Vodafone One',
    planName: 'Red Empresa Avanzado',
    status: 'Activa',
    simCardNumber: '8934078901234567890A',
    pukCode: '87654321',
    activationDate: '2022-11-05',
    assignedToUserId: 'USR-002',
    assignedToUserName: 'Bob Johnson',
    notes: 'Línea de datos adicional.',
  },
  {
    id: 'LINE-003',
    phoneNumber: '622334455',
    carrier: 'Orange Corp',
    planName: 'Love Empresa Sin Límites',
    status: 'Sin Asignar',
    simCardNumber: '8934056789012345678B',
    pukCode: null,
    activationDate: '2024-03-01',
    assignedToUserId: null,
    assignedToUserName: null,
    notes: 'Línea de repuesto disponible.',
  },
  {
    id: 'LINE-004',
    phoneNumber: '633445566',
    carrier: 'MásMóvil Pro',
    planName: 'Total Conexión',
    status: 'Suspendida',
    simCardNumber: '8934001234567890123C',
    pukCode: '11223344',
    activationDate: '2021-07-15',
    assignedToUserId: 'USR-004',
    assignedToUserName: 'Diana Prince',
    notes: 'Suspendida temporalmente por viaje largo.',
  },
];

let nextLineId = mockMobileLines.length + 1;

function generateLineId(): string {
  const id = `LINE-${String(nextLineId).padStart(3, '0')}`;
  nextLineId++;
  return id;
}

export async function getAllMobileLines(): Promise<MobileLine[]> {
  console.log("Fetching all mobile lines (mock)");
  await new Promise(resolve => setTimeout(resolve, 50));
  return [...mockMobileLines];
}

export async function getMobileLineById(id: string): Promise<MobileLine | undefined> {
  console.log(`Fetching mobile line by ID: ${id} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 50));
  const line = mockMobileLines.find(l => l.id === id);
  return line ? { ...line } : undefined;
}

export async function addMobileLine(lineData: Omit<MobileLine, 'id'>): Promise<MobileLine> {
  console.log("Adding new mobile line (mock):", lineData);
  await new Promise(resolve => setTimeout(resolve, 100));
  const newLine: MobileLine = {
    id: generateLineId(),
    ...lineData,
  };
  mockMobileLines.push(newLine);
  return { ...newLine };
}

export async function updateMobileLine(id: string, lineUpdateData: Partial<Omit<MobileLine, 'id'>>): Promise<MobileLine | null> {
  console.log(`Updating mobile line ID: ${id} (mock) with data:`, lineUpdateData);
  await new Promise(resolve => setTimeout(resolve, 100));
  const lineIndex = mockMobileLines.findIndex(l => l.id === id);
  if (lineIndex !== -1) {
    mockMobileLines[lineIndex] = { ...mockMobileLines[lineIndex], ...lineUpdateData };
    return { ...mockMobileLines[lineIndex] };
  }
  return null;
}

export async function deleteMobileLine(id: string): Promise<boolean> {
  console.log(`Deleting mobile line ID: ${id} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 100));
  const initialLength = mockMobileLines.length;
  mockMobileLines = mockMobileLines.filter(l => l.id !== id);
  return mockMobileLines.length < initialLength;
}

// Helper to potentially update assignedToUserName if userId changes
// This would typically be handled by listening to user data changes or joining data,
// but for mock purposes, we can call this if needed.
export function updateUserNameOnLines(userId: string, newUserName: string) {
    mockMobileLines.forEach(line => {
        if (line.assignedToUserId === userId) {
            line.assignedToUserName = newUserName;
        }
    });
}
