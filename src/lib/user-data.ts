
import type { User, UserRole } from '@/types/user';
import { getInventoryItemsByUserId } from './inventory-data'; // For updating assignedItems count

const initialAdminUser: User = {
  id: 'USR-001', // Keep ID simple for the single admin user
  name: 'Admin User',
  email: 'admin@admin.com',
  department: 'Administración',
  phone: '000-000-0000',
  joinDate: '2024-01-01',
  assignedItems: 0,
  role: 'Administrador',
  password: 'admin',

  // Default values for new fields
  tipoCuenta: 'Empleado',
  estadoCuenta: 'Activa',
  empresa: 'Inventory Sentinel Corp',
  ubicacion: 'Oficina Central',
  pais: 'España',
  fechaSalidaBaja: null,
  puestoTrabajo: 'Administrador del Sistema',
  responsableManager: null,
  entornoCorporativo: 'Producción',

  cuentaDAcreada: true,
  nombreCuentaWindowsO365: 'admin',
  fichaDArellena: true,
  licenciaO365asignada: true,
  asignadoListasDistribucionO365: true,
  citaEnCalendario: false,
  contrasenaPersonalizada: true,
  contrasenaInicialEstablecida: null, // Set during onboarding typically
  tarjetaRFIDaccesoMadrid: null,
  accesoRepositorioOtorgado: true,
  rutaRepositorioAcceso: '/shares/admin',
  emailOnboardingEnviado: true,
  usuarioAsignadoNetworkOperatorDA: false,

  endpointTipo: 'Portátil',
  ficheroPlataformadoEntregado: false,
  usuarioAdminLocalEstablecido: 'localadmin',
  equipoInformaticoAsignado: null, // Example: 'ASSET-XYZ'
  marcaModeloEndpoint: null,
  codigoBitlockerRepositorio: false,
  numeroSerieEndpoint: null,
  macWifiEndpoint: null,
  macEthernetEndpoint: null,
  marcaModeloCargadorEndpoint: null,
  nombreAsignadoEndpoint: null,
  endpointEnDominio: true,
  homepageFactorialNavegadores: false,
  bitlockerActivo: true,
  teamviewerCorporativoInstalado: true,
  teamviewerEnEndpoint: true,
  idTeamviewerEndpoint: null,
  sevenZipInstalado: true,
  antimalwareInstalado: true,
  adobeAcrobatReaderInstalado: true,
  forticlientVpnInstalado: true,
  office365instalado: true,
  accesoOffice365correcto: true,
  onedriveInstalado: true,
  deshabilitarOnedriveBackupEscritorio: false,
  teamsInstalado: true,
  restauracionSistemaActivo: true,
  bginfoInstaladoConfigurado: false,
  googleEarthProInstalado: false,
  softphoneEnEndpoint: false,
  qgisInstalado: false,
  pdf24instalado: false,
  idiomaWindowsEstablecido: 'Español',
  firefoxChromeInstalado: true,
  statusActividad: 'Activo',
  visorDwgInstalado: false,
  windows11instalado: true,
  softwareInstaladoAdicional: 'VS Code, Docker',

  numeroPlantaImpresora: null,
  driverImpresoraInstalado: false,
  codigoUsuarioImpresora: null,
  impresoraConfigurada: false,

  monitorAsignado: null,
  monitorEntregado: false,
  tecladoEntregado: false,
  tecladoAsignado: null,
  ratonEntregado: false,
  ratonAsignado: null,

  imeisMovil: null,
  smartphoneAsignado: null,
  marcaModeloMovil: null,
  direccionMacWifiMovil: null,
  gmailAppleIdCreada: false,
  nombreCuentaGmailAppleId: null,
  movilAsignadoNumero: null,
  numeroSerieMovil: null,
  outlookDesplegadoMovil: false,
  teamsDesplegadoMovil: false,
  harmonyMobileInstalado: false,
  mdmFullParcial: null,
  jamfInstalado: false,
  pruebaLlamadasMovil: false,
  teamviewerEnMovil: false,
  idTeamviewerMovil: null,
  movilDesasignado: false,
  terminalFijoTelefonia: false,
  platDireccionMacTerminalFijo: null,

  comentarioEntregaMaterial: 'Usuario administrador inicial del sistema.',
};


let mockUsers: User[] = [initialAdminUser];

export const userRoles: UserRole[] = ["Administrador", "Tecnico", "Usuario"];

export async function getAllUsers(): Promise<User[]> {
  console.log("Fetching all users (mock)");
  await new Promise(resolve => setTimeout(resolve, 50));
  return [...mockUsers];
}

