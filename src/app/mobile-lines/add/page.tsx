
"use client";

import { useState, useEffect } from 'react';
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
import { Loader2, Smartphone } from 'lucide-react';
import type { MobileLineStatus, MobileLine } from '@/types/mobile-line';
import { addMobileLine } from '@/lib/mobile-line-data';
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

export default function AddMobileLinePage() {
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

  const form = useForm<MobileLineFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      carrier: "",
      planName: "",
      status: "Sin Asignar",
      simCardNumber: "",
      pukCode: "",
      activationDate: "",
      assignedToUserId: UNASSIGNED_USER_VALUE, // Default to unassigned using the special value
      notes: "",
    },
  });

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

    const lineDataForApi: Omit<MobileLine, 'id'> = {
      ...values,
      assignedToUserId: finalAssignedToUserId,
      assignedToUserName,
    };
    console.log("Mobile Line Form Submitted:", lineDataForApi);

    try {
      const newLine = await addMobileLine(lineDataForApi);
      toast({
        title: "Línea Móvil Añadida Correctamente",
        description: `La línea ${newLine.phoneNumber} (ID: ${newLine.id}) ha sido creada.`,
        variant: "default",
      });
      router.push('/mobile-lines');
    } catch (error) {
      console.error("Error adding mobile line:", error);
      toast({
        title: "Error al Añadir Línea Móvil",
        description: "Hubo un problema al guardar la línea. Inténtalo de nuevo.",
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
            <Smartphone className="w-6 h-6"/> Registrar Nueva Línea Móvil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="add-mobile-line-form">
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? UNASSIGNED_USER_VALUE}>
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
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="add-mobile-line-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando Línea...
              </>
            ) : (
              'Guardar Línea Móvil'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
