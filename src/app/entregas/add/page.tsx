
"use client";

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import type { EntregaStatus, EntregaDetalleItem } from '@/types/entrega';
import { addEntrega } from '@/lib/entrega-data';
import { getAllUsers } from '@/lib/user-data'; // To select a user
import type { User } from '@/types/user';
import { Separator } from '@/components/ui/separator';

const entregaStatuses: EntregaStatus[] = ["Pendiente", "En Proceso", "Completada", "Cancelada"];

const entregaDetalleItemSchema = z.object({
  inventoryItemId: z.string().optional().nullable(),
  itemName: z.string().min(2, "El nombre del artículo debe tener al menos 2 caracteres."),
  quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1.").int(),
  serialNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

const formSchema = z.object({
  userId: z.string({ required_error: "Debe seleccionar un usuario." }),
  deliveryDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Fecha de entrega inválida." }),
  status: z.enum(entregaStatuses, { errorMap: () => ({ message: "Selecciona un estado válido." }) }),
  items: z.array(entregaDetalleItemSchema).min(1, "Debe añadir al menos un artículo a la entrega."),
  notes: z.string().optional().nullable(),
});

type EntregaFormData = z.infer<typeof formSchema>;

export default function AddEntregaPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const userList = await getAllUsers();
      setUsers(userList);
    }
    fetchUsers();
  }, []);

  const form = useForm<EntregaFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      deliveryDate: new Date().toISOString().split('T')[0], // Default to today
      status: "Pendiente",
      items: [{ itemName: "", quantity: 1, inventoryItemId: "", serialNumber: "", notes: "" }],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function onSubmit(values: EntregaFormData) {
    setIsSubmitting(true);
    
    const selectedUser = users.find(u => u.id === values.userId);
    if (!selectedUser) {
      toast({ title: "Error", description: "Usuario seleccionado no válido.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    const entregaDataForApi = {
      ...values,
      userName: selectedUser.name, // Add userName for the API
    };
    console.log("Entrega Form Submitted:", entregaDataForApi);


    try {
      const newEntrega = await addEntrega(entregaDataForApi as Omit<typeof entregaDataForApi, 'items'> & { items: Omit<EntregaDetalleItem, 'id'>[] });
      toast({
        title: "Entrega Registrada Correctamente",
        description: `La entrega ${newEntrega.id} para ${newEntrega.userName} ha sido creada.`,
        variant: "default",
      });
      router.push('/entregas');
    } catch (error) {
      console.error("Error adding entrega:", error);
      toast({
        title: "Error al Registrar Entrega",
        description: "Hubo un problema al guardar la entrega. Inténtalo de nuevo.",
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
            <ClipboardPlus className="w-6 h-6"/> Registrar Nueva Entrega de Equipo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="add-entrega-form">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuario Receptor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un usuario" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {users.map(user => <SelectItem key={user.id} value={user.id}>{user.name} ({user.email})</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Entrega</FormLabel>
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
                      <FormLabel>Estado de la Entrega</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un estado" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {entregaStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator className="my-6"/>
              <h3 className="text-lg font-medium text-primary">Artículos de la Entrega</h3>
              {fields.map((item, index) => (
                <div key={item.id} className="space-y-4 p-4 border rounded-md relative">
                   <FormField
                    control={form.control}
                    name={`items.${index}.itemName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre/Descripción del Artículo #{index + 1}</FormLabel>
                        <FormControl><Input placeholder="Ej: Laptop Dell XPS 15, Teclado, Ratón" {...field} /></FormControl>
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
                        name={`items.${index}.inventoryItemId`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Etiqueta de Activo (Opcional)</FormLabel>
                            <FormControl><Input placeholder="Ej: ASSET-00X" {...field} value={field.value ?? ""} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>
                   <FormField
                    control={form.control}
                    name={`items.${index}.serialNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Serie (Opcional)</FormLabel>
                        <FormControl><Input placeholder="Introduce el número de serie si aplica" {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.notes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas del Artículo (Opcional)</FormLabel>
                        <FormControl><Textarea placeholder="Ej: Incluye cargador, sin caja original..." {...field} value={field.value ?? ""} /></FormControl>
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
                onClick={() => append({ itemName: "", quantity: 1, inventoryItemId: "", serialNumber: "", notes: "" })}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Otro Artículo
              </Button>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Generales de la Entrega (Opcional)</FormLabel>
                    <FormControl><Textarea placeholder="Cualquier detalle adicional sobre la entrega en general..." {...field} value={field.value ?? ""} /></FormControl>
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
          <Button type="submit" form="add-entrega-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando Entrega...
              </>
            ) : (
              'Guardar Entrega'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
