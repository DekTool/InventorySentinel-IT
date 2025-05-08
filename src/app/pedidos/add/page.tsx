
"use client";

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Loader2, ClipboardPlus, Trash2, PlusCircle } from 'lucide-react';
import type { OrderStatus, OrderItem } from '@/types/order';
import { addOrder } from '@/lib/order-data';
import { InventoryItemType } from '@/types/inventory'; // Re-use inventory item types for category

const orderStatuses: OrderStatus[] = ["Solicitado", "Comprado", "En Tránsito", "Recibido", "Cancelado"];
const itemCategories: InventoryItemType[] = ["Portátil", "Sobremesa", "Monitor", "Móvil", "Tablet", "Teclado", "Ratón", "Docking Station", "Impresora", "Servidor", "Redes", "Almacenamiento", "Otro"];

const orderItemSchema = z.object({
  itemName: z.string().min(2, "El nombre del artículo debe tener al menos 2 caracteres."),
  quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1.").int(),
  category: z.enum(itemCategories, { errorMap: () => ({ message: "Selecciona una categoría válida."}) }),
  model: z.string().optional().nullable(),
  characteristics: z.string().optional().nullable(),
});

const formSchema = z.object({
  supplier: z.string().min(2, "El proveedor debe tener al menos 2 caracteres."),
  orderDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Fecha de pedido inválida." }),
  status: z.enum(orderStatuses, { errorMap: () => ({ message: "Selecciona un estado válido." }) }),
  expectedArrivalDate: z.string().optional().nullable().refine(val => !val || !isNaN(Date.parse(val)), { message: "Fecha de llegada inválida." }),
  trackingNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(orderItemSchema).min(1, "Debe añadir al menos un artículo al pedido."),
});

type OrderFormData = z.infer<typeof formSchema>;

export default function AddOrderPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: "",
      orderDate: new Date().toISOString().split('T')[0], // Default to today
      status: "Solicitado",
      items: [{ itemName: "", quantity: 1, category: "Portátil", model: "", characteristics: "" }],
      trackingNumber: "",
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function onSubmit(values: OrderFormData) {
    setIsSubmitting(true);
    console.log("Order Form Submitted:", values);

    try {
      // The Omit part is not strictly needed here as addOrder expects items without 'id'
      const newOrder = await addOrder(values as Omit<OrderFormData, 'items'> & { items: Omit<OrderItem, 'id'>[] });
      toast({
        title: "Pedido Añadido Correctamente",
        description: `El pedido ${newOrder.id} para ${newOrder.supplier} ha sido creado.`,
        variant: "default",
      });
      router.push('/pedidos');
    } catch (error) {
      console.error("Error adding order:", error);
      toast({
        title: "Error al Añadir Pedido",
        description: "Hubo un problema al guardar el pedido. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <ClipboardPlus className="w-6 h-6"/> Registrar Nuevo Pedido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="add-order-form">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proveedor</FormLabel>
                      <FormControl><Input placeholder="Nombre del proveedor" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="orderDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Pedido</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado del Pedido</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un estado" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {orderStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expectedArrivalDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha Estimada de Llegada (Opcional)</FormLabel>
                      <FormControl><Input type="date" {...field} value={field.value ?? ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="trackingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Seguimiento (Opcional)</FormLabel>
                    <FormControl><Input placeholder="Introduce el número de seguimiento" {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-6"/>
              <h3 className="text-lg font-medium text-primary">Artículos del Pedido</h3>
              {fields.map((item, index) => (
                <div key={item.id} className="space-y-4 p-4 border rounded-md relative">
                  <FormField
                    control={form.control}
                    name={`items.${index}.itemName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Artículo #{index + 1}</FormLabel>
                        <FormControl><Input placeholder="Ej: Laptop Dell XPS 15" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cantidad</FormLabel>
                          <FormControl><Input type="number" placeholder="1" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecciona categoría" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {itemCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`items.${index}.model`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo (Opcional)</FormLabel>
                        <FormControl><Input placeholder="Ej: XPS 9530" {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.characteristics`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Características (Opcional)</FormLabel>
                        <FormControl><Textarea placeholder="Ej: 16GB RAM, 1TB SSD, Pantalla OLED" {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)} title="Eliminar artículo">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ itemName: "", quantity: 1, category: "Portátil", model: "", characteristics: "" })}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Otro Artículo
              </Button>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Adicionales (Opcional)</FormLabel>
                    <FormControl><Textarea placeholder="Cualquier detalle adicional sobre el pedido..." {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="add-order-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando Pedido...
              </>
            ) : (
              'Guardar Pedido'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
