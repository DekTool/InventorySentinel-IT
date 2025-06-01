
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
  id: string; 
  name: string;
  type: InventoryItemType;
  status: InventoryItemStatus;
  barcode: string;
  serialNumber?: string | null;
  purchaseDate?: string | null; 
  warrantyEndDate?: string | null; 
  notes?: string | null;
  assignedTo?: string | null; 
  assignedToId?: string | null; 

  // Endpoint-specific fields (for Portátil, Sobremesa)
  usuarioAdminLocalEstablecido?: string | null;
  marcaModeloEndpoint?: string | null; 
  codigoBitlockerEnRepositorio?: boolean | null;
  macWifiEndpoint?: string | null;
  macEthernetEndpoint?: string | null;
  marcaModeloCargadorEndpoint?: string | null;
  nombreAsignadoEndpoint?: string | null; // Hostname
  endpointEnDominio?: boolean | null;
  homepageFactorialNavegadores?: boolean | null;
  bitlockerActivo?: boolean | null;
  teamviewerCorporativoInstalado?: boolean | null;
  teamviewerEnEndpoint?: boolean | null;
  idTeamviewerEndpoint?: string | null;
  sevenZipInstalado?: boolean | null;
  antimalwareInstalado?: boolean | null;
  adobeAcrobatReaderInstalado?: boolean | null;
  forticlientVpnInstalado?: boolean | null;
  office365instalado?: boolean | null;
  accesoOffice365correcto?: boolean | null;
  onedriveInstalado?: boolean | null;
  deshabilitarOnedriveBackupEscritorio?: boolean | null;
  teamsInstalado?: boolean | null;
  restauracionSistemaActivo?: boolean | null;
  bginfoInstaladoConfigurado?: boolean | null;
  googleEarthProInstalado?: boolean | null;
  softphoneEnEndpoint?: boolean | null;
  qgisInstalado?: boolean | null;
  pdf24instalado?: boolean | null;
  idiomaWindowsEstablecido?: string | null;
  firefoxChromeInstalado?: boolean | null;
  statusActividadEndpoint?: string | null; 
  visorDwgInstalado?: boolean | null;
  windowsVersion?: string | null; 
  softwareInstaladoAdicional?: string | null;
  ficheroPlataformadoEntregado?: boolean | null;

  // Printer-related software/config on the endpoint (if applicable)
  numeroPlantaImpresora?: string | null;
  driverImpresoraInstalado?: boolean | null;
  codigoUsuarioImpresora?: string | null;
  impresoraConfigurada?: boolean | null;
}
