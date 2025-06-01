
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, Smartphone, Loader2 } from "lucide-react";
import Link from 'next/link';
import type { MobileLine } from '@/types/mobile-line';
import { getAllMobileLines } from '@/lib/mobile-line-data';
import { Badge } from '@/components/ui/badge';

export default function MobileLinesPage() {
  const [mobileLines, setMobileLines] = useState<MobileLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMobileLines = async () => {
      setIsLoading(true);
      const data = await getAllMobileLines();
      setMobileLines(data);
      setIsLoading(false);
    };
    fetchMobileLines();
  }, []);

  const filteredMobileLines = useMemo(() => {
    if (!searchTerm.trim()) {
      return mobileLines;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return mobileLines.filter(line =>
      line.id.toLowerCase().includes(lowerSearchTerm) ||
      line.phoneNumber.toLowerCase().includes(lowerSearchTerm) ||
      line.carrier.toLowerCase().includes(lowerSearchTerm) ||
      line.status.toLowerCase().includes(lowerSearchTerm) ||
      (line.assignedToUserName && line.assignedToUserName.toLowerCase().includes(lowerSearchTerm)) ||
      (line.simCardNumber && line.simCardNumber.toLowerCase().includes(lowerSearchTerm))
    );
  }, [mobileLines, searchTerm]);

  const getStatusVariant = (status: MobileLine['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Activa':
        return 'default';
      case 'Suspendida':
        return 'secondary';
      case 'Cancelada':
        return 'destructive';
      case 'Sin Asignar':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <Smartphone className="w-7 h-7" /> Gestión de Líneas Móviles
        </h1>
        <Link href="/mobile-lines/add" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nueva Línea
          </Button>
        </Link>
      </header>

      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Buscar por ID, Número, Operador, Usuario..."
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
          <span className="ml-2">Cargando líneas móviles...</span>
        </div>
      ) : (
        <div className="flex-1 overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Línea</TableHead>
                <TableHead>Número Teléfono</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Asignado A</TableHead>
                <TableHead>Nº SIM</TableHead>
                <TableHead><span className="sr-only">Acciones</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMobileLines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="font-medium">{line.id}</TableCell>
                  <TableCell>{line.phoneNumber}</TableCell>
                  <TableCell>{line.carrier}</TableCell>
                  <TableCell>{line.planName}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(line.status)}>{line.status}</Badge>
                  </TableCell>
                  <TableCell>{line.assignedToUserName || 'N/A'}</TableCell>
                  <TableCell>{line.simCardNumber || 'N/A'}</TableCell>
                  <TableCell>
                    <Link href={`/mobile-lines/${line.id}`} passHref>
                      <Button variant="ghost" size="sm">Ver</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {filteredMobileLines.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No se encontraron líneas móviles que coincidan con la búsqueda o no hay líneas registradas.
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
