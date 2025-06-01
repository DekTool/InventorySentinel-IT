
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash2, User, Calendar, Tag, Barcode, Info, Printer, Loader2, AlertTriangle, Wifi, Cable, Server, Key, Settings, HardDrive, MonitorIcon as MonitorLucideIcon } from "lucide-react"; // Added more icons
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { InventoryItem } from '@/types/inventory';
import { getInventoryItemById, deleteInventoryItem } from '@/lib/inventory-data';

// Helper component to display a detail item
const DetailItem: React.FC<{ label: string; value: React.ReactNode; icon?: React.ElementType, fullWidth?: boolean, className?: string }> = ({ label, value, icon: Icon, fullWidth, className }) => (
  <div className={cn(`flex flex-col ${fullWidth ? 'md:col-span-2 lg:col-span-3' : ''}`, className)}>
    <span className="text-xs text-muted-foreground flex items-center">
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {label}
    </span>
    <span className="text-sm font-medium break-words">
      {value === null || value === undefined || value === '' ? 'N/A' : typeof value === 'boolean' ? (value ? 'Sí' : 'No') : String(value)}
    </span>
  </div>
);


export default function InventoryItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const itemId = params?.itemId as string;

  const [item, setItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItemData = useCallback(async () => {
    if (!itemId) return;
    setIsLoading(true);
    const data = await getInventoryItemById(itemId);
    if (data) {
      setItem(data);
    } else {
      toast({ title: "Error", description: "Equipo no encontrado.", variant: "destructive"});
      router.push('/inventory');
    }
    setIsLoading(false);
  }, [itemId, router, toast]);

  useEffect(() => {
    fetchItemData();
  }, [fetchItemData]);

  const handlePrintTag = () => {
    if (!item) return;

    const printWindow = window.open('', '_blank', 'height=400,width=600');
    if (printWindow) {
      printWindow.document.write(\`
        <html>
          <head>
            <title>Etiqueta de Activo: \${item.id}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; margin: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 90vh;}
              .tag-container { display: inline-block; border: 2px solid black; padding: 20px; width: 300px; }
              .asset-id { font-size: 24px; font-weight: bold; margin-bottom: 10px; word-wrap: break-word; }
              .barcode-text { font-size: 18px; margin-bottom: 5px; word-wrap: break-word; }
              .barcode-placeholder { 
                height: 50px; 
                border: 1px dashed #ccc; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-style: italic; 
                color: #777;
                margin-top: 10px;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="tag-container">
              <div class="asset-id">\${item.id}</div>
              <div class="barcode-text">\${item.barcode}</div>
              <!-- En una aplicación real, aquí se podría generar una imagen de código de barras -->
              <div class="barcode-placeholder">(Espacio para Código de Barras)</div>
              <p class="no-print" style="margin-top: 20px; font-size: 12px;">Cierre esta ventana después de imprimir.</p>
            </div>
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      \`);
      printWindow.document.close();
      toast({
        title: "Etiqueta Generada",
        description: "Se ha abierto una nueva ventana para imprimir la etiqueta.",
        variant: "default"
      });
    } else {
      toast({
        title: "Error de Ventana Emergente",
        description: "No se pudo abrir la ventana de impresión. Revisa la configuración de tu navegador.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async () => {
    if (!item) return;
    if (confirm(\`¿Estás seguro de que quieres eliminar el equipo "\${item.name}" (ID: \${item.id})? Esta acción no se puede deshacer.\`)) {
      setIsDeleting(true);
      const success = await deleteInventoryItem(item.id);
      if (success) {
        toast({
            title: "Equipo Eliminado",
            description: \`\${item.name} ha sido eliminado del inventario.\`,
            variant: "default" 
        });
        router.push('/inventory');
      } else {
         toast({
            title: "Error al Eliminar",
            description: "No se pudo eliminar el equipo. Puede que ya no exista.",
            variant: "destructive"
        });
      }
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando detalles del equipo...</span>
      </div>
    );
  }

  if (!item) {
     return (
       <div className="flex flex-col items-center justify-center min-h-screen p-4 text-destructive">
         <AlertTriangle className="w-12 h-12 mb-4" />
         <h2 className="text-xl font-semibold mb-4">Equipo no Encontrado</h2>
         <p>El equipo de inventario solicitado no pudo ser cargado.</p>
         <Link href="/inventory" passHref className="mt-4">
             <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inventario
             </Button>
        </Link>
       </div>
     );
  }

  const isEndpointType = item.type === 'Portátil' || item.type === 'Sobremesa';

  return (
    <div className="flex flex-col h-full p-4 md:p-8 space-y-6">
       <div className="mb-6">
         <Link href="/inventory" passHref>
             <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inventario
             </Button>
        </Link>
       </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start gap-4 flex-wrap">
             <div>
                <CardTitle className="text-2xl text-primary flex items-center gap-2">
                    <Tag className="w-6 h-6"/> {item.id}
                 </CardTitle>
                <CardDescription>{item.name} - {item.type}</CardDescription>
             </div>
             <div className="flex gap-2">
                 <Button variant="outline" size="icon" onClick={handlePrintTag} title="Imprimir Etiqueta de Activo" disabled={isDeleting}>
                    <Printer className="h-4 w-4" />
                    <span className="sr-only">Imprimir Etiqueta de Activo</span>
                 </Button>
                 <Link href={`/inventory/${item.id}/edit`} passHref>
                    <Button variant="outline" size="icon" title="Editar Equipo" disabled={isDeleting}>
                        <Edit className="h-4 w-4" />
                         <span className="sr-only">Editar Equipo</span>
                    </Button>
                 </Link>
                 <Button variant="destructive" size="icon" onClick={handleDeleteItem} title="Eliminar Equipo" disabled={isDeleting}>
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                     <span className="sr-only">Eliminar Equipo</span>
                 </Button>
             </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                 <h3 className="font-semibold text-lg">Detalles Generales</h3>
                 <Separator className="my-2"/>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 text-sm">
                    <DetailItem label="Código Barras" value={item.barcode} icon={Barcode}/>
                    <DetailItem label="N/S" value={item.serialNumber} />
                    <DetailItem label="Fecha Compra/Entrada" value={item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'} icon={Calendar}/>
                    <DetailItem label="Fin Garantía" value={item.warrantyEndDate ? new Date(item.warrantyEndDate).toLocaleDateString() : 'N/A'} icon={Calendar}/>
                    <DetailItem label="Estado" value={<span className={`px-2 py-0.5 rounded-full text-xs ${
                            item.status === 'Asignado' ? 'bg-yellow-900 text-yellow-300' :
                            item.status === 'En Stock' ? 'bg-green-900 text-green-300' :
                            item.status === 'Mantenimiento' ? 'bg-blue-900 text-blue-300' :
                            item.status === 'Retirado' ? 'bg-red-900 text-red-300' :
                            'bg-gray-700 text-gray-300'
                         }`}>{item.status}</span>} icon={Info}/>
                    <DetailItem label="Asignado A" value={item.assignedTo || 'Sin Asignar'} icon={User}/>
                 </div>
            </div>
            
            {item.notes && (
                <div>
                    <h3 className="font-semibold text-lg mt-3">Notas Generales</h3>
                    <Separator className="my-2"/>
                    <p className="text-sm text-muted-foreground italic whitespace-pre-wrap">
                        {item.notes}
                    </p>
                </div>
            )}
        </CardContent>
         <CardFooter className="text-xs text-muted-foreground">
            <p>ID de Equipo: {item.id}</p>
         </CardFooter>
      </Card>

      {isEndpointType && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <HardDrive className="w-5 h-5" /> Detalles del Endpoint
            </CardTitle>
            <CardDescription>Información específica de configuración y software para este {item.type}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 text-sm">
                <DetailItem label="Marca y Modelo Específico" value={item.marcaModeloEndpoint} />
                <DetailItem label="Nombre de Host/NetBIOS" value={item.nombreAsignadoEndpoint} />
                <DetailItem label="Admin. Local Establecido" value={item.usuarioAdminLocalEstablecido} />
                <DetailItem label="Código Bitlocker en Repositorio" value={item.codigoBitlockerEnRepositorio} icon={Key} />
                <DetailItem label="MAC WiFi" value={item.macWifiEndpoint} icon={Wifi}/>
                <DetailItem label="MAC Ethernet" value={item.macEthernetEndpoint} icon={Cable}/>
                <DetailItem label="Marca/Modelo Cargador" value={item.marcaModeloCargadorEndpoint} />
                <DetailItem label="Endpoint en Dominio" value={item.endpointEnDominio} icon={Server}/>
                <DetailItem label="Homepage Factorial en Navegadores" value={item.homepageFactorialNavegadores} />
                <DetailItem label="BitLocker Activo" value={item.bitlockerActivo} icon={Key} />
                <DetailItem label="Fichero Plataformado Entregado" value={item.ficheroPlataformadoEntregado} />
                <DetailItem label="Versión Windows" value={item.windowsVersion} />
                <DetailItem label="Idioma Windows" value={item.idiomaWindowsEstablecido} />
                <DetailItem label="Estado Actividad Endpoint" value={item.statusActividadEndpoint} />
            </div>
            <Separator className="my-3"/>
             <h4 className="font-medium text-md text-muted-foreground">Software y Configuración</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 text-sm">
                <DetailItem label="TeamViewer Corp. Instalado" value={item.teamviewerCorporativoInstalado} />
                <DetailItem label="TeamViewer en Endpoint" value={item.teamviewerEnEndpoint} />
                <DetailItem label="ID TeamViewer Endpoint" value={item.idTeamviewerEndpoint} />
                <DetailItem label="7Zip Instalado" value={item.sevenZipInstalado} />
                <DetailItem label="Antimalware Instalado" value={item.antimalwareInstalado} />
                <DetailItem label="Adobe Acrobat Reader Instalado" value={item.adobeAcrobatReaderInstalado} />
                <DetailItem label="FortiClient VPN Instalado" value={item.forticlientVpnInstalado} />
                <DetailItem label="Office 365 Instalado" value={item.office365instalado} />
                <DetailItem label="Acceso Office 365 Correcto" value={item.accesoOffice365correcto} />
                <DetailItem label="OneDrive Instalado" value={item.onedriveInstalado} />
                <DetailItem label="Deshabilitar Backup Escritorio OneDrive" value={item.deshabilitarOnedriveBackupEscritorio} />
                <DetailItem label="Teams Instalado" value={item.teamsInstalado} />
                <DetailItem label="Restauración Sistema Activo" value={item.restauracionSistemaActivo} />
                <DetailItem label="BGInfo Instalado/Configurado" value={item.bginfoInstaladoConfigurado} />
                <DetailItem label="Google Earth Pro Instalado" value={item.googleEarthProInstalado} />
                <DetailItem label="Softphone en Endpoint" value={item.softphoneEnEndpoint} />
                <DetailItem label="QGIS Instalado" value={item.qgisInstalado} />
                <DetailItem label="PDF24 Instalado" value={item.pdf24instalado} />
                <DetailItem label="Firefox y/o Chrome Instalado" value={item.firefoxChromeInstalado} />
                <DetailItem label="Visor DWG Instalado" value={item.visorDwgInstalado} />
                 <DetailItem label="Otro Software Instalado" value={item.softwareInstaladoAdicional} fullWidth />
            </div>
            <Separator className="my-3"/>
            <h4 className="font-medium text-md text-muted-foreground">Configuración de Impresora (en Endpoint)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 text-sm">
                <DetailItem label="Nº Planta Impresora" value={item.numeroPlantaImpresora} />
                <DetailItem label="Driver Impresora Instalado" value={item.driverImpresoraInstalado} icon={Printer}/>
                <DetailItem label="Código Usuario Impresora" value={item.codigoUsuarioImpresora} />
                <DetailItem label="Impresora Configurada" value={item.impresoraConfigurada} icon={Settings}/>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><Info className="w-5 h-5"/> Historial del Equipo</CardTitle>
            <CardDescription>Registro de asignaciones, cambios de estado y mantenimiento.</CardDescription>
        </CardHeader>
         <CardContent>
            <p className="text-sm text-muted-foreground">Seguimiento del historial próximamente...</p>
         </CardContent>
      </Card>
    </div>
  );
}
