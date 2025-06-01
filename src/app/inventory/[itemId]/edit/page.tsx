
"use client";

import { useState, useEffect, useCallback } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from 'next/navigation';
import { Loader2, ArrowLeft, Pencil } from 'lucide-react';
import Link from 'next/link';
import { getInventoryItemById, updateInventoryItem } from '@/lib/inventory-data';
import type { InventoryItem, InventoryItemStatus, InventoryItemType } from '@/types/inventory';
import { Separator } from '@/components/ui/separator';

const itemStatuses: InventoryItemStatus[] = ["En Stock", "Asignado", "Mantenimiento", "Retirado"];
const itemTypes: InventoryItemType[] = ["Portátil", "Sobremesa", "Monitor", "Móvil", "Tablet", "Teclado", "Ratón", "Docking Station", "Impresora", "Servidor", "Redes", "Almacenamiento", "Otro"];

const booleanStringTransform = z.string().transform(val => val === "true").optional().nullable();

const baseSchema = {
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  type: z.enum(itemTypes, {
    errorMap: () => ({ message: "Por favor, selecciona un tipo de equipo válido."})
  }),
  serialNumber: z.string().optional().nullable(),
  barcode: z.string().min(5, { message: "El código de barras debe tener al menos 5 caracteres."}).max(50),
  purchaseDate: z.string().optional().nullable(),
  warrantyEndDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(itemStatuses, {
    errorMap: () => ({ message: "Por favor, selecciona un estado válido."})
  }),
  assignedTo: z.string().optional().nullable(),
  assignedToId: z.string().optional().nullable(),
};

const endpointSchemaFields = {
  usuarioAdminLocalEstablecido: z.string().optional().nullable(),
  marcaModeloEndpoint: z.string().optional().nullable(),
  codigoBitlockerEnRepositorio: booleanStringTransform,
  macWifiEndpoint: z.string().optional().nullable(),
  macEthernetEndpoint: z.string().optional().nullable(),
  marcaModeloCargadorEndpoint: z.string().optional().nullable(),
  nombreAsignadoEndpoint: z.string().optional().nullable(),
  endpointEnDominio: booleanStringTransform,
  homepageFactorialNavegadores: booleanStringTransform,
  bitlockerActivo: booleanStringTransform,
  teamviewerCorporativoInstalado: booleanStringTransform,
  teamviewerEnEndpoint: booleanStringTransform,
  idTeamviewerEndpoint: z.string().optional().nullable(),
  sevenZipInstalado: booleanStringTransform,
  antimalwareInstalado: booleanStringTransform,
  adobeAcrobatReaderInstalado: booleanStringTransform,
  forticlientVpnInstalado: booleanStringTransform,
  office365instalado: booleanStringTransform,
  accesoOffice365correcto: booleanStringTransform,
  onedriveInstalado: booleanStringTransform,
  deshabilitarOnedriveBackupEscritorio: booleanStringTransform,
  teamsInstalado: booleanStringTransform,
  restauracionSistemaActivo: booleanStringTransform,
  bginfoInstaladoConfigurado: booleanStringTransform,
  googleEarthProInstalado: booleanStringTransform,
  softphoneEnEndpoint: booleanStringTransform,
  qgisInstalado: booleanStringTransform,
  pdf24instalado: booleanStringTransform,
  idiomaWindowsEstablecido: z.string().optional().nullable(),
  firefoxChromeInstalado: booleanStringTransform,
  statusActividadEndpoint: z.string().optional().nullable(),
  visorDwgInstalado: booleanStringTransform,
  windowsVersion: z.string().optional().nullable(),
  softwareInstaladoAdicional: z.string().optional().nullable(),
  ficheroPlataformadoEntregado: booleanStringTransform,
  numeroPlantaImpresora: z.string().optional().nullable(),
  driverImpresoraInstalado: booleanStringTransform,
  codigoUsuarioImpresora: z.string().optional().nullable(),
  impresoraConfigurada: booleanStringTransform,
};

