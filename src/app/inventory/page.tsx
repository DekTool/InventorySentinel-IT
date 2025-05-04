
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search } from "lucide-react";
import Link from 'next/link';

// Mock data for demonstration
const inventoryItems = [
  { id: 'ASSET-001', name: 'Laptop Pro 15"', type: 'Laptop', status: 'Assigned', assignedTo: 'Alice Smith', barcode: '123456789012' },
  { id: 'ASSET-002', name: 'Wireless Mouse X', type: 'Mouse', status: 'In Stock', assignedTo: null, barcode: '987654321098' },
  { id: 'ASSET-003', name: 'Docking Station Z', type: 'Docking Station', status: 'Assigned', assignedTo: 'Bob Johnson', barcode: '112233445566' },
  { id: 'ASSET-004', name: 'Mobile Phone S23', type: 'Mobile Phone', status: 'In Stock', assignedTo: null, barcode: '778899001122' },
  { id: 'ASSET-005', name: 'Monitor 27" 4K', type: 'Monitor', status: 'Assigned', assignedTo: 'Alice Smith', barcode: '334455667788' },
];

export default function InventoryPage() {
  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Inventory Management</h1>
        <Link href="/inventory/add" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
          </Button>
        </Link>
      </header>

      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Search by Asset Tag, Name, Barcode..."
          className="max-w-sm"
        />
         <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
         </Button>
      </div>

      <div className="flex-1 overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Tag</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                   <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'Assigned' ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'}`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>{item.assignedTo || 'N/A'}</TableCell>
                <TableCell>{item.barcode}</TableCell>
                <TableCell>
                   <Link href={`/inventory/${item.id}`} passHref>
                     <Button variant="ghost" size="sm">View</Button>
                   </Link>
                </TableCell>
              </TableRow>
            ))}
             {inventoryItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No inventory items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
