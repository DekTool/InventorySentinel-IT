"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, KeyRound, Loader2 } from "lucide-react";
import Link from 'next/link';
import type { License } from '@/types/license';
import { getAllLicenses } from '@/lib/license-data'; // Mock data fetching
import { Badge } from '@/components/ui/badge'; // Import Badge component

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLicenses = async () => {
      setIsLoading(true);
      const data = await getAllLicenses();
      setLicenses(data);
      setIsLoading(false);
    };
    fetchLicenses();
  }, []);

  const filteredLicenses = useMemo(() => {
    if (!searchTerm) return licenses;
    return licenses.filter(license =>
      license.softwareName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (license.assignedTo && license.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      license.licenseKey.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [licenses, searchTerm]);

  const getStatusVariant = (status: License['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Activa':
        return 'default'; // Usually green or primary
      case 'Expirada':
        return 'destructive';
      case 'Sin Asignar':
        return 'secondary'; // Neutral or gray
      case 'Archivada':
        return 'outline'; // More subdued
      default:
        return 'secondary';
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <KeyRound className="w-7 h-7" /> Gestión de Licencias
        </h1>
        <Link href="/licencias/add" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nueva Licencia
          </Button>
        </Link>
      </header>

      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Buscar por ID, Software, Asignado, Clave..."
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
          <span className="ml-2">Cargando licencias...</span>
        </div>
      ) : (
        <div className="flex-1 overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Licencia</TableHead>
                <TableHead>Software</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Puestos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Caducidad</TableHead>
                <TableHead>Asignado A</TableHead>
                <TableHead><span className="sr-only">Acciones</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLicenses.map((license) => (
                <TableRow key={license.id}>
                  <TableCell className="font-medium">{license.id}</TableCell>
                  <TableCell>{license.softwareName}</TableCell>
                  <TableCell>{license.licenseType}</TableCell>
                  <TableCell className="text-center">{license.seats}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(license.status)}>{license.status}</Badge>
                  </TableCell>
                  <TableCell>{license.expirationDate ? new Date(license.expirationDate).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{license.assignedTo || 'N/A'}</TableCell>
                  <TableCell>
                     <Link href={`/licencias/${license.id}`} passHref>
                       <Button variant="ghost" size="sm">Ver</Button>
                     </Link>
                  </TableCell>
                </TableRow>
              ))}
               {filteredLicenses.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No se encontraron licencias que coincidan con la búsqueda o no hay licencias registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
