
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search } from "lucide-react";
import Link from 'next/link';

// Mock data for demonstration
const inventoryItems = [
  { id: 'ASSET-001', name: 'Laptop Pro 15"', type: 'Portátil', status: 'Asignado', assignedTo: 'Alice Smith', barcode: '123456789012' },
  { id: 'ASSET-002', name: 'Ratón Inalámbrico X', type: 'Ratón', status: 'En Stock', assignedTo: null, barcode: '987654321098' },
  { id: 'ASSET-003', name: 'Docking Station Z', type: 'Docking Station', status: 'Asignado', assignedTo: 'Bob Johnson', barcode: '112233445566' },
  { id: 'ASSET-004', name: 'Teléfono Móvil S23', type: 'Móvil', status: 'En Stock', assignedTo: null, barcode: '778899001122' },
  { id: 'ASSET-005', name: 'Monitor 27" 4K', type: 'Monitor', status: 'Asignado', assignedTo: 'Alice Smith', barcode: '334455667788' },
];

// Make component async to potentially fetch data later
export default async function InventoryPage() {
 // TODO: Fetch real data here later
 // const items = await fetchInventoryItems();

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
        />
         <Button variant="outline" size="icon">
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
              <TableHead>Asignado A</TableHead>
              <TableHead>Código Barras</TableHead>
              <TableHead><span className="sr-only">Acciones</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                   <span className={`px-2 py-1 rounded-full text-xs ${
                     item.status === 'Asignado' ? 'bg-yellow-900 text-yellow-300' :
                     item.status === 'En Stock' ? 'bg-green-900 text-green-300' :
                     'bg-gray-700 text-gray-300' // Default/Other statuses
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
             {inventoryItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No se encontraron elementos en el inventario.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

```