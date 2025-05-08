
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
import { Loader2, PackagePlus } from 'lucide-react'; // Changed icon

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  type: z.string().min(1, { message: "Por favor, selecciona un tipo de equipo." }),
  serialNumber: z.string().optional(),
  barcode: z.string().min(5, { message: "El código de barras debe tener al menos 5 caracteres."}).max(50),
  purchaseDate: z.string().optional(), // Consider using a date picker component later
  warrantyEndDate: z.string().optional(), // Consider using a date picker component later
  notes: z.string().optional(),
  status: z.enum(["En Stock", "Asignado", "Mantenimiento", "Retirado"]), // Adjusted status options in Spanish
});

export default function AddInventoryItemPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      serialNumber: "",
      barcode: "", // Maybe generate this later?
      purchaseDate: "",
      warrantyEndDate: "",
      notes: "",
      status: "En Stock", // Default status in Spanish
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log("Form Submitted:", values);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate asset tag generation (replace with actual logic)
    const generatedAssetTag = `ACTIVO-${Math.floor(1000 + Math.random() * 9000)}`;
    console.log("Generated Asset Tag:", generatedAssetTag);

    setIsSubmitting(false);

    toast({
      title: "Equipo Añadido Correctamente",
      description: `Etiqueta de Activo ${generatedAssetTag} creada para ${values.name}.`,
      variant: "default", // Use 'default' which maps to green in our theme
    });

    // Redirect to inventory page or the new item's detail page
    router.push('/inventory');
    // router.push(`/inventory/${generatedAssetTag}`); // Option to redirect to detail page
  }

  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <PackagePlus className="w-6 h-6"/> Añadir Nuevo Equipo al Inventario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="add-item-form"> {/* Added ID */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Equipo</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Laptop Pro 15, Ratón Inalámbrico X" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

             <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Equipo</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo de equipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Portátil">Portátil</SelectItem>
                          <SelectItem value="Sobremesa">Sobremesa</SelectItem>
                          <SelectItem value="Monitor">Monitor</SelectItem>
                          <SelectItem value="Móvil">Móvil</SelectItem>
                          <SelectItem value="Tablet">Tablet</SelectItem>
                          <SelectItem value="Teclado">Teclado</SelectItem>
                          <SelectItem value="Ratón">Ratón</SelectItem>
                          <SelectItem value="Docking Station">Docking Station</SelectItem>
                          <SelectItem value="Impresora">Impresora</SelectItem>
                          <SelectItem value="Servidor">Servidor</SelectItem>
                          <SelectItem value="Redes">Redes</SelectItem>
                           <SelectItem value="Almacenamiento">Almacenamiento</SelectItem>
                           <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Barras / Identificador</FormLabel>
                    <FormControl>
                      <Input placeholder="Escanea o introduce el código de barras" {...field} />
                    </FormControl>
                     <FormDescription>
                      Se usará para escanear. Se generará una Etiqueta de Activo al guardar.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Serie (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Introduce el número de serie" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado Inicial</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona estado inicial" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="En Stock">En Stock</SelectItem>
                          <SelectItem value="Asignado">Asignado</SelectItem>
                           <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                           <SelectItem value="Retirado">Retirado</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Add optional fields like Purchase Date, Warranty End Date */}
               <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Compra (Opcional)</FormLabel>
                    <FormControl>
                       {/* Basic input for now, replace with Calendar later if needed */}
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="warrantyEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fin de Garantía (Opcional)</FormLabel>
                    <FormControl>
                       {/* Basic input for now, replace with Calendar later if needed */}
                      <Input type="date" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Textarea
                        placeholder="Cualquier detalle adicional sobre el equipo..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Placeholder for file upload if needed later
              <FormItem>
                <FormLabel>Upload Document/Image (Optional)</FormLabel>
                <FormControl>
                  <Button variant="outline" type="button" className="w-full justify-start">
                     <Upload className="mr-2 h-4 w-4" /> Upload File
                  </Button>
                </FormControl>
                 <FormDescription>
                    Upload receipts, assignment forms, etc.
                 </FormDescription>
              </FormItem>
              */}

            </form>
          </Form>
        </CardContent>
         <CardFooter className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting} className="mr-2">
                Cancelar
            </Button>
            {/* Trigger submit via onClick */}
            <Button type="button" form="add-item-form" disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Equipo y Generar Etiqueta'
              )}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
