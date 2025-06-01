
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
import { Loader2, ArrowLeft, Pencil, Smartphone } from 'lucide-react';
import Link from 'next/link';
import type { MobileLineStatus, MobileLine } from '@/types/mobile-line';
import { getMobileLineById, updateMobileLine } from '@/lib/mobile-line-data';
import { getAllUsers } from '@/lib/user-data';
import type { User } from '@/types/user';

const mobileLineStatuses: MobileLineStatus[] = ["Activa", "Suspendida", "Cancelada", "Sin Asignar"];
const UNASSIGNED_USER_VALUE = "__UNASSIGNED__";

const formSchema = z.object({
  phoneNumber: z.string().min(9, "El número de teléfono debe tener al menos 9 dígitos.").regex(/^\+?[0-9\s-()]*$/, "Formato de número inválido."),
  carrier: z.string().min(2, "El operador debe tener al menos 2 caracteres."),
  planName: z.string().min(2, "El nombre del plan debe tener al menos 2 caracteres."),
  status: z.enum(mobileLineStatuses, { errorMap: () => ({ message: "Selecciona un estado válido." }) }),
  simCardNumber: z.string().optional().nullable(),
  pukCode: z.string().optional().nullable(),
  activationDate: z.string().optional().nullable().refine(val => !val || !isNaN(Date.parse(val)), { message: "Fecha de activación inválida." }),
  assignedToUserId: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type MobileLineFormData = z.infer<typeof formSchema>;

export default function EditMobileLinePage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const lineId = params?.lineId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [originalLineNumber, setOriginalLineNumber] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const form = useForm<MobileLineFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {}, 
  });

  useEffect(() => {
    async function fetchUsers() {
      const userList = await getAllUsers();
      setUsers(userList);
    }
    fetchUsers();
  }, []);
  
  const fetchLineData = useCallback(async () => {
    if (!lineId) {
        router.push('/mobile-lines');
        return;
    }
    setIsLoadingData(true);
    const data = await getMobileLineById(lineId);
    if (data) {
        setOriginalLineNumber(data.phoneNumber);
        form.reset({
            ...data,
            activationDate: data.activationDate ? new Date(data.activationDate).toISOString().split('T')[0] : "",
            assignedToUserId: data.assignedToUserId ?? UNASSIGNED_USER_VALUE, 
        });
    } else {
        toast({ title: "Error", description: "Línea móvil no encontrada.", variant: "destructive" });
        router.push('/mobile-lines');
    }
    setIsLoadingData(false);
  }, [lineId, form, router, toast]);

  useEffect(() => {
    fetchLineData();
  }, [fetchLineData]);


  async function onSubmit(values: MobileLineFormData) {
    setIsSubmitting(true);
    
    let assignedToUserName: string | null = null;
    const finalAssignedToUserId = values.assignedToUserId === UNASSIGNED_USER_VALUE ? null : values.assignedToUserId;

    if (finalAssignedToUserId) {
      const selectedUser = users.find(u => u.id === finalAssignedToUserId);
      if (selectedUser) {
        assignedToUserName = selectedUser.name;
      } else {
        toast({ title: "Error", description: "Usuario seleccionado para asignación no válido.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
    }
    
    const lineDataForApi: Partial<Omit<MobileLine, 'id'>> = {
      ...values,
      assignedToUserId: finalAssignedToUserId,
      assignedToUserName,
    };
    console.log("Form Submitted for Update:", lineDataForApi);

    try {
      const updatedLine = await updateMobileLine(lineId, lineDataForApi);
      if (updatedLine) {
        toast({
          title: "Línea Móvil Actualizada",
          description: `La línea ${updatedLine.phoneNumber} (ID: ${lineId}) ha sido actualizada.`,
          variant: "default",
        });
        router.push(`/mobile-lines/${lineId}`);
      } else {
        toast({ title: "Error", description: "No se pudo actualizar la línea móvil.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error updating mobile line:", error);
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
              <span className="ml-2">Cargando datos de la línea...</span>
          </div>
      );
  }

   if (!originalLineNumber) {
     return (
       <div className="flex justify-center items-center min-h-screen p-4 text-destructive">
         Línea móvil no encontrada o no se pudo cargar.
         <Link href="/mobile-lines" className="ml-2 underline">Volver a Líneas Móviles</Link>
       </div>
     );
   }

  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
             <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <Pencil className="w-6 h-6"/> Editar Línea Móvil: {originalLineNumber}
             </CardTitle>
              <Link href={`/mobile-lines/${lineId}`} passHref>
                <Button variant="ghost" size="sm">
                   <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar Edición
                 </Button>
               </Link>
          </div>
           <p className="text-sm text-muted-foreground">ID de Línea: {lineId}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="edit-mobile-line-form">
            <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Teléfono</FormLabel>
                    <FormControl><Input placeholder="Ej: 600112233" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="carrier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operador</FormLabel>
                      <FormControl><Input placeholder="Ej: Movistar, Vodafone" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="planName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Plan</FormLabel>
                      <FormControl><Input placeholder="Ej: Fusión Pro, Red Empresa" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado de la Línea</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un estado" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {mobileLineStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="simCardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de SIM (ICCID) (Opcional)</FormLabel>
                      <FormControl><Input placeholder="Ej: 8934..." {...field} value={field.value ?? ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pukCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código PUK (Opcional)</FormLabel>
                      <FormControl><Input placeholder="Ej: 12345678" {...field} value={field.value ?? ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="activationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Activación (Opcional)</FormLabel>
                    <FormControl><Input type="date" {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignedToUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asignar a Usuario (Opcional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? UNASSIGNED_USER_VALUE}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un usuario" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value={UNASSIGNED_USER_VALUE}>Sin Asignar</SelectItem>
                        {users.map(user => <SelectItem key={user.id} value={user.id}>{user.name} ({user.email})</SelectItem>)}
                      </SelectContent>
                    </Select>
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
                    <FormControl><Textarea placeholder="Cualquier detalle adicional sobre la línea..." {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
         <CardFooter className="flex justify-end space-x-2">
            <Link href={`/mobile-lines/${lineId}`} passHref>
                 <Button type="button" variant="outline" disabled={isSubmitting} className="mr-2">
                    Cancelar
                 </Button>
            </Link>
            <Button type="submit" form="edit-mobile-line-form" disabled={isSubmitting}>
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
