
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
import type { LicenseType, LicenseStatus, License } from '@/types/license';
import { getLicenseById, updateLicense } from '@/lib/license-data'; // Mock functions

const licenseTypes: LicenseType[] = ["Perpetua", "Suscripción Anual", "Suscripción Mensual", "OEM", "Freeware", "Shareware", "Otro"];
const licenseStatuses: LicenseStatus[] = ["Activa", "Expirada", "Sin Asignar", "Archivada"];

const formSchema = z.object({
  softwareName: z.string().min(2, {
    message: "El nombre del software debe tener al menos 2 caracteres.",
  }),
  licenseKey: z.string().min(5, {
    message: "La clave de licencia debe tener al menos 5 caracteres.",
  }),
  licenseType: z.enum(licenseTypes, {
    errorMap: () => ({ message: "Por favor, selecciona un tipo de licencia válido." }),
  }),
  seats: z.coerce.number().min(1, { message: "Debe haber al menos 1 puesto." }).int(),
  status: z.enum(licenseStatuses, {
    errorMap: () => ({ message: "Por favor, selecciona un estado válido." }),
  }),
  purchaseDate: z.string().optional().nullable(),
  expirationDate: z.string().optional().nullable(),
  vendor: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type LicenseFormData = z.infer<typeof formSchema>;

export default function EditLicensePage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const licenseId = params?.licenseId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [originalLicenseName, setOriginalLicenseName] = useState<string | null>(null);

  const form = useForm<LicenseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {}, // Will be set by useEffect
  });

  const fetchLicenseData = useCallback(async () => {
    if (!licenseId) {
        router.push('/licencias');
        return;
    }
    setIsLoadingData(true);
    const data = await getLicenseById(licenseId);
    if (data) {
        setOriginalLicenseName(data.softwareName);
        form.reset({
            ...data,
            purchaseDate: data.purchaseDate ? new Date(data.purchaseDate).toISOString().split('T')[0] : "",
            expirationDate: data.expirationDate ? new Date(data.expirationDate).toISOString().split('T')[0] : "",
        });
    } else {
        toast({ title: "Error", description: "Licencia no encontrada.", variant: "destructive" });
        router.push('/licencias');
    }
    setIsLoadingData(false);
  }, [licenseId, form, router, toast]);

  useEffect(() => {
    fetchLicenseData();
  }, [fetchLicenseData]);


  async function onSubmit(values: LicenseFormData) {
    setIsSubmitting(true);
    console.log("Form Submitted for Update:", values);
    console.log("Updating license ID:", licenseId);

    try {
      const updatedLicense = await updateLicense(licenseId, values);
      if (updatedLicense) {
        toast({
          title: "Licencia Actualizada Correctamente",
          description: `La licencia ${updatedLicense.softwareName} (ID: ${licenseId}) ha sido actualizada.`,
          variant: "default",
        });
        router.push(`/licencias/${licenseId}`);
      } else {
        toast({ title: "Error", description: "No se pudo actualizar la licencia.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error updating license:", error);
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
              <span className="ml-2">Cargando datos de la licencia...</span>
          </div>
      );
  }

   if (!originalLicenseName) { // Check if data was loaded
     return (
       <div className="flex justify-center items-center min-h-screen p-4 text-destructive">
         Licencia no encontrada o no se pudo cargar.
         <Link href="/licencias" className="ml-2 underline">Volver a Licencias</Link>
       </div>
     );
   }


  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
             <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <Pencil className="w-6 h-6"/> Editar Licencia: {originalLicenseName}
             </CardTitle>
              <Link href={`/licencias/${licenseId}`} passHref>
                <Button variant="ghost" size="sm">
                   <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar Edición
                 </Button>
               </Link>
          </div>
           <p className="text-sm text-muted-foreground">ID de Licencia: {licenseId}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="edit-license-form">
            <FormField
                control={form.control}
                name="softwareName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Software</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Editor de Video Pro, Suite Contable" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="licenseKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clave de Licencia</FormLabel>
                    <FormControl>
                      <Input placeholder="Introduce la clave de licencia completa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

             <FormField
                control={form.control}
                name="licenseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Licencia</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo de licencia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {licenseTypes.map(type => (
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
                name="seats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Puestos/Usuarios</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1, 5, 50" {...field} />
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
                            <SelectValue placeholder="Selecciona un estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {licenseStatuses.map(status => (
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
                    <FormLabel>FECHA DE ENTRADA</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Caducidad (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ''} />
                    </FormControl>
                     <FormDescription>
                       Relevante para licencias de suscripción.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proveedor (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Distribuidor Oficial, Fabricante" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asignado A (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ID de Usuario, ID de Equipo, Departamento" {...field} value={field.value || ''}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Cualquier detalle adicional sobre la licencia..."
                        className="resize-none"
                        {...field}
                        value={field.value || ''}
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
            <Link href={`/licencias/${licenseId}`} passHref>
                 <Button type="button" variant="outline" disabled={isSubmitting} className="mr-2">
                    Cancelar
                 </Button>
            </Link>
            <Button type="submit" form="edit-license-form" disabled={isSubmitting}>
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
