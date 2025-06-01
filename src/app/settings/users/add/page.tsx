
"use client";

import { useState } from 'react';
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
// Select components are no longer needed for role here
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Loader2, UserPlus, ArrowLeft } from 'lucide-react';
import { addUser } from '@/lib/user-data';
import type { UserRole } from '@/types/user';
// userRoles is no longer needed here
import Link from 'next/link';

const basicFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
  // Role field removed from schema
});

type BasicUserFormData = z.infer<typeof basicFormSchema>;

export default function AddBasicUserPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BasicUserFormData>({
    resolver: zodResolver(basicFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      // Role field removed from default values
    },
  });

  async function onSubmit(values: BasicUserFormData) {
    setIsSubmitting(true);
    console.log("Basic User Form Submitted:", values);

    try {
      const newUserPayload = {
        ...values, // name, email, password
        role: "Usuario" as UserRole, // Assign default role
        department: "General", // Assign default department
        // Ensure other non-provided fields are handled as per User type (optional or default in addUser)
        // For example, other detailed fields will be undefined here and handled by addUser.
      };
      // @ts-ignore - This might be needed if newUserPayload doesn't perfectly match User type, 
      // but addUser should handle defaults for many optional fields.
      const newUser = await addUser(newUserPayload); 
      toast({
        title: "Usuario Básico Añadido",
        description: `El usuario ${newUser.name} (ID: ${newUser.id}) ha sido creado con rol ${newUser.role}.`,
        variant: "default",
      });
      router.push('/settings'); // Navigate back to settings page after adding
    } catch (error) {
      console.error("Error adding basic user:", error);
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
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <UserPlus className="w-6 h-6"/> Añadir Nuevo Usuario (Básico)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="add-basic-user-form">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre y Apellidos</FormLabel>
                    <FormControl><Input placeholder="e.g., Ana Torres" {...field} /></FormControl>
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
                    <FormControl><Input type="email" placeholder="e.g., atorres@ejemplo.com" {...field} /></FormControl>
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
                    <FormControl><Input type="password" placeholder="Introduce la contraseña" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Role FormField removed */}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/settings" passHref>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar
            </Button>
          </Link>
          <Button type="submit" form="add-basic-user-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
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
