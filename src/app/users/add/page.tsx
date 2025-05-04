
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

// Define the validation schema for the user form
const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  department: z.string().min(2, {
    message: "El departamento debe tener al menos 2 caracteres.",
  }),
  phone: z.string().optional(), // Phone is optional
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
    },
  });

  async function onSubmit(values: UserFormData) {
    setIsSubmitting(true);
    console.log("Form Submitted:", values);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate user ID generation (replace with actual logic)
    const generatedUserId = `USR-${Math.floor(100 + Math.random() * 900)}`;
    console.log("Generated User ID:", generatedUserId);

    setIsSubmitting(false);

    toast({
      title: "Usuario Añadido Correctamente",
      description: `El usuario ${values.name} (ID: ${generatedUserId}) ha sido creado.`,
      variant: "default",
    });

    // Redirect back to the users list page
    router.push('/users');
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
                      <Input type="tel" placeholder="e.g., 123-456-7890" {...field} />
                    </FormControl>
                    <FormDescription>
                      Introduce el número de teléfono si es necesario.
                    </FormDescription>
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
            {/* Trigger the form submission via onClick */}
            <Button type="button" form="add-user-form" disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)}>
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
```