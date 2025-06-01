
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Mail, Building, Package, AlertTriangle, Loader2, UserX, Phone, Printer, User as UserIcon, ShieldCheck, CalendarDays, Briefcase, MapPin, Globe, LogOutIcon, Server, Key, SmartphoneIcon, Computer, Headphones, Mouse, MonitorIcon, PrinterIcon, Wifi, Cable, Info } from "lucide-react";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type { User } from '@/types/user';
import type { InventoryItem } from '@/types/inventory';
import { getUserById, deleteUser } from '@/lib/user-data';
import { getInventoryItemsByUserId } from '@/lib/inventory-data';
import { Badge } from '@/components/ui/badge';


const getInitials = (name: string) => {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

type FormType = 'entrega' | 'devolucion' | 'entrega-devolucion';

// Helper component to display a detail item
const DetailItem: React.FC<{ label: string; value: React.ReactNode; icon?: React.ElementType, fullWidth?: boolean }> = ({ label, value, icon: Icon, fullWidth }) => (
  <div className={`flex flex-col ${fullWidth ? 'md:col-span-2 lg:col-span-3' : ''}`}>
    <span className="text-xs text-muted-foreground flex items-center">
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {label}
    </span>
    <span className="text-sm font-medium break-words">
      {value === null || value === undefined || value === '' ? 'N/A' : typeof value === 'boolean' ? (value ? 'Sí' : 'No') : String(value)}
    </span>
  </div>
);


export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const userId = params?.userId as string;

  const [user, setUser] = useState<User | null>(null);
  const [assignedItems, setAssignedItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const userData = await getUserById(userId);
      if (userData) {
        setUser(userData);
        const itemsData = await getInventoryItemsByUserId(userId);
        setAssignedItems(itemsData);
      } else {
        toast({ title: "Error", description: "Usuario no encontrado.", variant: "destructive" });
        router.push('/users');
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({ title: "Error", description: "No se pudieron cargar los datos del usuario.", variant: "destructive" });
      router.push('/users');
    } finally {
      setIsLoading(false);
    }
  }, [userId, router, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const handleGenerateForm = useCallback((formType: FormType) => {
    if (!user) return;
    let toastTitle = "Preparando Formulario";
    let toastDescription = "Se está abriendo el formulario en una nueva pestaña.";

    switch(formType) {
        case 'entrega':
            toastDescription = "Se está abriendo el formulario de entrega en una nueva pestaña.";
            break;
        case 'devolucion':
            toastDescription = "Se está abriendo el formulario de devolución en una nueva pestaña.";
            break;
        case 'entrega-devolucion':
            toastDescription = "Se está abriendo el formulario de entrega/devolución en una nueva pestaña.";
            break;
    }
    
    window.open(`/users/${user.id}/print-return-form?type=${formType}`, '_blank');
    toast({
      title: toastTitle,
      description: toastDescription,
      variant: "default"
    });
  }, [user, toast]);

   const handleDeleteUser = useCallback(async () => {
    if (!user) return;
    if (assignedItems.length > 0) {
        toast({
            title: "Acción Requerida",
            description: `El usuario ${user.name} tiene ${assignedItems.length} equipo(s) asignado(s). Debes reasignarlos o retirarlos antes de eliminar al usuario.`,
            variant: "destructive",
            duration: 7000,
        });
        return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.name}" (ID: ${user.id})? Esta acción no se puede deshacer.`)) {
        setIsDeleting(true);
        try {
            const success = await deleteUser(user.id);
            if (success) {
                toast({
                    title: "Usuario Eliminado",
                    description: `El usuario ${user.name} ha sido eliminado.`,
                    variant: "default"
                });
                router.push('/users');
            } else {
                 toast({
                    title: "Error al Eliminar",
                    description: "No se pudo eliminar el usuario.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast({
                title: "Error del Servidor",
                description: "Ocurrió un error al intentar eliminar el usuario.",
                variant: "destructive"
            });
        } finally {
            setIsDeleting(false);
        }
    }
  }, [user, router, toast, assignedItems]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
         <span className="ml-2">Cargando detalles del usuario...</span>
      </div>
    );
  }

   if (!user) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-destructive">
          <AlertTriangle className="w-12 h-12 mb-4" />
          <h2 className="text-xl font-semibold mb-4">Usuario no encontrado</h2>
          <p>No se pudo cargar la información del usuario solicitado.</p>
          <Link href="/users" passHref className="mt-4">
             <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Usuarios
             </Button>
          </Link>
       </div>
     )
   }
   
  const getRoleVariant = (role?: User['role']): "default" | "secondary" | "outline" => {
    if (!role) return 'outline';
    switch (role) {
      case 'Administrador': return 'default';
      case 'Tecnico': return 'secondary';
      case 'Usuario': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 space-y-6">
       <div className="flex justify-between items-center flex-wrap gap-2">
         <Link href="/users" passHref>
             <Button variant="outline" size="sm" disabled={isDeleting}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Usuarios
             </Button>
        </Link>
        <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" onClick={() => handleGenerateForm('entrega')} disabled={isDeleting}>
                <Printer className="mr-2 h-4 w-4" /> Generar Form. Entrega
            </Button>
            <Button variant="secondary" onClick={() => handleGenerateForm('devolucion')} disabled={isDeleting}>
                <Printer className="mr-2 h-4 w-4" /> Generar Form. Devolución
            </Button>
            <Button variant="secondary" onClick={() => handleGenerateForm('entrega-devolucion')} disabled={isDeleting}>
                <Printer className="mr-2 h-4 w-4" /> Generar Form. Entrega/Devolución
            </Button>
             <Button variant="destructive" onClick={handleDeleteUser} disabled={isDeleting}>
                 {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="mr-2 h-4 w-4" />}
                  {isDeleting ? "Eliminando..." : "Eliminar Usuario"}
             </Button>
         </div>
       </div>

        {/* User Info Card */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                   <UserIcon className="h-10 w-10 text-muted-foreground m-auto" />
                </Avatar>
                <div>
                    <CardTitle className="text-2xl text-primary">{user.name}</CardTitle>
                    <CardDescription>{user.id}</CardDescription>
                    <Badge variant={getRoleVariant(user.role)} className="capitalize mt-1">{user.role}</Badge>
                </div>
            </div>
            <Link href={`/users/${userId}/edit`} passHref>
                <Button variant="outline" size="icon" disabled={isDeleting}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar Usuario</span>
                </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Separator/>
            <h3 className="text-md font-semibold text-foreground pt-2">Información Principal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
                 <DetailItem label="Email" value={user.email} icon={Mail}/>
                 <DetailItem label="Departamento" value={user.department} icon={Building}/>
                 <DetailItem label="Teléfono" value={user.phone} icon={Phone}/>
                 <DetailItem label="Fecha Incorporación" value={user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'} icon={CalendarDays}/>
                 <DetailItem label="Tipo de Cuenta" value={user.tipoCuenta} icon={UserIcon}/>
                 <DetailItem label="Estado de Cuenta" value={user.estadoCuenta} icon={ShieldCheck}/>
                 <DetailItem label="Empresa" value={user.empresa} icon={Briefcase}/>
                 <DetailItem label="Ubicación" value={user.ubicacion} icon={MapPin}/>
                 <DetailItem label="País" value={user.pais} icon={Globe}/>
                 <DetailItem label="Fecha Salida/Baja" value={user.fechaSalidaBaja ? new Date(user.fechaSalidaBaja).toLocaleDateString() : 'N/A'} icon={LogOutIcon}/>
                 <DetailItem label="Puesto de Trabajo" value={user.puestoTrabajo} icon={Briefcase}/>
                 <DetailItem label="Responsable (Manager)" value={user.responsableManager} icon={UsersIcon}/>
                 <DetailItem label="Entorno Corporativo" value={user.entornoCorporativo} icon={Server}/>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Equipment Card */}
        <Card>
           <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Package className="w-5 h-5"/> Equipos Asignados ({assignedItems.length})
                 </CardTitle>
                <CardDescription>Lista de activos IT asignados actualmente a {user.name}.</CardDescription>
           </CardHeader>
           <CardContent>
                {assignedItems.length > 0 ? (
                     <div className="overflow-auto max-h-[400px] rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Etiqueta Activo</TableHead>
                                    <TableHead>Nombre Equipo</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Fecha Asignación (Entrada Equipo)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignedItems.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                             <Link href={`/inventory/${item.id}`} className="hover:underline text-primary">
                                                 {item.id}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>{item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                     <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-md text-center">
                        <Package className="w-10 h-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Este usuario no tiene equipos asignados actualmente.</p>
                    </div>
                )}
           </CardContent>
        </Card>

        {/* DA / O365 Account Details */}
        <Card>
          <CardHeader><CardTitle className="text-xl flex items-center gap-2"><Key className="w-5 h-5"/>Cuenta Directorio Activo / O365</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            <DetailItem label="Cuenta en DA Creada" value={user.cuentaDAcreada} />
            <DetailItem label="Nombre Cuenta Windows/O365" value={user.nombreCuentaWindowsO365} />
            <DetailItem label="Ficha en DA Rellena" value={user.fichaDArellena} />
            <DetailItem label="Licencia O365 Asignada" value={user.licenciaO365asignada} />
            <DetailItem label="Asignado a Listas Distribución O365" value={user.asignadoListasDistribucionO365} />
            <DetailItem label="Cita en Calendario" value={user.citaEnCalendario} />
            <DetailItem label="Contraseña Personalizada" value={user.contrasenaPersonalizada} />
            <DetailItem label="Contraseña Inicial Establecida" value={user.contrasenaInicialEstablecida} />
            <DetailItem label="Tarjeta RFID Acceso - Madrid" value={user.tarjetaRFIDaccesoMadrid} />
            <DetailItem label="Acceso a Repositorio Otorgado" value={user.accesoRepositorioOtorgado} />
            <DetailItem label="Ruta Repositorio para Acceso" value={user.rutaRepositorioAcceso} fullWidth />
            <DetailItem label="Email de Onboarding Enviado" value={user.emailOnboardingEnviado} />
            <DetailItem label="Usuario Asignado a 'Network Operator' en DA" value={user.usuarioAsignadoNetworkOperatorDA} />
          </CardContent>
        </Card>

        {/* Endpoint Details */}
        <Card>
          <CardHeader><CardTitle className="text-xl flex items-center gap-2"><Computer className="w-5 h-5"/>Endpoint (Equipo Informático)</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            <DetailItem label="Tipo de Endpoint" value={user.endpointTipo} />
            <DetailItem label="Fichero Plataformado Entregado" value={user.ficheroPlataformadoEntregado} />
            <DetailItem label="Usuario Admin Local Establecido" value={user.usuarioAdminLocalEstablecido} />
            <DetailItem label="Equipo Informático Asignado (ID)" value={user.equipoInformaticoAsignado} />
            <DetailItem label="Marca y Modelo Endpoint" value={user.marcaModeloEndpoint} />
            <DetailItem label="Código BitLocker en Repositorio" value={user.codigoBitlockerRepositorio} />
            <DetailItem label="Número de Serie de Endpoint" value={user.numeroSerieEndpoint} />
            <DetailItem label="MAC WiFi Endpoint" value={user.macWifiEndpoint} icon={Wifi} />
            <DetailItem label="MAC Ethernet Endpoint" value={user.macEthernetEndpoint} icon={Cable}/>
            <DetailItem label="Marca y Modelo Cargador Endpoint" value={user.marcaModeloCargadorEndpoint} />
            <DetailItem label="Nombre Asignado al Endpoint" value={user.nombreAsignadoEndpoint} />
            <DetailItem label="Endpoint en Dominio" value={user.endpointEnDominio} />
            <DetailItem label="Homepage (Factorial) en Navegadores" value={user.homepageFactorialNavegadores} />
            <DetailItem label="BitLocker Activo" value={user.bitlockerActivo} />
            <DetailItem label="TeamViewer Corporativo Instalado" value={user.teamviewerCorporativoInstalado} />
            <DetailItem label="TeamViewer en Endpoint" value={user.teamviewerEnEndpoint} />
            <DetailItem label="ID TeamViewer Endpoint" value={user.idTeamviewerEndpoint} />
            <DetailItem label="7Zip Instalado" value={user.sevenZipInstalado} />
            <DetailItem label="Antimalware Instalado" value={user.antimalwareInstalado} />
            <DetailItem label="Adobe Acrobat Reader Instalado" value={user.adobeAcrobatReaderInstalado} />
            <DetailItem label="FortiClient VPN Instalado" value={user.forticlientVpnInstalado} />
            <DetailItem label="Office 365 Instalado" value={user.office365instalado} />
            <DetailItem label="Acceso a Office 365 Correcto" value={user.accesoOffice365correcto} />
            <DetailItem label="OneDrive Instalado" value={user.onedriveInstalado} />
            <DetailItem label="Deshabilitar OneDrive Backup Escritorio" value={user.deshabilitarOnedriveBackupEscritorio} />
            <DetailItem label="Teams Instalado" value={user.teamsInstalado} />
            <DetailItem label="Restauración Sistema Activo" value={user.restauracionSistemaActivo} />
            <DetailItem label="BGInfo Instalado y Configurado" value={user.bginfoInstaladoConfigurado} />
            <DetailItem label="Google Earth Pro Instalado" value={user.googleEarthProInstalado} />
            <DetailItem label="Softphone en Endpoint" value={user.softphoneEnEndpoint} />
            <DetailItem label="QGIS Instalado" value={user.qgisInstalado} />
            <DetailItem label="PDF24 Instalado" value={user.pdf24instalado} />
            <DetailItem label="Idioma Windows Establecido" value={user.idiomaWindowsEstablecido} />
            <DetailItem label="Firefox y/o Chrome Instalado" value={user.firefoxChromeInstalado} />
            <DetailItem label="Status Actividad Endpoint" value={user.statusActividad} />
            <DetailItem label="Visor DWG Instalado" value={user.visorDwgInstalado} />
            <DetailItem label="Windows 11 Instalado" value={user.windows11instalado} />
            <DetailItem label="Software Adicional Instalado" value={user.softwareInstaladoAdicional} fullWidth />
          </CardContent>
        </Card>
        
        {/* Printer Details */}
        <Card>
          <CardHeader><CardTitle className="text-xl flex items-center gap-2"><PrinterIcon className="w-5 h-5"/>Impresora</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            <DetailItem label="Número de Planta de Impresora" value={user.numeroPlantaImpresora} />
            <DetailItem label="Driver Impresora Instalado" value={user.driverImpresoraInstalado} />
            <DetailItem label="Código Usuario Impresora" value={user.codigoUsuarioImpresora} />
            <DetailItem label="Impresora Configurada" value={user.impresoraConfigurada} />
          </CardContent>
        </Card>

        {/* Peripherals Details */}
        <Card>
          <CardHeader><CardTitle className="text-xl flex items-center gap-2"><Headphones className="w-5 h-5"/>Periféricos</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            <DetailItem label="Monitor Asignado (ID)" value={user.monitorAsignado} icon={MonitorIcon} />
            <DetailItem label="Monitor Entregado" value={user.monitorEntregado} />
            <DetailItem label="Teclado Asignado (ID)" value={user.tecladoAsignado} />
            <DetailItem label="Teclado Entregado" value={user.tecladoEntregado} />
            <DetailItem label="Ratón Asignado (ID)" value={user.ratonAsignado} icon={Mouse} />
            <DetailItem label="Ratón Entregado" value={user.ratonEntregado} />
          </CardContent>
        </Card>
        
        {/* Mobile Telephony Details */}
        <Card>
          <CardHeader><CardTitle className="text-xl flex items-center gap-2"><SmartphoneIcon className="w-5 h-5"/>Telefonía Móvil</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            <DetailItem label="IMEIs del Móvil" value={user.imeisMovil} />
            <DetailItem label="Smartphone Asignado (ID)" value={user.smartphoneAsignado} />
            <DetailItem label="Marca y Modelo de Móvil" value={user.marcaModeloMovil} />
            <DetailItem label="Dirección MAC WiFi Móvil" value={user.direccionMacWifiMovil} />
            <DetailItem label="GMAIL O APPLE ID PARA MÓVIL CREADA" value={user.gmailAppleIdCreada} />
            <DetailItem label="Nombre Cuenta Gmail o Apple ID" value={user.nombreCuentaGmailAppleId} />
            <DetailItem label="Número de Móvil Asignado" value={user.movilAsignadoNumero} />
            <DetailItem label="Número de Serie del Móvil" value={user.numeroSerieMovil} />
            <DetailItem label="Outlook Desplegado en Móvil" value={user.outlookDesplegadoMovil} />
            <DetailItem label="Teams Desplegado en Móvil" value={user.teamsDesplegadoMovil} />
            <DetailItem label="Harmony Mobile Instalado" value={user.harmonyMobileInstalado} />
            <DetailItem label="MDM Full o Parcial" value={user.mdmFullParcial} />
            <DetailItem label="JAMF Instalado" value={user.jamfInstalado} />
            <DetailItem label="Prueba de Llamadas Móvil OK" value={user.pruebaLlamadasMovil} />
            <DetailItem label="TeamViewer en Móvil" value={user.teamviewerEnMovil} />
            <DetailItem label="ID TeamViewer Móvil" value={user.idTeamviewerMovil} />
            <DetailItem label="Móvil Desasignado" value={user.movilDesasignado} />
            <DetailItem label="Terminal Fijo de Telefonía Entregado" value={user.terminalFijoTelefonia} />
            <DetailItem label="Plataforma/MAC Terminal Fijo" value={user.platDireccionMacTerminalFijo} />
          </CardContent>
        </Card>

        {/* Comments Card */}
        <Card>
          <CardHeader><CardTitle className="text-xl flex items-center gap-2"><Info className="w-5 h-5"/>Comentario y Entrega de Material</CardTitle></CardHeader>
           <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {user.comentarioEntregaMaterial || 'No hay comentarios adicionales.'}
              </p>
           </CardContent>
        </Card>

       <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl">Registro de Actividad del Usuario</CardTitle>
             <CardDescription>Historial de asignaciones, devoluciones e interacciones con el sistema.</CardDescription>
          </CardHeader>
           <CardContent>
              <p className="text-sm text-muted-foreground">Registro de actividad del usuario próximamente...</p>
           </CardContent>
        </Card>
    </div>
  );
}
