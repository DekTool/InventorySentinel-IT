
import type { InventoryItem, InventoryItemStatus, InventoryItemType } from '@/types/inventory';

// Helper to initialize common default fields
const initializeCommonFields = (item: Partial<InventoryItem>): Partial<InventoryItem> => {
  return {
    serialNumber: item.serialNumber || null,
    purchaseDate: item.purchaseDate || null,
    warrantyEndDate: item.warrantyEndDate || null,
    notes: item.notes || null,
    assignedTo: item.assignedTo || null,
    assignedToId: item.assignedToId || null,
  };
};

// Helper to initialize desktop/laptop specific fields
const initializeDesktopLaptopSpecificFields = (item: Partial<InventoryItem>): Partial<InventoryItem> => {
  return {
    usuarioAdminLocalEstablecido: item.usuarioAdminLocalEstablecido || null,
    marcaModeloEndpoint: item.marcaModeloEndpoint || null,
    codigoBitlockerEnRepositorio: item.codigoBitlockerEnRepositorio || false,
    macWifiEndpoint: item.macWifiEndpoint || null,
    macEthernetEndpoint: item.macEthernetEndpoint || null,
    marcaModeloCargadorEndpoint: item.marcaModeloCargadorEndpoint || null,
    nombreAsignadoEndpoint: item.nombreAsignadoEndpoint || null,
    endpointEnDominio: item.endpointEnDominio || false,
    homepageFactorialNavegadores: item.homepageFactorialNavegadores || false,
    bitlockerActivo: item.bitlockerActivo || false,
    teamviewerCorporativoInstalado: item.teamviewerCorporativoInstalado || false,
    teamviewerEnEndpoint: item.teamviewerEnEndpoint || false,
    idTeamviewerEndpoint: item.idTeamviewerEndpoint || null,
    sevenZipInstalado: item.sevenZipInstalado || false,
    antimalwareInstalado: item.antimalwareInstalado || false,
    adobeAcrobatReaderInstalado: item.adobeAcrobatReaderInstalado || false,
    forticlientVpnInstalado: item.forticlientVpnInstalado || false,
    office365instalado: item.office365instalado || false,
    accesoOffice365correcto: item.accesoOffice365correcto || false,
    onedriveInstalado: item.onedriveInstalado || false,
    deshabilitarOnedriveBackupEscritorio: item.deshabilitarOnedriveBackupEscritorio || false,
    teamsInstalado: item.teamsInstalado || false,
    restauracionSistemaActivo: item.restauracionSistemaActivo || false,
    bginfoInstaladoConfigurado: item.bginfoInstaladoConfigurado || false,
    googleEarthProInstalado: item.googleEarthProInstalado || false,
    softphoneEnEndpoint: item.softphoneEnEndpoint || false,
    qgisInstalado: item.qgisInstalado || false,
    pdf24instalado: item.pdf24instalado || false,
    idiomaWindowsEstablecido: item.idiomaWindowsEstablecido || 'Español',
    firefoxChromeInstalado: item.firefoxChromeInstalado || false,
    statusActividadEndpoint: item.statusActividadEndpoint || 'Active',
    visorDwgInstalado: item.visorDwgInstalado || false,
    windowsVersion: item.windowsVersion || null,
    softwareInstaladoAdicional: item.softwareInstaladoAdicional || null,
    ficheroPlataformadoEntregado: item.ficheroPlataformadoEntregado || false,
    numeroPlantaImpresora: item.numeroPlantaImpresora || null,
    driverImpresoraInstalado: item.driverImpresoraInstalado || false,
    codigoUsuarioImpresora: item.codigoUsuarioImpresora || null,
    impresoraConfigurada: item.impresoraConfigurada || false,
  };
};

