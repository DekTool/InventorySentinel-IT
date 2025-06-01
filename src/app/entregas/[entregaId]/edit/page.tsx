
"use client";

import { useState, useEffect, useCallback } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import Link from 'next/link';
import type { EntregaStatus, EntregaDetalleItem, Entrega } from '@/types/entrega';
import { getEntregaById, updateEntrega } from '@/lib/entrega-data';
import { getAllUsers } from '@/lib/user-data'; // To select a user
import type { User } from '@/types/user';
import { Separator } from '@/components/ui/separator';

const entregaStatuses: EntregaStatus[] = ["Pendiente", "En Proceso", "Completada", "Cancelada"];

const entregaDetalleItemSchema = z.object({
  id: z.string().optional(), // Keep existing ID if present
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
  items: z.array(entregaDetalleItemSchema).min(1, "Debe haber al menos un artículo en la entrega."),
  notes: z.string().optional().nullable(),
});

type EntregaFormData = z.infer<typeof formSchema>;

export default function EditEntregaPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const entregaId = params?.entregaId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [originalEntregaUser, setOriginalEntregaUser] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const form = useForm<EntregaFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { items: [] },
  });
  
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    async function fetchUsers() {
      const userList = await getAllUsers();
      setUsers(userList);
    }
    fetchUsers();
  }, []);

  const fetchEntregaData = useCallback(async () => {
    if (!entregaId) {
      router.push('/entregas');
      return;
    }
    setIsLoadingData(true);
    const data = await getEntregaById(entregaId);
    if (data) {
      setOriginalEntregaUser(data.userName);
      form.reset({
        ...data,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate).toISOString().split('T')[0] : "",
        items: data.items.map(item => ({...item})) // Ensure items are new objects
      });
    } else {
      toast({ title: "Error", description: "Entrega no encontrada.", variant: "destructive" });
      router.push('/entregas');
    }
    setIsLoadingData(false);
  }, [entregaId, form, router, toast, replace]);

  useEffect(() => {
    fetchEntregaData();
  }, [fetchEntregaData]);

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
      userName: selectedUser.name,
    };
    console.log("Form Submitted for Update:", entregaDataForApi);

    try {
      const updatedEntrega = await updateEntrega(entregaId, entregaDataForApi);
      if (updatedEntrega) {
        toast({
          title: "Entrega Actualizada Correctamente",
          description: `La entrega ${updatedEntrega.id} para ${updatedEntrega.userName} ha sido actualizada.`,
          variant: "default",
        });
        router.push(`/entregas/${entregaId}`);
      } else {
        toast({ title: "Error", description: "No se pudo actualizar la entrega.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error updating entrega:", error);
      toast({
        title: "Error al Actualizar Entrega",
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
        <span className="ml-2">Cargando datos de la entrega...</span>
      </div>
    );
  }

  if (!originalEntregaUser) {
     return (
       <div className="flex justify-center items-center min-h-screen p-4 text-destructive">
         Entrega no encontrada o no se pudo cargar.
         <Link href="/entregas" className="ml-2 underline">Volver a Entregas</Link>
       </div>
     );
   }

  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <Pencil className="w-6 h-6"/> Editar Entrega: {entregaId} (Usuario: {originalEntregaUser})
            </CardTitle>
            <Link href={`/entregas/${entregaId}`} passHref>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar Edición
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="edit-entrega-form">
            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuario Receptor</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                        <FormControl><Textarea placeholder="Ej: Incluye cargador..." {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && ( // Ensure we always have at least one item block
                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)} title="Eliminar artículo">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ id: `new-${fields.length}`, itemName: "", quantity: 1, inventoryItemId: "", serialNumber: "", notes: "" })}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Otro Artículo
              </Button>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Generales (Opcional)</FormLabel>
                    <FormControl><Textarea placeholder="Cualquier detalle adicional sobre la entrega..." {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Link href={`/entregas/${entregaId}`} passHref>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" form="edit-entrega-form" disabled={isSubmitting}>
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
