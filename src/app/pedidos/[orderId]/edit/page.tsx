
"use client";

import { useState, useEffect, useCallback } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Loader2, ArrowLeft, Pencil, Trash2, PlusCircle } from 'lucide-react';
import type { OrderStatus, OrderItem, Order } from '@/types/order';
import { getOrderById, updateOrder } from '@/lib/order-data';
import { InventoryItemType } from '@/types/inventory';

const orderStatuses: OrderStatus[] = ["Solicitado", "Comprado", "En Tránsito", "Recibido", "Cancelado"];
const itemCategories: InventoryItemType[] = ["Portátil", "Sobremesa", "Monitor", "Móvil", "Tablet", "Teclado", "Ratón", "Docking Station", "Impresora", "Servidor", "Redes", "Almacenamiento", "Otro"];

const orderItemSchema = z.object({
  id: z.string().optional(), // Keep existing ID if present
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
  expectedArrivalDate: z.string().optional().nullable().refine(val => !val || !isNaN(Date.parse(val)), { message: "Fecha de llegada estimada inválida." }),
  actualArrivalDate: z.string().optional().nullable().refine(val => !val || !isNaN(Date.parse(val)), { message: "Fecha de llegada real inválida." }),
  trackingNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(orderItemSchema).min(1, "Debe haber al menos un artículo en el pedido."),
});

type OrderFormData = z.infer<typeof formSchema>;

export default function EditOrderPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [originalOrderSupplier, setOriginalOrderSupplier] = useState<string | null>(null);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { items: [] }, // Default items to empty array
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const fetchOrderData = useCallback(async () => {
    if (!orderId) {
      router.push('/pedidos');
      return;
    }
    setIsLoadingData(true);
    const data = await getOrderById(orderId);
    if (data) {
      setOriginalOrderSupplier(data.supplier);
      form.reset({
        ...data,
        orderDate: data.orderDate ? new Date(data.orderDate).toISOString().split('T')[0] : "",
        expectedArrivalDate: data.expectedArrivalDate ? new Date(data.expectedArrivalDate).toISOString().split('T')[0] : "",
        actualArrivalDate: data.actualArrivalDate ? new Date(data.actualArrivalDate).toISOString().split('T')[0] : "",
        items: data.items.map(item => ({...item})) // Ensure items are new objects
      });
    } else {
      toast({ title: "Error", description: "Pedido no encontrado.", variant: "destructive" });
      router.push('/pedidos');
    }
    setIsLoadingData(false);
  }, [orderId, form, router, toast, replace]);

  useEffect(() => {
    fetchOrderData();
  }, [fetchOrderData]);

  async function onSubmit(values: OrderFormData) {
    setIsSubmitting(true);
    console.log("Form Submitted for Update:", values);

    try {
      const updatedOrder = await updateOrder(orderId, values);
      if (updatedOrder) {
        toast({
          title: "Pedido Actualizado Correctamente",
          description: `El pedido ${updatedOrder.id} para ${updatedOrder.supplier} ha sido actualizado.`,
          variant: "default",
        });
        router.push(`/pedidos/${orderId}`);
      } else {
        toast({ title: "Error", description: "No se pudo actualizar el pedido.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error al Actualizar Pedido",
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
        <span className="ml-2">Cargando datos del pedido...</span>
      </div>
    );
  }

  if (!originalOrderSupplier) {
     return (
       <div className="flex justify-center items-center min-h-screen p-4 text-destructive">
         Pedido no encontrado o no se pudo cargar.
         <Link href="/pedidos" className="ml-2 underline">Volver a Pedidos</Link>
       </div>
     );
   }

  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <Pencil className="w-6 h-6"/> Editar Pedido: {orderId} (Proveedor: {originalOrderSupplier})
            </CardTitle>
            <Link href={`/pedidos/${orderId}`} passHref>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar Edición
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="edit-order-form">
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                 <FormField
                  control={form.control}
                  name="actualArrivalDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha Real de Llegada (Opcional)</FormLabel>
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
                          <Select onValueChange={field.onChange} value={field.value}>
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
          <Link href={`/pedidos/${orderId}`} passHref>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" form="edit-order-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando Cambios...
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
