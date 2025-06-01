
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Trash2, User, CalendarDays, Package, Info, AlertTriangle, Loader2, Tag, ClipboardCheck, ListChecks } from "lucide-react";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Entrega, EntregaDetalleItem } from '@/types/entrega';
import { getEntregaById, deleteEntrega } from '@/lib/entrega-data';
import { Badge } from '@/components/ui/badge';

export default function EntregaDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const entregaId = params?.entregaId as string;

  const [entrega, setEntrega] = useState<Entrega | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEntregaData = useCallback(async () => {
    if (!entregaId) return;
    setIsLoading(true);
    const data = await getEntregaById(entregaId);
    if (data) {
      setEntrega(data);
    } else {
      toast({ title: "Error", description: "Entrega no encontrada.", variant: "destructive" });
      router.push('/entregas');
    }
    setIsLoading(false);
  }, [entregaId, router, toast]);

  useEffect(() => {
    fetchEntregaData();
  }, [fetchEntregaData]);

  const handleDeleteEntrega = async () => {
    if (!entrega) return;
    if (confirm(`¿Estás seguro de que quieres eliminar la entrega "${entrega.id}" para "${entrega.userName}"? Esta acción no se puede deshacer.`)) {
      setIsDeleting(true);
      const success = await deleteEntrega(entrega.id);
      if (success) {
        toast({
          title: "Entrega Eliminada",
          description: `La entrega ${entrega.id} ha sido eliminada.`,
          variant: "default"
        });
        router.push('/entregas');
      } else {
        toast({
          title: "Error al Eliminar",
          description: "No se pudo eliminar la entrega.",
          variant: "destructive"
        });
      }
      setIsDeleting(false);
    }
  };

  const getStatusVariant = (status?: Entrega['status']): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return "secondary";
    switch (status) {
      case 'Pendiente': return 'secondary';
      case 'En Proceso': return 'outline'; // Consider this as an active/primary state
      case 'Completada': return 'default'; // Success state
      case 'Cancelada': return 'destructive';
      default: return 'secondary';
    }
  };
  
  const getStatusIcon = (status?: Entrega['status']) => {
    if (!status) return <Info className="w-4 h-4" />;
    switch (status) {
      case 'Pendiente': return <ListChecks className="w-4 h-4 text-yellow-500" />;
      case 'En Proceso': return <ClipboardCheck className="w-4 h-4 text-blue-500" />;
      case 'Completada': return <Package className="w-4 h-4 text-green-500" />;
      case 'Cancelada': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando detalles de la entrega...</span>
      </div>
    );
  }

  if (!entrega) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-destructive">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-semibold mb-4">Entrega no Encontrada</h2>
        <p>La entrega solicitada no pudo ser cargada.</p>
        <Link href="/entregas" passHref className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Entregas
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <div className="mb-6">
        <Link href="/entregas" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Entregas
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <Tag className="w-6 h-6" /> Entrega: {entrega.id}
              </CardTitle>
              <CardDescription>Para: {entrega.userName} ({entrega.userId})</CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href={`/entregas/${entrega.id}/edit`} passHref>
                <Button variant="outline" size="icon" title="Editar Entrega" disabled={isDeleting}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar Entrega</span>
                </Button>
              </Link>
              <Button variant="destructive" size="icon" onClick={handleDeleteEntrega} title="Eliminar Entrega" disabled={isDeleting}>
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                <span className="sr-only">Eliminar Entrega</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Detalles de la Entrega</h3>
            <Separator className="mb-4"/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground"/><strong>Usuario:</strong> {entrega.userName} ({entrega.userId})</div>
              <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-muted-foreground"/><strong>Fecha Entrega:</strong> {new Date(entrega.deliveryDate).toLocaleDateString()}</div>
              <div className="flex items-center gap-2">{getStatusIcon(entrega.status)}<strong>Estado:</strong> <Badge variant={getStatusVariant(entrega.status)}>{entrega.status}</Badge></div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Artículos Entregados</h3>
            <Separator className="mb-4"/>
            {entrega.items.length > 0 ? (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Etiqueta Activo</TableHead>
                      <TableHead>Artículo</TableHead>
                      <TableHead className="text-center">Cantidad</TableHead>
                      <TableHead>N/S</TableHead>
                      <TableHead>Notas Artículo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entrega.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.inventoryItemId || 'N/A'}</TableCell>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell>{item.serialNumber || 'N/A'}</TableCell>
                        <TableCell className="whitespace-pre-wrap text-xs">{item.notes || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay artículos en esta entrega.</p>
            )}
          </div>
          
          {entrega.notes && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Notas Generales de la Entrega</h3>
              <Separator className="mb-4"/>
              <p className="text-sm text-muted-foreground italic whitespace-pre-wrap">
                {entrega.notes}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <p>ID de Entrega: {entrega.id}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
