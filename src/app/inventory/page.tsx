
"use client"; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useEffect, useState, useMemo } from "react";
import type { InventoryItem } from "@/types/inventory";
import { getAllInventoryItems } from "@/lib/inventory-data";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true); // Renamed for clarity
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser, isLoadingAuth } = useAuth(); // Get currentUser and loading state

  const userRole = currentUser?.role;

  useEffect(() => {
    if (isLoadingAuth) return; // Don't fetch data until auth state is resolved

    const fetchData = async () => {
      setIsLoadingData(true);
      let items = await getAllInventoryItems();
      
      // Filter for "En Stock" items only if the role is 'Usuario'
      // This logic is now conditional on userRole being defined
      if (userRole === 'Usuario') {
        items = items.filter(item => item.status === 'En Stock');
      }
      setInventoryItems(items);
      setIsLoadingData(false);
    };
    fetchData();
  }, [isLoadingAuth, userRole]); // Depend on auth loading state and userRole

  const filteredItems = useMemo(() => {
    let itemsToFilter = inventoryItems;
    
    // This check is mostly redundant if useEffect already filters, but good for clarity.
    if (userRole === 'Usuario') {
        itemsToFilter = inventoryItems.filter(item => item.status === 'En Stock');
    }

    if (!searchTerm.trim()) {
      return itemsToFilter;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return itemsToFilter.filter(item =>
      item.id.toLowerCase().includes(lowerSearchTerm) ||
      item.name.toLowerCase().includes(lowerSearchTerm) ||
      item.barcode.toLowerCase().includes(lowerSearchTerm) ||
      (item.assignedTo && item.assignedTo.toLowerCase().includes(lowerSearchTerm)) ||
      item.type.toLowerCase().includes(lowerSearchTerm) ||
      item.status.toLowerCase().includes(lowerSearchTerm) 
    );
  }, [inventoryItems, searchTerm, userRole]);


 if (isLoadingAuth || isLoadingData) { // Show loader if either auth or data is loading
    return (
      <div className="flex justify-center items-center flex-1 p-4 md:p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando inventario...</span>
      </div>
    );
  }

 return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Gestión de Inventario</h1>
        {userRole !== 'Usuario' && ( 
          <Link href="/inventory/add" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Equipo
            </Button>
          </Link>
        )}
      </header>

      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder={userRole === 'Usuario' ? "Buscar en equipos en stock..." : "Buscar por Etiqueta, Nombre, Código de Barras..."}
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
         <Button variant="outline" size="icon" onClick={() => setSearchTerm('')} disabled={!searchTerm}>
            <Search className="h-4 w-4" />
            <span className="sr-only">Buscar</span>
         </Button>
      </div>

      
        <div className="flex-1 overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Etiqueta Activo</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                {userRole !== 'Usuario' && <TableHead>Asignado A</TableHead>}
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
                  {userRole !== 'Usuario' && <TableCell>{item.assignedTo || 'N/A'}</TableCell>}
                  <TableCell>{item.barcode}</TableCell>
                  <TableCell>
                    <Link href={`/inventory/${item.id}`} passHref>
                      <Button variant="ghost" size="sm">Ver</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {filteredItems.length === 0 && !isLoadingData && (
                <TableRow>
                  <TableCell colSpan={userRole !== 'Usuario' ? 7 : 6} className="h-24 text-center">
                    {userRole === 'Usuario' 
                      ? "No se encontraron equipos en stock que coincidan con la búsqueda o no hay equipos en stock."
                      : "No se encontraron elementos en el inventario que coincidan con la búsqueda o no hay equipos registrados."
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      
    </div>
  );
}
