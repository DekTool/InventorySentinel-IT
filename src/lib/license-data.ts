import type { License, LicenseStatus, LicenseType } from '@/types/license';

// Mock data for licenses
let mockLicenses: License[] = [
  {
    id: 'LIC-001',
    softwareName: 'Sistema Operativo Pro',
    licenseKey: 'A1B2-C3D4-E5F6-G7H8',
    licenseType: 'OEM',
    seats: 1,
    status: 'Activa',
    purchaseDate: '2023-01-15',
    expirationDate: null,
    vendor: 'Proveedor OS',
    assignedTo: 'ASSET-001 (Laptop Pro 15")',
    notes: 'Licencia vinculada al hardware.',
  },
  {
    id: 'LIC-002',
    softwareName: 'Suite de Oficina Premium',
    licenseKey: 'OFFICE-PREM-XYZ-123',
    licenseType: 'Suscripción Anual',
    seats: 10,
    status: 'Activa',
    purchaseDate: '2024-01-01',
    expirationDate: '2024-12-31',
    vendor: 'Suite Software Inc.',
    assignedTo: 'Departamento de Marketing',
    notes: 'Renovación anual requerida.',
  },
  {
    id: 'LIC-003',
    softwareName: 'Herramienta de Diseño Gráfico',
    licenseKey: 'DESIGNTOOL-ABC-789',
    licenseType: 'Perpetua',
    seats: 5,
    status: 'Activa',
    purchaseDate: '2022-06-20',
    expirationDate: null,
    vendor: 'Creative Tools Co.',
    assignedTo: 'USR-001 (Alice Smith)',
    notes: 'Versión 2.0',
  },
  {
    id: 'LIC-004',
    softwareName: 'Software Antivirus Corporativo',
    licenseKey: 'ANTIVIRUS-CORP-456',
    licenseType: 'Suscripción Anual',
    seats: 50,
    status: 'Expirada',
    purchaseDate: '2023-03-01',
    expirationDate: '2024-02-29',
    vendor: 'Secure Systems Ltd.',
    assignedTo: 'Toda la organización',
    notes: 'Necesita renovación urgente.',
  },
  {
    id: 'LIC-005',
    softwareName: 'IDE de Desarrollo Avanzado',
    licenseKey: 'IDE-DEV-PRO-ULTIMATE',
    licenseType: 'Suscripción Mensual',
    seats: 3,
    status: 'Sin Asignar',
    purchaseDate: '2024-05-01',
    expirationDate: '2024-05-31',
    vendor: 'DevTools Max',
    assignedTo: null,
    notes: 'Licencias flotantes para equipo de desarrollo.',
  },
];

// Function to get all licenses (simulates API call)
export async function getAllLicenses(): Promise<License[]> {
  console.log("Fetching all licenses (mock)");
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
  return [...mockLicenses];
}

// Function to get a license by its ID (simulates API call)
export async function getLicenseById(id: string): Promise<License | undefined> {
  console.log(`Fetching license by ID: ${id} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
  const license = mockLicenses.find(lic => lic.id === id);
  if (license) {
    return { ...license }; // Return a copy
  }
  return undefined;
}

// Function to add a new license (simulates API call)
export async function addLicense(licenseData: Omit<License, 'id' | 'status'> & { status?: LicenseStatus }): Promise<License> {
  console.log("Adding new license (mock):", licenseData);
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
  const newId = `LIC-${String(mockLicenses.length + 1).padStart(3, '0')}`;
  const newLicense: License = {
    id: newId,
    ...licenseData,
    status: licenseData.status || 'Sin Asignar', // Default status if not provided
  };
  mockLicenses.push(newLicense);
  return { ...newLicense }; // Return a copy
}

// Function to update an existing license (simulates API call)
export async function updateLicense(id: string, licenseUpdateData: Partial<Omit<License, 'id'>>): Promise<License | null> {
  console.log(`Updating license ID: ${id} (mock) with data:`, licenseUpdateData);
  await new Promise(resolve => setTimeout(resolve, 100));
  const licenseIndex = mockLicenses.findIndex(lic => lic.id === id);
  if (licenseIndex !== -1) {
    mockLicenses[licenseIndex] = { ...mockLicenses[licenseIndex], ...licenseUpdateData };
    return { ...mockLicenses[licenseIndex] }; // Return a copy of the updated license
  }
  return null; // License not found
}

// Function to delete a license (simulates API call)
export async function deleteLicense(id: string): Promise<boolean> {
  console.log(`Deleting license ID: ${id} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 100));
  const initialLength = mockLicenses.length;
  mockLicenses = mockLicenses.filter(lic => lic.id !== id);
  return mockLicenses.length < initialLength; // Return true if deletion was successful
}