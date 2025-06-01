
export type UserRole = "Administrador" | "Tecnico" | "Usuario";

export interface User {
  id: string; // e.g., USR-001
  name: string; // NOMBRE Y APELLIDOS
  email: string; // EMAIL
  department: string; // DEPARTAMENTO
  phone?: string | null; // NÚMERO DE TELÉFONO
  joinDate?: string | null; // FECHA INCORPORACIÓN/ALTA (YYYY-MM-DD)
  assignedItems: number; // Count of items assigned to this user
  role: UserRole;
  password?: string; // Placeholder for password, NOT FOR SECURE STORAGE in this version

  // Nuevos campos detallados
  // Información General de Cuenta y Empleado
  tipoCuenta?: string | null;
  estadoCuenta?: string | null; // e.g., "Activa", "Bloqueada", "Deshabilitada"
  empresa?: string | null;
  ubicacion?: string | null;
  pais?: string | null;
  fechaSalidaBaja?: string | null; // YYYY-MM-DD
  puestoTrabajo?: string | null;
  responsableManager?: string | null;
  entornoCorporativo?: string | null; // e.g., "Producción", "Desarrollo"

  // Cuenta de Directorio Activo (DA) / O365
  cuentaDAcreada?: boolean;
  nombreCuentaWindowsO365?: string | null;
  fichaDArellena?: boolean;
  licenciaO365asignada?: boolean;
  asignadoListasDistribucionO365?: boolean;
  citaEnCalendario?: boolean;
  contrasenaPersonalizada?: boolean;
  contrasenaInicialEstablecida?: string | null;
  tarjetaRFIDaccesoMadrid?: string | null;
  accesoRepositorioOtorgado?: boolean;
  rutaRepositorioAcceso?: string | null;
  emailOnboardingEnviado?: boolean;
  usuarioAsignadoNetworkOperatorDA?: boolean;

  // Endpoint (Equipo Informático)
  endpointTipo?: string | null; // e.g., "Portátil", "Torre"
  ficheroPlataformadoEntregado?: boolean;
  usuarioAdminLocalEstablecido?: string | null;
  equipoInformaticoAsignado?: string | null; // ID del activo de inventario
  marcaModeloEndpoint?: string | null;
  codigoBitlockerRepositorio?: boolean;
  numeroSerieEndpoint?: string | null;
  macWifiEndpoint?: string | null;
  macEthernetEndpoint?: string | null;
  marcaModeloCargadorEndpoint?: string | null;
  nombreAsignadoEndpoint?: string | null;
  endpointEnDominio?: boolean;
  homepageFactorialNavegadores?: boolean;
  bitlockerActivo?: boolean;
  teamviewerCorporativoInstalado?: boolean;
  teamviewerEnEndpoint?: boolean;
  idTeamviewerEndpoint?: string | null;
  sevenZipInstalado?: boolean;
  antimalwareInstalado?: boolean;
  adobeAcrobatReaderInstalado?: boolean;
  forticlientVpnInstalado?: boolean;
  office365instalado?: boolean;
  accesoOffice365correcto?: boolean;
  onedriveInstalado?: boolean;
  deshabilitarOnedriveBackupEscritorio?: boolean;
  teamsInstalado?: boolean;
  restauracionSistemaActivo?: boolean;
  bginfoInstaladoConfigurado?: boolean;
  googleEarthProInstalado?: boolean;
  softphoneEnEndpoint?: boolean;
  qgisInstalado?: boolean;
  pdf24instalado?: boolean;
  idiomaWindowsEstablecido?: string | null; // e.g., "Español", "Inglés"
  firefoxChromeInstalado?: boolean;
  statusActividad?: string | null; // e.g., "Active"
  visorDwgInstalado?: boolean;
  windows11instalado?: boolean;
  softwareInstaladoAdicional?: string | null; // Textarea

  // Impresora
  numeroPlantaImpresora?: string | null;
  driverImpresoraInstalado?: boolean;
  codigoUsuarioImpresora?: string | null;
  impresoraConfigurada?: boolean;

  // Periféricos
  monitorAsignado?: string | null; // ID del activo de inventario
  monitorEntregado?: boolean;
  tecladoEntregado?: boolean;
  tecladoAsignado?: string | null; // ID del activo de inventario
  ratonEntregado?: boolean;
  ratonAsignado?: string | null; // ID del activo de inventario

  // Telefonía Móvil
  imeisMovil?: string | null;
  smartphoneAsignado?: string | null; // ID del activo de inventario (si los móviles están en inventario)
  marcaModeloMovil?: string | null;
  direccionMacWifiMovil?: string | null;
  gmailAppleIdCreada?: boolean;
  nombreCuentaGmailAppleId?: string | null;
  // movilAsignado seems redundant with smartphoneAsignado, maybe refers to Line ID from mobile-lines? For now, string.
  movilAsignadoNumero?: string | null; // NÚMERO DE MÓVIL ASIGNADO (N/A) - Changed name to avoid conflict
  numeroSerieMovil?: string | null;
  outlookDesplegadoMovil?: boolean;
  teamsDesplegadoMovil?: boolean;
  harmonyMobileInstalado?: boolean;
  mdmFullParcial?: string | null; // e.g., "Full", "Parcial", "Ninguno"
  jamfInstalado?: boolean; // Assuming JAMF
  pruebaLlamadasMovil?: boolean;
  teamviewerEnMovil?: boolean;
  idTeamviewerMovil?: string | null;
  movilDesasignado?: boolean;
  terminalFijoTelefonia?: boolean;
  platDireccionMacTerminalFijo?: string | null;

  // Comentarios
  comentarioEntregaMaterial?: string | null; // Textarea
}
