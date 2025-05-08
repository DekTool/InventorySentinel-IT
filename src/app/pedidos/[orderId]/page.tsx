
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Trash2, ShoppingCart, CalendarDays, Truck, PackageCheck, Info, AlertTriangle, Loader2, Tag } from "lucide-react";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Order, OrderItem } from '@/types/order';
import { getOrderById, deleteOrder } from '@/lib/order-data';
import { Badge } from '@/components/ui/badge';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOrderData = useCallback(async () => {
    if (!orderId) return;
    setIsLoading(true);
    const data = await getOrderById(orderId);
    if (data) {
      setOrder(data);
    } else {
      toast({ title: "Error", description: "Pedido no encontrado.", variant: "destructive" });
      router.push('/pedidos');
    }
    setIsLoading(false);
  }, [orderId, router, toast]);

  useEffect(() => {
    fetchOrderData();
  }, [fetchOrderData]);

  const handleDeleteOrder = async () => {
    if (!order) return;
    if (confirm(`¿Estás seguro de que quieres eliminar el pedido "${order.id}" del proveedor "${order.supplier}"? Esta acción no se puede deshacer.`)) {
      setIsDeleting(true);
      const success = await deleteOrder(order.id);
      if (success) {
        toast({
          title: "Pedido Eliminado",
          description: `El pedido ${order.id} ha sido eliminado.`,
          variant: "default"
        });
        router.push('/pedidos');
      } else {
        toast({
          title: "Error al Eliminar",
          description: "No se pudo eliminar el pedido.",
          variant: "destructive"
        });
      }
      setIsDeleting(false);
    }
  };

  const getStatusVariant = (status?: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return "secondary";
    switch (status) {
      case 'Solicitado': return 'secondary';
      case 'Comprado': return 'outline';
      case 'En Tránsito': return 'default'; // Consider this as a primary/active state
      case 'Recibido': return 'default'; // Success state - using default for now
      case 'Cancelado': return 'destructive';
      default: return 'secondary';
    }
  };
  
  const getStatusIcon = (status?: Order['status']) => {
    if (!status) return <Info className="w-4 h-4" />;
    switch (status) {
      case 'Solicitado': return <Info className="w-4 h-4 text-muted-foreground" />;
      case 'Comprado': return <ShoppingCart className="w-4 h-4 text-blue-500" />;
      case 'En Tránsito': return <Truck className="w-4 h-4 text-orange-500" />;
      case 'Recibido': return <PackageCheck className="w-4 h-4 text-green-500" />;
      case 'Cancelado': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4" />;
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando detalles del pedido...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-destructive">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-semibold mb-4">Pedido no Encontrado</h2>
        <p>El pedido solicitado no pudo ser cargado.</p>
        <Link href="/pedidos" passHref className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Pedidos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <div className="mb-6">
        <Link href="/pedidos" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Pedidos
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <Tag className="w-6 h-6" /> Pedido: {order.id}
              </CardTitle>
              <CardDescription>Proveedor: {order.supplier}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href={`/pedidos/${order.id}/edit`} passHref>
                <Button variant="outline" size="icon" title="Editar Pedido" disabled={isDeleting}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar Pedido</span>
                </Button>
              </Link>
              <Button variant="destructive" size="icon" onClick={handleDeleteOrder} title="Eliminar Pedido" disabled={isDeleting}>
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                <span className="sr-only">Eliminar Pedido</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Detalles del Pedido</h3>
            <Separator className="mb-4"/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-muted-foreground"/><strong>Fecha Pedido:</strong> {new Date(order.orderDate).toLocaleDateString()}</div>
              <div className="flex items-center gap-2">{getStatusIcon(order.status)}<strong>Estado:</strong> <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge></div>
              <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-muted-foreground"/><strong>Llegada Estimada:</strong> {order.expectedArrivalDate ? new Date(order.expectedArrivalDate).toLocaleDateString() : 'N/A'}</div>
              <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-muted-foreground"/><strong>Llegada Real:</strong> {order.actualArrivalDate ? new Date(order.actualArrivalDate).toLocaleDateString() : 'N/A'}</div>
              <div className="flex items-center gap-2 md:col-span-2"><Truck className="w-4 h-4 text-muted-foreground"/><strong>Nº Seguimiento:</strong> {order.trackingNumber || 'N/A'}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Artículos del Pedido</h3>
            <Separator className="mb-4"/>
            {order.items.length > 0 ? (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Artículo</TableHead>
                      <TableHead className="text-center">Cantidad</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Características</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.itemName}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.model || 'N/A'}</TableCell>
                        <TableCell className="whitespace-pre-wrap text-xs">{item.characteristics || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay artículos en este pedido.</p>
            )}
          </div>
          
          {order.notes && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Notas Adicionales</h3>
              <Separator className="mb-4"/>
              <p className="text-sm text-muted-foreground italic whitespace-pre-wrap">
                {order.notes}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <p>ID de Pedido: {order.id}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
