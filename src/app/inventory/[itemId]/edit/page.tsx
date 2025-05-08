
"use client";

import { useState, useEffect, useCallback } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
  assignedTo: z.string().optional().nullable(),
  assignedToId: z.string().optional().nullable(),
});

type ItemFormData = z.infer<typeof formSchema>;

export default function EditInventoryItemPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const itemId = params?.itemId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [originalItemName, setOriginalItemName] = useState<string | null>(null);

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
      form.reset({
        ...data,
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

  async function onSubmit(values: ItemFormData) {
    setIsSubmitting(true);
    console.log("Form Submitted for Update:", values);
    console.log("Updating item ID:", itemId);

    try {
      const updatedItem = await updateInventoryItem(itemId, values);
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
      <Card className="w-full max-w-2xl">
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
                     <Select onValueChange={field.onChange} value={field.value}>
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
                      <Input type="date" {...field} value={field.value ?? ""} />
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
              {/* Add fields for assignedTo and assignedToId if you want to edit them directly here */}
              {/* Typically assignment might be a separate action/workflow */}
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
