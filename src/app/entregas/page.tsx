
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, ClipboardCheck, Loader2 } from "lucide-react";
import Link from 'next/link';
import type { Entrega } from '@/types/entrega';
import { getAllEntregas } from '@/lib/entrega-data';
import { Badge } from '@/components/ui/badge';

export default function EntregasPage() {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEntregas = async () => {
      setIsLoading(true);
      const data = await getAllEntregas();
      setEntregas(data);
      setIsLoading(false);
    };
    fetchEntregas();
  }, []);

  const filteredEntregas = useMemo(() => {
    if (!searchTerm.trim()) {
      return entregas;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return entregas.filter(entrega =>
      entrega.id.toLowerCase().includes(lowerSearchTerm) ||
      entrega.userName.toLowerCase().includes(lowerSearchTerm) ||
      entrega.status.toLowerCase().includes(lowerSearchTerm) ||
      entrega.items.some(item => item.itemName.toLowerCase().includes(lowerSearchTerm))
    );
  }, [entregas, searchTerm]);

  const getStatusVariant = (status: Entrega['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Pendiente':
        return 'secondary';
      case 'En Proceso':
        return 'outline';
      case 'Completada':
        return 'default';
      case 'Cancelada':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <ClipboardCheck className="w-7 h-7" /> Gestión de Entregas
        </h1>
        <Link href="/entregas/add" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Nueva Entrega
          </Button>
        </Link>
      </header>

      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Buscar por ID, Usuario, Estado, Artículo..."
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
          <span className="ml-2">Cargando entregas...</span>
        </div>
      ) : (
        <div className="flex-1 overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Entrega</TableHead>
                <TableHead>Usuario Receptor</TableHead>
                <TableHead>Fecha Entrega</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Nº Artículos</TableHead>
                <TableHead><span className="sr-only">Acciones</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntregas.map((entrega) => (
                <TableRow key={entrega.id}>
                  <TableCell className="font-medium">{entrega.id}</TableCell>
                  <TableCell>{entrega.userName} ({entrega.userId})</TableCell>
                  <TableCell>{new Date(entrega.deliveryDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(entrega.status)}>{entrega.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center">{entrega.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                  <TableCell>
                    <Link href={`/entregas/${entrega.id}`} passHref>
                      <Button variant="ghost" size="sm">Ver</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEntregas.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron entregas que coincidan con la búsqueda o no hay entregas registradas.
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
