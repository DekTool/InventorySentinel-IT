
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash2, User, Calendar, Tag, Barcode, Info, Printer, Loader2, AlertTriangle } from "lucide-react";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { InventoryItem } from '@/types/inventory';
import { getInventoryItemById, deleteInventoryItem } from '@/lib/inventory-data';

export default function InventoryItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const itemId = params?.itemId as string;

  const [item, setItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItemData = useCallback(async () => {
    if (!itemId) return;
    setIsLoading(true);
    const data = await getInventoryItemById(itemId);
    if (data) {
      setItem(data);
    } else {
      toast({ title: "Error", description: "Equipo no encontrado.", variant: "destructive"});
      router.push('/inventory');
    }
    setIsLoading(false);
  }, [itemId, router, toast]);

  useEffect(() => {
    fetchItemData();
  }, [fetchItemData]);

  const handlePrintTag = () => {
    if (!item) return;
    alert(`Imprimiendo Etiqueta de Activo para ${item.id}...\nCódigo Barras: ${item.barcode}\nNombre: ${item.name}`);
  };

  const handleDeleteItem = async () => {
    if (!item) return;
    if (confirm(`¿Estás seguro de que quieres eliminar el equipo "${item.name}" (ID: ${item.id})? Esta acción no se puede deshacer.`)) {
      setIsDeleting(true);
      const success = await deleteInventoryItem(item.id);
      if (success) {
        toast({
            title: "Equipo Eliminado",
            description: `${item.name} ha sido eliminado del inventario.`,
            variant: "default" 
        });
        router.push('/inventory');
      } else {
         toast({
            title: "Error al Eliminar",
            description: "No se pudo eliminar el equipo. Puede que ya no exista.",
            variant: "destructive"
        });
      }
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando detalles del equipo...</span>
      </div>
    );
  }

  if (!item) {
     return (
       <div className="flex flex-col items-center justify-center min-h-screen p-4 text-destructive">
         <AlertTriangle className="w-12 h-12 mb-4" />
         <h2 className="text-xl font-semibold mb-4">Equipo no Encontrado</h2>
         <p>El equipo de inventario solicitado no pudo ser cargado.</p>
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
                 <Button variant="outline" size="icon" onClick={handlePrintTag} title="Imprimir Etiqueta" disabled={isDeleting}>
                    <Printer className="h-4 w-4" />
                    <span className="sr-only">Imprimir Etiqueta</span>
                 </Button>
                 <Link href={`/inventory/${item.id}/edit`} passHref>
                    <Button variant="outline" size="icon" title="Editar Equipo" disabled={isDeleting}>
                        <Edit className="h-4 w-4" />
                         <span className="sr-only">Editar Equipo</span>
                    </Button>
                 </Link>
                 <Button variant="destructive" size="icon" onClick={handleDeleteItem} title="Eliminar Equipo" disabled={isDeleting}>
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
                            item.status === 'Mantenimiento' ? 'bg-blue-900 text-blue-300' :
                            item.status === 'Retirado' ? 'bg-red-900 text-red-300' :
                            'bg-gray-700 text-gray-300'
                         }`}>
                           {item.status}
                        </span>
                    </span>

                    <span className="font-medium text-muted-foreground flex items-center gap-1"><User className="w-4 h-4"/> Asignado A:</span>
                    <span className="col-span-2">{item.assignedTo || 'Sin Asignar'}</span>
                 </div>
                  <h3 className="font-semibold text-lg mt-4">Notas</h3>
                  <Separator />
                   <p className="text-sm text-muted-foreground italic whitespace-pre-wrap">
                     {item.notes || 'No hay notas.'}
                  </p>
            </div>
        </CardContent>
         <CardFooter className="text-xs text-muted-foreground">
            <p>ID de Equipo: {item.id}</p>
         </CardFooter>
      </Card>

      <Card className="w-full max-w-4xl mx-auto mt-6">
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><Info className="w-5 h-5"/> Historial del Equipo</CardTitle>
            <CardDescription>Registro de asignaciones, cambios de estado y mantenimiento.</CardDescription>
        </CardHeader>
         <CardContent>
            <p className="text-sm text-muted-foreground">Seguimiento del historial próximamente...</p>
         </CardContent>
      </Card>
    </div>
  );
}
