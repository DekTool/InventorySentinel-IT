
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
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Loader2, UserPlus } from 'lucide-react';
import { addUser } from '@/lib/user-data';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  department: z.string().min(2, {
    message: "El departamento debe tener al menos 2 caracteres.",
  }),
  phone: z.string().optional().nullable(),
  joinDate: z.string().optional().nullable(), // Added joinDate
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
    },
  });

  async function onSubmit(values: UserFormData) {
    setIsSubmitting(true);
    console.log("Form Submitted:", values);

    try {
      const newUser = await addUser(values);
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
