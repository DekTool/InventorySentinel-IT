
"use client"; // Add "use client" directive

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash2, User, Calendar, Tag, Barcode, Info, Printer, Loader2 } from "lucide-react";
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation'; // Import useParams & useRouter
import { useState, useEffect } from 'react'; // Import useState and useEffect
import { useToast } from "@/hooks/use-toast"; // Import useToast

// Mock data fetching function (replace with actual data fetching)
async function getItemDetails(itemId: string) {
  console.log("Fetching details for:", itemId);
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
  return item;
}

// Define Item type
type Item = {
  id: string;
  name: string;
  type: string;
  status: string;
  assignedTo: string | null;
  barcode: string;
  serialNumber: string | null;
  purchaseDate: string | null;
  warrantyEndDate: string | null;
  notes: string | null;
};

export default function InventoryItemDetailsPage() {
  const params = useParams();
  const router = useRouter(); // Add router
  const { toast } = useToast(); // Add toast
  const itemId = params?.itemId as string;
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!itemId) return;

    const fetchData = async () => {
      setIsLoading(true);
      const data = await getItemDetails(itemId);
      if (data) {
        setItem(data);
      } else {
        console.error("Item not found:", itemId);
        // Redirect or show error if item not found
        toast({ title: "Error", description: "Equipo no encontrado.", variant: "destructive"});
        router.push('/inventory');
      }
      setIsLoading(false);
    };

    fetchData();
  }, [itemId, router, toast]); // Add router and toast to dependency array


  const handlePrintTag = () => {
    if (!item) return;
    // In a real app, this would trigger a print dialog
    // potentially generating a specific layout for the asset tag.
    alert(`Imprimiendo Etiqueta de Activo para ${item.id}...\nCódigo Barras: ${item.barcode}\nNombre: ${item.name}`);
    // Consider using a dedicated print library or CSS for better control
    // window.print(); // Basic browser print - needs specific styling via @media print
  }

  const handleDeleteItem = () => {
    if (!item) return;
    // Placeholder for delete confirmation and action
    if (confirm(`¿Estás seguro de que quieres eliminar el equipo "${item.name}" (ID: ${item.id})? Esta acción no se puede deshacer.`)) {
        console.log("Deleting item:", item.id);
        // Simulate API call for deletion
        toast({
            title: "Equipo Eliminado (Simulado)",
            description: `${item.name} ha sido eliminado del inventario.`,
            variant: "destructive"
        });
        router.push('/inventory'); // Redirect after deletion
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // The item not found case is handled in useEffect by redirecting

  if (!item) {
     // This state should ideally not be reached due to the redirect in useEffect,
     // but keep it as a fallback safeguard.
     return (
       <div className="flex flex-col items-center justify-center min-h-screen p-4 text-destructive">
         <h2 className="text-xl font-semibold mb-4">Equipo no encontrado</h2>
         <p>El equipo de inventario solicitado no se pudo cargar.</p>
         <Link href="/inventory" passHref className="mt-4">
             <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inventario
             </Button>
        </Link>
       </div>
     );
  }


  return (
    <div className="flex flex-col h-full p-4 md:p-8">
       <div className="mb-6">
         <Link href="/inventory" passHref>
             <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inventario
             </Button>
        </Link>
       </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start gap-4 flex-wrap">
             <div>
                <CardTitle className="text-2xl text-primary flex items-center gap-2">
                    <Tag className="w-6 h-6"/> {item.id}
                 </CardTitle>
                <CardDescription>{item.name} - {item.type}</CardDescription>
             </div>
             <div className="flex gap-2">
                 {/* onClick is now allowed because this is a Client Component */}
                 <Button variant="outline" size="icon" onClick={handlePrintTag} title="Imprimir Etiqueta">
                    <Printer className="h-4 w-4" />
                    <span className="sr-only">Imprimir Etiqueta</span>
                 </Button>
                 <Link href={`/inventory/${item.id}/edit`} passHref>
                    <Button variant="outline" size="icon" title="Editar Equipo">
                        <Edit className="h-4 w-4" />
                         <span className="sr-only">Editar Equipo</span>
                    </Button>
                 </Link>
                 {/* Enable Delete button */}
                 <Button variant="destructive" size="icon" onClick={handleDeleteItem} title="Eliminar Equipo">
                    <Trash2 className="h-4 w-4" />
                     <span className="sr-only">Eliminar Equipo</span>
                 </Button>
             </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
                 <h3 className="font-semibold text-lg">Detalles</h3>
                 <Separator />
                 <div className="grid grid-cols-3 gap-3 text-sm">
                    <span className="font-medium text-muted-foreground flex items-center gap-1"><Barcode className="w-4 h-4"/> Código Barras:</span>
                    <span className="col-span-2">{item.barcode}</span>

                    <span className="font-medium text-muted-foreground">N/S:</span>
                    <span className="col-span-2">{item.serialNumber || 'N/A'}</span>

                    <span className="font-medium text-muted-foreground flex items-center gap-1"><Calendar className="w-4 h-4"/> Fecha Compra:</span>
                    <span className="col-span-2">{item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}</span>

                    <span className="font-medium text-muted-foreground flex items-center gap-1"><Calendar className="w-4 h-4"/> Fin Garantía:</span>
                    <span className="col-span-2">{item.warrantyEndDate ? new Date(item.warrantyEndDate).toLocaleDateString() : 'N/A'}</span>
                 </div>
            </div>
             <div className="space-y-4">
                 <h3 className="font-semibold text-lg">Asignación y Estado</h3>
                 <Separator />
                 <div className="grid grid-cols-3 gap-3 text-sm">
                     <span className="font-medium text-muted-foreground">Estado:</span>
                     <span className="col-span-2">
                         <span className={`px-2 py-0.5 rounded-full text-xs ${
                            item.status === 'Asignado' ? 'bg-yellow-900 text-yellow-300' :
                            item.status === 'En Stock' ? 'bg-green-900 text-green-300' :
                            'bg-gray-700 text-gray-300' // Default/Other statuses
                         }`}>
                           {item.status}
                        </span>
                    </span>

                    <span className="font-medium text-muted-foreground flex items-center gap-1"><User className="w-4 h-4"/> Asignado A:</span>
                    <span className="col-span-2">{item.assignedTo || 'Sin Asignar'}</span>

                    {/* Add Assignment Date, Location if needed */}
                 </div>
                  <h3 className="font-semibold text-lg mt-4">Notas</h3>
                  <Separator />
                   <p className="text-sm text-muted-foreground italic">
                     {item.notes || 'No hay notas.'}
                  </p>
            </div>

        </CardContent>
         <CardFooter>
             {/* Add action buttons if needed, e.g., Assign, Check In/Out */}
             {item.status === 'En Stock' && <Button variant="accent" disabled>Asignar Equipo</Button>} {/* Disable for now */}
             {item.status === 'Asignado' && <Button variant="secondary" disabled>Registrar Devolución</Button>} {/* Disable for now */}
         </CardFooter>
      </Card>

       {/* Placeholder for History Section */}
      <Card className="w-full max-w-4xl mx-auto mt-6">
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><Info className="w-5 h-5"/> Historial del Equipo</CardTitle>
            <CardDescription>Registro de asignaciones, cambios de estado y mantenimiento.</CardDescription>
        </CardHeader>
         <CardContent>
            <p className="text-sm text-muted-foreground">Seguimiento del historial próximamente...</p>
            {/* Display history log here */}
         </CardContent>
      </Card>
    </div>
  );
}



```