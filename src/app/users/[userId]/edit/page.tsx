
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
import { getUserById, updateUser } from '@/lib/user-data';
import type { User, UserRole } from '@/types/user';
import { userRoles } from '@/lib/user-data';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  department: z.string().min(2, {
    message: "El departamento debe tener al menos 2 caracteres.",
  }),
  phone: z.string().optional().nullable(),
  joinDate: z.string().optional().nullable(),
  role: z.enum(userRoles as [UserRole, ...UserRole[]], {
    errorMap: () => ({ message: "Por favor, selecciona un rol válido." })
  }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres."}).optional().or(z.literal('')), // Optional: for changing password
});

type UserFormData = z.infer<typeof formSchema>;

export default function EditUserPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [originalUserName, setOriginalUserName] = useState<string | null>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        role: "Usuario", // Default role
        password: "", // Password field is empty by default for editing
    },
  });

  const fetchUserData = useCallback(async () => {
    if (!userId) {
      router.push('/users');
      return;
    }
    setIsLoadingData(true);
    const data = await getUserById(userId);
    if (data) {
      setOriginalUserName(data.name);
      form.reset({
        ...data,
        joinDate: data.joinDate ? new Date(data.joinDate).toISOString().split('T')[0] : "",
        password: "", // Keep password blank on load for editing
      });
    } else {
      toast({ title: "Error", description: "Usuario no encontrado.", variant: "destructive" });
      router.push('/users');
    }
    setIsLoadingData(false);
  }, [userId, form, router, toast]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  async function onSubmit(values: UserFormData) {
    setIsSubmitting(true);
    
    const updatePayload: Partial<User> = { ...values };
    if (!values.password) {
      delete updatePayload.password; // Don't send empty password if not changed
    }
    // In a real app, if password is provided, hash it here before sending.

    console.log("Form Submitted for User Update:", updatePayload);


    try {
      const updatedUser = await updateUser(userId, updatePayload);
      if (updatedUser) {
        toast({
          title: "Usuario Actualizado Correctamente",
          description: `El usuario ${updatedUser.name} (ID: ${userId}) ha sido actualizado.`,
          variant: "default",
        });
        router.push(`/users/${userId}`);
      } else {
        toast({ title: "Error", description: "No se pudo actualizar el usuario.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
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
        <span className="ml-2">Cargando datos del usuario...</span>
      </div>
    );
  }

  if (!originalUserName) {
     return (
       <div className="flex justify-center items-center min-h-screen p-4 text-destructive">
         Usuario no encontrado o no se pudo cargar.
         <Link href="/users" className="ml-2 underline">Volver a Usuarios</Link>
       </div>
     );
   }

  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
             <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <Pencil className="w-6 h-6"/> Editar Usuario: {originalUserName}
             </CardTitle>
              <Link href={`/users/${userId}`} passHref>
                <Button variant="ghost" size="sm">
                   <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar Edición
                 </Button>
               </Link>
          </div>
           <p className="text-sm text-muted-foreground">ID de Usuario: {userId}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="edit-user-form">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Corporativo</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="e.g., jperez@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva Contraseña (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Dejar en blanco para no cambiar" {...field} />
                    </FormControl>
                    <FormDescription>
                      Si se proporciona, la contraseña se actualizará (mínimo 8 caracteres).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Ingeniería, Marketing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userRoles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Teléfono (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="e.g., 123-456-7890" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Incorporación (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
         <CardFooter className="flex justify-end">
            <Link href={`/users/${userId}`} passHref>
                 <Button type="button" variant="outline" disabled={isSubmitting} className="mr-2">
                    Cancelar
                 </Button>
            </Link>
            <Button type="submit" form="edit-user-form" disabled={isSubmitting}>
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
