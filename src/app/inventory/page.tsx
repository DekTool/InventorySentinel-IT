
"use client"; // Keep as client component for search/filter interactivity later

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useEffect, useState, useMemo } from "react";
import type { InventoryItem } from "@/types/inventory";
import { getAllInventoryItems } from "@/lib/inventory-data";

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const items = await getAllInventoryItems();
      setInventoryItems(items);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return inventoryItems;
    }
    return inventoryItems.filter(item =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.assignedTo && item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventoryItems, searchTerm]);


 return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Gestión de Inventario</h1>
        <Link href="/inventory/add" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Equipo
          </Button>
        </Link>
      </header>

      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Buscar por Etiqueta, Nombre, Código de Barras..."
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
          <span className="ml-2">Cargando inventario...</span>
        </div>
      ) : (
        <div className="flex-1 overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Etiqueta Activo</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Asignado A</TableHead>
                <TableHead>Código Barras</TableHead>
                <TableHead><span className="sr-only">Acciones</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'Asignado' ? 'bg-yellow-900 text-yellow-300' :
                      item.status === 'En Stock' ? 'bg-green-900 text-green-300' :
                      item.status === 'Mantenimiento' ? 'bg-blue-900 text-blue-300' :
                      item.status === 'Retirado' ? 'bg-red-900 text-red-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{item.assignedTo || 'N/A'}</TableCell>
                  <TableCell>{item.barcode}</TableCell>
                  <TableCell>
                    <Link href={`/inventory/${item.id}`} passHref>
                      <Button variant="ghost" size="sm">Ver</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {filteredItems.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron elementos en el inventario que coincidan con la búsqueda o no hay equipos registrados.
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