export async function getUserById(id: string): Promise<User | undefined> {
  console.log(`Fetching user by ID: ${id} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 50));
  const user = mockUsers.find(u => u.id === id);
  return user ? { ...user } : undefined;
}

export async function addUser(userData: Omit<User, 'id' | 'assignedItems'>): Promise<User> {
  console.log("Adding new user (mock):", userData);
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let nextIdNumber = 1;
  if (mockUsers.length > 0) {
    const existingIds = mockUsers.map(u => parseInt(u.id.split('-')[1]));
    nextIdNumber = Math.max(...existingIds, 0) + 1;
  }
  const newId = `USR-${String(nextIdNumber).padStart(3, '0')}`;

  const newUser: User = {
    id: newId,
    name: userData.name,
    email: userData.email,
    department: userData.department,
    phone: userData.phone || null,
    joinDate: userData.joinDate || null,
    assignedItems: 0, 
    role: userData.role,
    password: userData.password, // Store password as is (INSECURE - for demo only)

    // Default values for new fields
    tipoCuenta: userData.tipoCuenta || null,
    estadoCuenta: userData.estadoCuenta || 'Activa',
    empresa: userData.empresa || null,
    ubicacion: userData.ubicacion || null,
    pais: userData.pais || null,
    fechaSalidaBaja: userData.fechaSalidaBaja || null,
    puestoTrabajo: userData.puestoTrabajo || null,
    responsableManager: userData.responsableManager || null,
    entornoCorporativo: userData.entornoCorporativo || null,
  
    cuentaDAcreada: userData.cuentaDAcreada || false,
    nombreCuentaWindowsO365: userData.nombreCuentaWindowsO365 || null,
    fichaDArellena: userData.fichaDArellena || false,
    licenciaO365asignada: userData.licenciaO365asignada || false,
    asignadoListasDistribucionO365: userData.asignadoListasDistribucionO365 || false,
    citaEnCalendario: userData.citaEnCalendario || false,
    contrasenaPersonalizada: userData.contrasenaPersonalizada || false,
    contrasenaInicialEstablecida: userData.contrasenaInicialEstablecida || null,
    tarjetaRFIDaccesoMadrid: userData.tarjetaRFIDaccesoMadrid || null,
    accesoRepositorioOtorgado: userData.accesoRepositorioOtorgado || false,
    rutaRepositorioAcceso: userData.rutaRepositorioAcceso || null,
    emailOnboardingEnviado: userData.emailOnboardingEnviado || false,
    usuarioAsignadoNetworkOperatorDA: userData.usuarioAsignadoNetworkOperatorDA || false,
  
    endpointTipo: userData.endpointTipo || null,
    ficheroPlataformadoEntregado: userData.ficheroPlataformadoEntregado || false,
    usuarioAdminLocalEstablecido: userData.usuarioAdminLocalEstablecido || null,
    equipoInformaticoAsignado: userData.equipoInformaticoAsignado || null,
    marcaModeloEndpoint: userData.marcaModeloEndpoint || null,
    codigoBitlockerRepositorio: userData.codigoBitlockerRepositorio || false,
    numeroSerieEndpoint: userData.numeroSerieEndpoint || null,
    macWifiEndpoint: userData.macWifiEndpoint || null,
    macEthernetEndpoint: userData.macEthernetEndpoint || null,
    marcaModeloCargadorEndpoint: userData.marcaModeloCargadorEndpoint || null,
    nombreAsignadoEndpoint: userData.nombreAsignadoEndpoint || null,
    endpointEnDominio: userData.endpointEnDominio || false,
    homepageFactorialNavegadores: userData.homepageFactorialNavegadores || false,
    bitlockerActivo: userData.bitlockerActivo || false,
    teamviewerCorporativoInstalado: userData.teamviewerCorporativoInstalado || false,
    teamviewerEnEndpoint: userData.teamviewerEnEndpoint || false,
    idTeamviewerEndpoint: userData.idTeamviewerEndpoint || null,
    sevenZipInstalado: userData.sevenZipInstalado || false,
    antimalwareInstalado: userData.antimalwareInstalado || false,
    adobeAcrobatReaderInstalado: userData.adobeAcrobatReaderInstalado || false,
    forticlientVpnInstalado: userData.forticlientVpnInstalado || false,
    office365instalado: userData.office365instalado || false,
    accesoOffice365correcto: userData.accesoOffice365correcto || false,
    onedriveInstalado: userData.onedriveInstalado || false,
    deshabilitarOnedriveBackupEscritorio: userData.deshabilitarOnedriveBackupEscritorio || false,
    teamsInstalado: userData.teamsInstalado || false,
    restauracionSistemaActivo: userData.restauracionSistemaActivo || false,
    bginfoInstaladoConfigurado: userData.bginfoInstaladoConfigurado || false,
    googleEarthProInstalado: userData.googleEarthProInstalado || false,
    softphoneEnEndpoint: userData.softphoneEnEndpoint || false,
    qgisInstalado: userData.qgisInstalado || false,
    pdf24instalado: userData.pdf24instalado || false,
    idiomaWindowsEstablecido: userData.idiomaWindowsEstablecido || null,
    firefoxChromeInstalado: userData.firefoxChromeInstalado || false,
    statusActividad: userData.statusActividad || 'Activo',
    visorDwgInstalado: userData.visorDwgInstalado || false,
    windows11instalado: userData.windows11instalado || false,
    softwareInstaladoAdicional: userData.softwareInstaladoAdicional || null,
  
    numeroPlantaImpresora: userData.numeroPlantaImpresora || null,
    driverImpresoraInstalado: userData.driverImpresoraInstalado || false,
    codigoUsuarioImpresora: userData.codigoUsuarioImpresora || null,
    impresoraConfigurada: userData.impresoraConfigurada || false,
  
    monitorAsignado: userData.monitorAsignado || null,
    monitorEntregado: userData.monitorEntregado || false,
    tecladoEntregado: userData.tecladoEntregado || false,
    tecladoAsignado: userData.tecladoAsignado || null,
    ratonEntregado: userData.ratonEntregado || false,
    ratonAsignado: userData.ratonAsignado || null,
  
    imeisMovil: userData.imeisMovil || null,
    smartphoneAsignado: userData.smartphoneAsignado || null,
    marcaModeloMovil: userData.marcaModeloMovil || null,
    direccionMacWifiMovil: userData.direccionMacWifiMovil || null,
    gmailAppleIdCreada: userData.gmailAppleIdCreada || false,
    nombreCuentaGmailAppleId: userData.nombreCuentaGmailAppleId || null,
    movilAsignadoNumero: userData.movilAsignadoNumero || null,
    numeroSerieMovil: userData.numeroSerieMovil || null,
    outlookDesplegadoMovil: userData.outlookDesplegadoMovil || false,
    teamsDesplegadoMovil: userData.teamsDesplegadoMovil || false,
    harmonyMobileInstalado: userData.harmonyMobileInstalado || false,
    mdmFullParcial: userData.mdmFullParcial || null,
    jamfInstalado: userData.jamfInstalado || false,
    pruebaLlamadasMovil: userData.pruebaLlamadasMovil || false,
    teamviewerEnMovil: userData.teamviewerEnMovil || false,
    idTeamviewerMovil: userData.idTeamviewerMovil || null,
    movilDesasignado: userData.movilDesasignado || false,
    terminalFijoTelefonia: userData.terminalFijoTelefonia || false,
    platDireccionMacTerminalFijo: userData.platDireccionMacTerminalFijo || null,
  
    comentarioEntregaMaterial: userData.comentarioEntregaMaterial || null,
  };
  mockUsers.push(newUser);
  return { ...newUser };
}

export async function updateUser(id: string, userUpdateData: Partial<Omit<User, 'id' | 'assignedItems'>>): Promise<User | null> {
  console.log(`Updating user ID: ${id} (mock) with data:`, userUpdateData);
  await new Promise(resolve => setTimeout(resolve, 100));
  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    const updatedUser = { ...mockUsers[userIndex], ...userUpdateData };
     // Ensure password is not accidentally cleared if not provided in update, unless explicitly set to empty string
    if (userUpdateData.password === undefined && mockUsers[userIndex].password) {
        updatedUser.password = mockUsers[userIndex].password;
    } else if (userUpdateData.password === '') {
        // If an empty string is explicitly passed, we might want to handle it
        // (e.g., disallow clearing password or require a "change password" flow).
        // For this mock, if an empty string is passed, we'll update it,
        // but typically you'd want to keep the old password if a new one isn't provided.
        // Let's ensure if password is not in userUpdateData, it keeps the old one.
         if (!('password' in userUpdateData)) {
            updatedUser.password = mockUsers[userIndex].password;
        }
    }


    mockUsers[userIndex] = updatedUser;
    return { ...mockUsers[userIndex] };
  }
  return null;
}

export async function deleteUser(id: string): Promise<boolean> {
  console.log(`Deleting user ID: ${id} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 100));
  const initialLength = mockUsers.length;
  mockUsers = mockUsers.filter(u => u.id !== id);
  return mockUsers.length < initialLength;
}

export async function updateUserAssignedItemsCount(userId: string) {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        const items = await getInventoryItemsByUserId(userId);
        mockUsers[userIndex].assignedItems = items.length;
        console.log(`Updated assigned items count for user ${userId} to ${items.length}`);
    }
}
