
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, ShoppingCart, Loader2 } from "lucide-react";
import Link from 'next/link';
import type { Order } from '@/types/order';
import { getAllOrders } from '@/lib/order-data';
import { Badge } from '@/components/ui/badge';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const data = await getAllOrders();
      setOrders(data);
      setIsLoading(false);
    };
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) {
      return orders;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return orders.filter(order =>
      order.id.toLowerCase().includes(lowerSearchTerm) ||
      order.supplier.toLowerCase().includes(lowerSearchTerm) ||
      order.status.toLowerCase().includes(lowerSearchTerm) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(lowerSearchTerm)) ||
      order.items.some(item => item.itemName.toLowerCase().includes(lowerSearchTerm))
    );
  }, [orders, searchTerm]);

  const getStatusVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Solicitado':
        return 'secondary';
      case 'Comprado':
        return 'outline';
      case 'En Tránsito':
        return 'default'; // Using primary for active states
      case 'Recibido':
        return 'default'; // Consider a success-like variant if available or create one
      case 'Cancelado':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <ShoppingCart className="w-7 h-7" /> Gestión de Pedidos
        </h1>
        <Link href="/pedidos/add" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Pedido
          </Button>
        </Link>
      </header>

      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Buscar por ID, Proveedor, Estado, Artículo..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline" size="icon" onClick={() => setSearchTerm('')} disabled={!searchTerm}>
          <Search className="h-4 w-4" />
          <span className="sr-only">Buscar</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center flex-1">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Cargando pedidos...</span>
        </div>
      ) : (
        <div className="flex-1 overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pedido</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Fecha Pedido</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Nº Artículos</TableHead>
                <TableHead>Llegada Estimada</TableHead>
                <TableHead><span className="sr-only">Acciones</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                  <TableCell>{order.expectedArrivalDate ? new Date(order.expectedArrivalDate).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Link href={`/pedidos/${order.id}`} passHref>
                      <Button variant="ghost" size="sm">Ver</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron pedidos que coincidan con la búsqueda o no hay pedidos registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
