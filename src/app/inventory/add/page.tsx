
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
import { Loader2, PackagePlus } from 'lucide-react';
import { addInventoryItem } from '@/lib/inventory-data';
import type { InventoryItemStatus, InventoryItemType } from '@/types/inventory';

const itemStatuses: InventoryItemStatus[] = ["En Stock", "Asignado", "Mantenimiento", "Retirado"];
const itemTypes: InventoryItemType[] = ["Portátil", "Sobremesa", "Monitor", "Móvil", "Tablet", "Teclado", "Ratón", "Docking Station", "Impresora", "Servidor", "Redes", "Almacenamiento", "Otro"];


const formSchema = z.object({
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
  assignedTo: z.string().optional().nullable(), // This would be the display string, e.g. "User Name (email)"
  assignedToId: z.string().optional().nullable(), // This would be the actual User ID
});

export default function AddInventoryItemPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "Portátil",
      serialNumber: "",
      barcode: "", 
      purchaseDate: "",
      warrantyEndDate: "",
      notes: "",
      status: "En Stock",
      assignedTo: "",
      assignedToId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log("Form Submitted:", values);

    try {
      const newItem = await addInventoryItem(values);
      toast({
        title: "Equipo Añadido Correctamente",
        description: `Etiqueta de Activo ${newItem.id} creada para ${newItem.name}.`,
        variant: "default", 
      });
      router.push('/inventory');
    } catch (error) {
      console.error("Error adding inventory item:", error);
      toast({
        title: "Error al Añadir Equipo",
        description: "Hubo un problema al guardar el equipo. Inténtalo de nuevo.",
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
            <PackagePlus className="w-6 h-6"/> Añadir Nuevo Equipo al Inventario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="add-item-form">
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
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                     <FormDescription>
                      Se usará para escanear. Se generará una Etiqueta de Activo al guardar.
                    </FormDescription>
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
                    <FormLabel>Estado Inicial</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona estado inicial" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {itemStatuses.map(status =>(
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
                      <Input type="date" {...field} value={field.value ?? ""}/>
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
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting} className="mr-2">
                Cancelar
            </Button>
            <Button type="submit" form="add-item-form" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Equipo y Generar Etiqueta'
              )}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
