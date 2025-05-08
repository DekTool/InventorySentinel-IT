
"use client";

import { useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { Loader2, KeyRound } from 'lucide-react';
import type { LicenseType, LicenseStatus } from '@/types/license';
import { addLicense } from '@/lib/license-data'; // Mock function

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

export default function AddLicensePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LicenseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      softwareName: "",
      licenseKey: "",
      licenseType: "Suscripción Anual",
      seats: 1,
      status: "Sin Asignar",
      purchaseDate: "",
      expirationDate: "",
      vendor: "",
      assignedTo: "",
      notes: "",
    },
  });

  async function onSubmit(values: LicenseFormData) {
    setIsSubmitting(true);
    console.log("License Form Submitted:", values);

    try {
      const newLicense = await addLicense(values);
      toast({
        title: "Licencia Añadida Correctamente",
        description: `Licencia ${newLicense.id} para ${newLicense.softwareName} ha sido creada.`,
        variant: "default",
      });
      router.push('/licencias');
      // router.push(`/licencias/${newLicense.id}`); // Option to redirect to detail page
    } catch (error) {
      console.error("Error adding license:", error);
      toast({
        title: "Error al Añadir Licencia",
        description: "Hubo un problema al guardar la licencia. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <KeyRound className="w-6 h-6"/> Añadir Nueva Licencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="add-license-form">
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
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Input placeholder="e.g., ID de Usuario, ID de Equipo, Departamento" {...field} value={field.value || ''} />
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
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting} className="mr-2">
                Cancelar
            </Button>
            <Button type="submit" form="add-license-form" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Licencia'
              )}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