// Helper to initialize mobile specific fields
const initializeMobileSpecificFields = (item: Partial<InventoryItem>): Partial<InventoryItem> => {
  return {
    imeisMovil: item.imeisMovil || null,
    marcaModeloMovil: item.marcaModeloMovil || null,
    direccionMacWifiMovil: item.direccionMacWifiMovil || null,
    estadoTerminalMovil: item.estadoTerminalMovil || null,
    numeroSerieMovil: item.numeroSerieMovil || null,
    outlookDesplegadoMovil: item.outlookDesplegadoMovil || false,
    teamsDesplegadoMovil: item.teamsDesplegadoMovil || false,
    harmonyMobileInstalado: item.harmonyMobileInstalado || false,
    pruebaLlamadasMovil: item.pruebaLlamadasMovil || false,
    teamviewerEnMovil: item.teamviewerEnMovil || false,
    idTeamviewerMovil: item.idTeamviewerMovil || null,
  };
};


let mockInventoryItems: InventoryItem[] = [
  { 
    id: 'ASSET-001', 
    name: 'Laptop Pro 15"', 
    type: 'Portátil', 
    status: 'Asignado', 
    barcode: '123456789012', 
    ...initializeCommonFields({ serialNumber: 'SN123XYZ', purchaseDate: '2023-01-15', warrantyEndDate: '2026-01-14', notes: 'Pequeño arañazo en la tapa.', assignedTo: 'Alice Smith (asmith@example.com)', assignedToId: 'USR-001' }),
    ...initializeDesktopLaptopSpecificFields({ nombreAsignadoEndpoint: 'ALICE-LAPTOP', windowsVersion: '11 Pro', bitlockerActivo: true, office365instalado: true, idiomaWindowsEstablecido: 'Inglés', statusActividadEndpoint: 'En uso diario' }),
    ...initializeMobileSpecificFields({}), // Initialize mobile fields to defaults (null/false)
  } as InventoryItem,
  { 
    id: 'ASSET-002', 
    name: 'Ratón Inalámbrico X', 
    type: 'Ratón', 
    status: 'En Stock', 
    barcode: '987654321098', 
    ...initializeCommonFields({ serialNumber: 'SN456ABC', purchaseDate: '2023-05-20', warrantyEndDate: '2024-05-19' }),
    ...initializeDesktopLaptopSpecificFields({}),
    ...initializeMobileSpecificFields({}),
  } as InventoryItem,
  { 
    id: 'ASSET-003', 
    name: 'Docking Station Z', 
    type: 'Docking Station', 
    status: 'Asignado', 
    barcode: '112233445566', 
    ...initializeCommonFields({ serialNumber: 'SNDEF789', purchaseDate: '2022-11-01', warrantyEndDate: '2024-10-31', notes: 'Requiere adaptador de corriente específico.', assignedTo: 'Bob Johnson (bjohnson@example.com)', assignedToId: 'USR-002' }),
    ...initializeDesktopLaptopSpecificFields({}),
    ...initializeMobileSpecificFields({}),
  } as InventoryItem,
  { 
    id: 'ASSET-004', 
    name: 'Teléfono Móvil S23', 
    type: 'Móvil', 
    status: 'En Stock', 
    barcode: '778899001122', 
    ...initializeCommonFields({ serialNumber: 'SNMOBGEN001', purchaseDate: '2024-02-10', warrantyEndDate: '2026-02-09', notes: 'Versión desbloqueada.' }),
    ...initializeDesktopLaptopSpecificFields({}),
    ...initializeMobileSpecificFields({ imeisMovil: '123456789012345', marcaModeloMovil: 'Samsung Galaxy S23', estadoTerminalMovil: 'Nuevo en caja', numeroSerieMovil: 'SNMOBS23001', outlookDesplegadoMovil: false, teamsDesplegadoMovil: false }),
  } as InventoryItem,
  { 
    id: 'ASSET-005', 
    name: 'Monitor 27" 4K', 
    type: 'Monitor', 
    status: 'Asignado', 
    barcode: '334455667788', 
    ...initializeCommonFields({ serialNumber: 'SNMON4K01', purchaseDate: '2023-08-05', warrantyEndDate: '2026-08-04', notes: 'Incluye cable HDMI.', assignedTo: 'Alice Smith (asmith@example.com)', assignedToId: 'USR-001' }),
    ...initializeDesktopLaptopSpecificFields({}),
    ...initializeMobileSpecificFields({}),
  } as InventoryItem,
   { id: 'ASSET-006', name: 'Keyboard K1', type: 'Teclado', status: 'Asignado', barcode: 'KB001', ...initializeCommonFields({ assignedToId: 'USR-004', assignedTo: 'Diana Prince (dprince@example.com)', purchaseDate: '2021-06-01', serialNumber: 'SNKB001', warrantyEndDate: '2023-05-31' }), ...initializeDesktopLaptopSpecificFields({}), ...initializeMobileSpecificFields({}) } as InventoryItem,
   { id: 'ASSET-007', name: 'Dev Laptop X', type: 'Portátil', status: 'Asignado', barcode: 'DEVLP01', ...initializeCommonFields({ assignedToId: 'USR-005', assignedTo: 'Ethan Hunt (ehunt@example.com)', purchaseDate: '2020-01-15', serialNumber: 'SNDEVLP01', warrantyEndDate: '2023-01-14', notes: 'For development purposes' }), ...initializeDesktopLaptopSpecificFields({ nombreAsignadoEndpoint: 'ETHAN-DEVBOX', windowsVersion: '10 Pro', antimalwareInstalado: true }), ...initializeMobileSpecificFields({}) } as InventoryItem,
   { id: 'ASSET-008', name: 'Server Rack R1', type: 'Servidor', status: 'Asignado', barcode: 'SRVR01', ...initializeCommonFields({ assignedToId: 'USR-005', assignedTo: 'Ethan Hunt (ehunt@example.com)', purchaseDate: '2020-01-15', serialNumber: 'SNSRVR01', warrantyEndDate: '2025-01-14', notes: 'Main web server' }), ...initializeDesktopLaptopSpecificFields({}), ...initializeMobileSpecificFields({}) } as InventoryItem,
];

