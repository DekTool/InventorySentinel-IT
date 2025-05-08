
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
import { useRouter, useParams } from 'next/navigation'; // Removed notFound as redirect handles it
import { Loader2, ArrowLeft, Pencil } from 'lucide-react'; // Changed icon
import Link from 'next/link';

// Mock data fetching function (replace with actual data fetching)
async function getItemDetails(itemId: string) {
  console.log("Fetching details for edit:", itemId);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 50));

  const items = [
    { id: 'ASSET-001', name: 'Laptop Pro 15"', type: 'Portátil', status: 'Asignado', assignedTo: 'Alice Smith (asmith@example.com)', barcode: '123456789012', serialNumber: 'SN123XYZ', purchaseDate: '2023-01-15', warrantyEndDate: '2026-01-14', notes: 'Pequeño arañazo en la tapa.' },
    { id: 'ASSET-002', name: 'Ratón Inalámbrico X', type: 'Ratón', status: 'En Stock', assignedTo: null, barcode: '987654321098', serialNumber: 'SN456ABC', purchaseDate: '2023-05-20', warrantyEndDate: '2024-05-19', notes: '' },
    { id: 'ASSET-003', name: 'Docking Station Z', type: 'Docking Station', status: 'Asignado', assignedTo: 'Bob Johnson (bjohnson@example.com)', barcode: '112233445566', serialNumber: 'SNDEF789', purchaseDate: '2022-11-01', warrantyEndDate: '2024-10-31', notes: 'Requiere adaptador de corriente específico.' },
    { id: 'ASSET-004', name: 'Teléfono Móvil S23', type: 'Móvil', status: 'En Stock', assignedTo: null, barcode: '778899001122', serialNumber: 'SNMOB001', purchaseDate: '2024-02-10', warrantyEndDate: '2026-02-09', notes: 'Versión desbloqueada.' },
    { id: 'ASSET-005', name: 'Monitor 27" 4K', type: 'Monitor', status: 'Asignado', assignedTo: 'Alice Smith (asmith@example.com)', barcode: '334455667788', serialNumber: 'SNMON4K01', purchaseDate: '2023-08-05', warrantyEndDate: '2026-08-04', notes: 'Incluye cable HDMI.' },
  ];

  const item = items.find(i => i.id === itemId);
   // Format dates for input type="date"
   if (item?.purchaseDate) {
     item.purchaseDate = new Date(item.purchaseDate).toISOString().split('T')[0];
   }
   if (item?.warrantyEndDate) {
     item.warrantyEndDate = new Date(item.warrantyEndDate).toISOString().split('T')[0];
   }
  return item;
}


const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  type: z.string().min(1, { message: "Por favor, selecciona un tipo de equipo." }),
  serialNumber: z.string().optional(),
  barcode: z.string().min(5, { message: "El código de barras debe tener al menos 5 caracteres."}).max(50),
  purchaseDate: z.string().optional(),
  warrantyEndDate: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["En Stock", "Asignado", "Mantenimiento", "Retirado"]), // Adjusted status options
  // Add assignedTo field if editable here
});

type ItemFormData = z.infer<typeof formSchema>;

export default function EditInventoryItemPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const itemId = params?.itemId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [itemData, setItemData] = useState<ItemFormData | null>(null); // Keep original shape for title


  const form = useForm<ItemFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { // Set default values initially
      name: "",
      type: "",
      serialNumber: "",
      barcode: "",
      purchaseDate: "",
      warrantyEndDate: "",
      notes: "",
      status: "En Stock",
    },
  });

 useEffect(() => {
    if (!itemId) {
      router.push('/inventory'); // Redirect if no ID
      return;
    };

    const fetchData = async () => {
        setIsLoadingData(true);
        const data = await getItemDetails(itemId);
        if (data) {
            setItemData(data as unknown as ItemFormData); // Store fetched data for display (like title)
            // Reset form with fetched data, ensuring correct status type
            form.reset({
                name: data.name || "",
                type: data.type || "",
                serialNumber: data.serialNumber || "",
                barcode: data.barcode || "",
                purchaseDate: data.purchaseDate || "",
                warrantyEndDate: data.warrantyEndDate || "",
                notes: data.notes || "",
                // Ensure status matches one of the enum values or default
                status: ["En Stock", "Asignado", "Mantenimiento", "Retirado"].includes(data.status)
                         ? data.status as ItemFormData['status']
                         : "En Stock",
            });
        } else {
             // Handle item not found
             toast({ title: "Error", description: "Equipo no encontrado.", variant: "destructive" });
             router.push('/inventory'); // Redirect back
        }
         setIsLoadingData(false);
    };
     fetchData();
  }, [itemId, form, router, toast]);


  async function onSubmit(values: ItemFormData) {
    setIsSubmitting(true);
    console.log("Form Submitted for Update:", values);
    console.log("Updating item ID:", itemId);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    toast({
      title: "Equipo Actualizado Correctamente",
      description: `${values.name} (Etiqueta: ${itemId}) ha sido actualizado.`,
      variant: "default",
    });

    // Redirect back to the item's detail page
    router.push(`/inventory/${itemId}`);
  }

  if (isLoadingData) {
      return (
          <div className="flex justify-center items-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Cargando datos del equipo...</span>
          </div>
      );
  }

   if (!itemData) {
     // This state should ideally not be reached due to the redirect in useEffect
     return (
       <div className="flex justify-center items-center min-h-screen p-4 text-destructive">
         Equipo no encontrado o no se pudo cargar.
         <Link href="/inventory" className="ml-2 underline">Volver al inventario</Link>
       </div>
     );
   }


  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
             <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <Pencil className="w-6 h-6"/> Editar Equipo: {itemData?.name}
             </CardTitle>
              <Link href={`/inventory/${itemId}`} passHref>
                <Button variant="ghost" size="sm">
                   <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar Edición
                 </Button>
               </Link>
          </div>
           <p className="text-sm text-muted-foreground">Etiqueta de Activo: {itemId}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="edit-item-form"> {/* Added ID */}
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
                    <FormLabel>Estado</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona estado" />
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

              {/* Optional fields */}
               <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Compra (Opcional)</FormLabel>
                    <FormControl>
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
            </form>
          </Form>
        </CardContent>
         <CardFooter className="flex justify-end">
            <Link href={`/inventory/${itemId}`} passHref>
                 <Button type="button" variant="outline" disabled={isSubmitting} className="mr-2">
                    Cancelar
                 </Button>
            </Link>
            {/* Trigger submit via onClick */}
            <Button type="button" form="edit-item-form" disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)}>
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

