
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
import { Loader2, UserPlus } from 'lucide-react';
import { addUser } from '@/lib/user-data';
import type { UserRole } from '@/types/user';
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
  role: z.enum(userRoles as [UserRole, ...UserRole[]], { // Ensure Zod enum gets a non-empty array
    errorMap: () => ({ message: "Por favor, selecciona un rol válido." })
  }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres."}).optional().or(z.literal('')), // Optional for initial setup, or make it required
});

type UserFormData = z.infer<typeof formSchema>;

export default function AddUserPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      phone: "",
      joinDate: "",
      role: "Usuario",
      password: "",
    },
  });

  async function onSubmit(values: UserFormData) {
    setIsSubmitting(true);
    console.log("Form Submitted:", values);

    // In a real app, hash the password here before sending to the server
    // For this mock, we're sending it as is (NOT SECURE)

    try {
      const newUser = await addUser(values); // addUser needs to accept role and password
      toast({
        title: "Usuario Añadido Correctamente",
        description: `El usuario ${newUser.name} (ID: ${newUser.id}) ha sido creado.`,
        variant: "default",
      });
      router.push('/users');
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error al Añadir Usuario",
        description: "Hubo un problema al guardar el usuario. Inténtalo de nuevo.",
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
            <UserPlus className="w-6 h-6"/> Añadir Nuevo Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="add-user-form">
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
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Introduce una contraseña" {...field} />
                    </FormControl>
                    <FormDescription>
                      Mínimo 8 caracteres. En una aplicación real, esta contraseña se almacenaría de forma segura.
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting} className="mr-2">
                Cancelar
            </Button>
            <Button type="submit" form="add-user-form" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Usuario'
              )}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