export async function getAllInventoryItems(): Promise<InventoryItem[]> {
  console.log("Fetching all inventory items (mock)");
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockInventoryItems.map(item => ({ ...item }));
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
  
  let newItem: InventoryItem = {
    id: newId,
    name: itemData.name,
    type: itemData.type,
    status: itemData.status,
    barcode: itemData.barcode,
    ...initializeCommonFields(itemData),
    ...initializeDesktopLaptopSpecificFields({}), // Start with empty PC fields
    ...initializeMobileSpecificFields({}),    // Start with empty Mobile fields
  };

  // Populate specific fields based on item type and provided data
  if (itemData.type === 'Portátil' || itemData.type === 'Sobremesa') {
    newItem = { ...newItem, ...initializeDesktopLaptopSpecificFields(itemData) };
  } else if (itemData.type === 'Móvil') {
    newItem = { ...newItem, ...initializeMobileSpecificFields(itemData) };
  }
  
  // Ensure all provided fields in itemData overwrite defaults if they exist
  // This is a bit redundant if initialize functions already take itemData, but ensures all keys are covered.
  for (const key in itemData) {
    if (Object.prototype.hasOwnProperty.call(itemData, key) && key !== 'id') {
      // @ts-ignore
      newItem[key] = itemData[key];
    }
  }
  
  mockInventoryItems.push(newItem);
  return { ...newItem };
}

export async function updateInventoryItem(id: string, itemUpdateData: Partial<Omit<InventoryItem, 'id'>>): Promise<InventoryItem | null> {
  console.log(`Updating inventory item ID: ${id} (mock) with data:`, itemUpdateData);
  await new Promise(resolve => setTimeout(resolve, 100));
  const itemIndex = mockInventoryItems.findIndex(i => i.id === id);
  if (itemIndex !== -1) {
    // Ensure all fields from itemUpdateData are applied, even if they are specific to a type
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