const formSchema = z.object({ ...baseSchema, ...endpointSchemaFields });

type ItemFormData = z.infer<typeof formSchema>;

function renderSelectBooleanField(form: any, name: keyof ItemFormData, label: string, description?: string) {
  const currentValue = form.watch(name);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={currentValue === true ? "true" : currentValue === false ? "false" : undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="true">Sí</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}


export default function EditInventoryItemPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const itemId = params?.itemId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [originalItemName, setOriginalItemName] = useState<string | null>(null);
  const [currentItemType, setCurrentItemType] = useState<InventoryItemType | undefined>(undefined);


  const form = useForm<ItemFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {}, // Will be set by useEffect
  });

  const fetchItemData = useCallback(async () => {
    if (!itemId) {
      router.push('/inventory');
      return;
    }
    setIsLoadingData(true);
    const data = await getInventoryItemById(itemId);
    if (data) {
      setOriginalItemName(data.name);
      setCurrentItemType(data.type);

      // Transform boolean fields to string "true" / "false" for Select components
      const transformedData: any = { ...data };
      for (const key in endpointSchemaFields) {
        if (Object.prototype.hasOwnProperty.call(endpointSchemaFields, key) && typeof data[key as keyof InventoryItem] === 'boolean') {
            transformedData[key] = data[key as keyof InventoryItem] ? "true" : "false";
        }
      }
      
      form.reset({
        ...transformedData,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate).toISOString().split('T')[0] : "",
        warrantyEndDate: data.warrantyEndDate ? new Date(data.warrantyEndDate).toISOString().split('T')[0] : "",
      });
    } else {
      toast({ title: "Error", description: "Equipo no encontrado.", variant: "destructive" });
      router.push('/inventory');
    }
    setIsLoadingData(false);
  }, [itemId, form, router, toast]);

  useEffect(() => {
    fetchItemData();
  }, [fetchItemData]);

  const itemType = form.watch("type"); // Watch type for conditional rendering

  async function onSubmit(values: ItemFormData) {
    setIsSubmitting(true);
    
    const updatePayload: Partial<InventoryItem> = { ...values };
    
    // Transform string "true"/"false" back to boolean for boolean fields
    for (const key in endpointSchemaFields) {
        // @ts-ignore
        if (Object.prototype.hasOwnProperty.call(endpointSchemaFields, key) && values[key] !== undefined && values[key] !== null) {
            // @ts-ignore
            if (endpointSchemaFields[key as keyof typeof endpointSchemaFields] === booleanStringTransform) {
                 // @ts-ignore
                updatePayload[key] = values[key] === "true";
            }
        }
    }
    console.log("Form Submitted for Update (transformed):", updatePayload);
    
    try {
      const updatedItem = await updateInventoryItem(itemId, updatePayload as Partial<Omit<InventoryItem, 'id'>>);
      if (updatedItem) {
        toast({
          title: "Equipo Actualizado Correctamente",
          description: `${updatedItem.name} (Etiqueta: ${itemId}) ha sido actualizado.`,
          variant: "default",
        });
        router.push(`/inventory/${itemId}`);
      } else {
        toast({ title: "Error", description: "No se pudo actualizar el equipo.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Error al Actualizar",
        description: "Hubo un problema al guardar los cambios. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando datos del equipo...</span>
      </div>
    );
  }

  if (!originalItemName) {
     return (
       <div className="flex justify-center items-center min-h-screen p-4 text-destructive">
         Equipo no encontrado o no se pudo cargar.
         <Link href="/inventory" className="ml-2 underline">Volver al inventario</Link>
       </div>
     );
   }

  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
             <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <Pencil className="w-6 h-6"/> Editar Equipo: {originalItemName}
             </CardTitle>
              <Link href={`/inventory/${itemId}`} passHref>
                <Button variant="ghost" size="sm">
                   <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar Edición
                 </Button>
               </Link>
          </div>
           <p className="text-sm text-muted-foreground">Etiqueta de Activo: {itemId}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="edit-item-form">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Equipo</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Laptop Pro 15, Ratón Inalámbrico X" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

             <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Equipo</FormLabel>
                     <Select onValueChange={(value) => { field.onChange(value); setCurrentItemType(value as InventoryItemType); }} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo de equipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {itemTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Barras / Identificador</FormLabel>
                    <FormControl>
                      <Input placeholder="Escanea o introduce el código de barras" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Serie (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Introduce el número de serie" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {itemStatuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Compra/Entrada</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="warrantyEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fin de Garantía (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assignedToId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID de Usuario Asignado (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., USR-001" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription>Introduce el ID del usuario si este equipo está asignado.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Usuario Asignado (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Alice Smith (Para referencia)" {...field} value={field.value ?? ""} />
                    </FormControl>
                     <FormDescription>Nombre del usuario (informativo, se actualiza con el ID).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

             {(itemType === "Portátil" || itemType === "Sobremesa") && (
                <>
                  <Separator className="my-6" />
                  <h3 className="text-xl font-semibold text-primary border-b pb-2">Detalles del Endpoint</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="marcaModeloEndpoint" render={({ field }) => (<FormItem><FormLabel>Marca y Modelo Específico</FormLabel><FormControl><Input placeholder="Ej: Dell XPS 15 9530" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="nombreAsignadoEndpoint" render={({ field }) => (<FormItem><FormLabel>Nombre de Host/NetBIOS</FormLabel><FormControl><Input placeholder="Ej: ES-LPT-ASmith" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="usuarioAdminLocalEstablecido" render={({ field }) => (<FormItem><FormLabel>Admin. Local Establecido</FormLabel><FormControl><Input placeholder="Ej: soporte_local" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "codigoBitlockerEnRepositorio", "Código Bitlocker en Repositorio")}
                    <FormField control={form.control} name="macWifiEndpoint" render={({ field }) => (<FormItem><FormLabel>MAC WiFi</FormLabel><FormControl><Input placeholder="00:1A:2B:3C:4D:5E" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="macEthernetEndpoint" render={({ field }) => (<FormItem><FormLabel>MAC Ethernet</FormLabel><FormControl><Input placeholder="00:1A:2B:3C:4D:5F" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="marcaModeloCargadorEndpoint" render={({ field }) => (<FormItem><FormLabel>Marca/Modelo Cargador</FormLabel><FormControl><Input placeholder="Ej: Dell 130W USB-C" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "endpointEnDominio", "Endpoint en Dominio")}
                    {renderSelectBooleanField(form, "homepageFactorialNavegadores", "Homepage Factorial en Navegadores")}
                    {renderSelectBooleanField(form, "bitlockerActivo", "BitLocker Activo")}
                    {renderSelectBooleanField(form, "ficheroPlataformadoEntregado", "Fichero Plataformado Entregado")}
                    <FormField control={form.control} name="windowsVersion" render={({ field }) => (<FormItem><FormLabel>Versión Windows</FormLabel><FormControl><Input placeholder="Ej: 11 Pro, 10 Enterprise" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="idiomaWindowsEstablecido" render={({ field }) => (<FormItem><FormLabel>Idioma Windows</FormLabel><FormControl><Input placeholder="Ej: Español (España)" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="statusActividadEndpoint" render={({ field }) => (<FormItem><FormLabel>Estado Actividad Endpoint</FormLabel><FormControl><Input placeholder="Ej: Active" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    
                    <Separator className="md:col-span-2 lg:col-span-3 my-2" />
                    <h4 className="text-md font-medium text-muted-foreground md:col-span-2 lg:col-span-3">Software y Configuración</h4>
                    
                    {renderSelectBooleanField(form, "teamviewerCorporativoInstalado", "TeamViewer Corp. Instalado")}
                    {renderSelectBooleanField(form, "teamviewerEnEndpoint", "TeamViewer en Endpoint")}
                    <FormField control={form.control} name="idTeamviewerEndpoint" render={({ field }) => (<FormItem><FormLabel>ID TeamViewer Endpoint</FormLabel><FormControl><Input placeholder="123 456 789" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "sevenZipInstalado", "7Zip Instalado")}
                    {renderSelectBooleanField(form, "antimalwareInstalado", "Antimalware Instalado")}
                    {renderSelectBooleanField(form, "adobeAcrobatReaderInstalado", "Adobe Acrobat Reader Instalado")}
                    {renderSelectBooleanField(form, "forticlientVpnInstalado", "FortiClient VPN Instalado")}
                    {renderSelectBooleanField(form, "office365instalado", "Office 365 Instalado")}
                    {renderSelectBooleanField(form, "accesoOffice365correcto", "Acceso Office 365 Correcto")}
                    {renderSelectBooleanField(form, "onedriveInstalado", "OneDrive Instalado")}
                    {renderSelectBooleanField(form, "deshabilitarOnedriveBackupEscritorio", "Deshabilitar Backup Escritorio OneDrive")}
                    {renderSelectBooleanField(form, "teamsInstalado", "Teams Instalado")}
                    {renderSelectBooleanField(form, "restauracionSistemaActivo", "Restauración Sistema Activo")}
                    {renderSelectBooleanField(form, "bginfoInstaladoConfigurado", "BGInfo Instalado/Configurado")}
                    {renderSelectBooleanField(form, "googleEarthProInstalado", "Google Earth Pro Instalado")}
                    {renderSelectBooleanField(form, "softphoneEnEndpoint", "Softphone en Endpoint")}
                    {renderSelectBooleanField(form, "qgisInstalado", "QGIS Instalado")}
                    {renderSelectBooleanField(form, "pdf24instalado", "PDF24 Instalado")}
                    {renderSelectBooleanField(form, "firefoxChromeInstalado", "Firefox y/o Chrome Instalado")}
                    {renderSelectBooleanField(form, "visorDwgInstalado", "Visor DWG Instalado")}
                    <FormField control={form.control} name="softwareInstaladoAdicional" render={({ field }) => (<FormItem className="md:col-span-2 lg:col-span-3"><FormLabel>Otro Software Instalado</FormLabel><FormControl><Textarea placeholder="Listar otro software..." {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    
                    <Separator className="md:col-span-2 lg:col-span-3 my-2" />
                    <h4 className="text-md font-medium text-muted-foreground md:col-span-2 lg:col-span-3">Configuración de Impresora (en Endpoint)</h4>
                    <FormField control={form.control} name="numeroPlantaImpresora" render={({ field }) => (<FormItem><FormLabel>Nº Planta Impresora</FormLabel><FormControl><Input placeholder="Ej: P02" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "driverImpresoraInstalado", "Driver Impresora Instalado en Endpoint")}
                    <FormField control={form.control} name="codigoUsuarioImpresora" render={({ field }) => (<FormItem><FormLabel>Código Usuario Impresora (si aplica)</FormLabel><FormControl><Input placeholder="12345" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                    {renderSelectBooleanField(form, "impresoraConfigurada", "Impresora Configurada en Endpoint")}
                  </div>
                </>
              )}

              <Separator className="my-6"/>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Generales del Equipo (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Cualquier detalle adicional sobre el equipo..."
                        className="resize-none"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
         <CardFooter className="flex justify-end">
            <Link href={`/inventory/${itemId}`} passHref>
                 <Button type="button" variant="outline" disabled={isSubmitting} className="mr-2">
                    Cancelar
                 </Button>
            </Link>
            <Button type="submit" form="edit-item-form" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando Cambios...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
