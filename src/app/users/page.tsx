"use client"; // Move "use client" to the top

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Search, Package, Upload } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast"; // Import useToast

// Mock data for demonstration
const users = [
  { id: 'USR-001', name: 'Alice Smith', email: 'asmith@example.com', department: 'Engineering', assignedItems: 2 },
  { id: 'USR-002', name: 'Bob Johnson', email: 'bjohnson@example.com', department: 'Marketing', assignedItems: 1 },
  { id: 'USR-003', name: 'Charlie Brown', email: 'cbrown@example.com', department: 'Sales', assignedItems: 0 },
  { id: 'USR-004', name: 'Diana Prince', email: 'dprince@example.com', department: 'HR', assignedItems: 1 },
  { id: 'USR-005', name: 'Ethan Hunt', email: 'ehunt@example.com', department: 'IT', assignedItems: 5 },
];

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length === 1) return names[0]?.[0]?.toUpperCase() ?? '';
  if (names.length > 1) return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  return '';
}

export default function UsersPage() {
  const { toast } = useToast(); // Initialize toast

  const handleBulkUploadClick = () => {
    // Placeholder function for bulk upload
    toast({
        title: "Función no implementada",
        description: "La carga masiva de usuarios estará disponible pronto.",
        variant: "default" // Using "default" which is often styled as success/info
    });
    // In a real app, this might open a modal or navigate to an upload page
    // For example, trigger a file input click:
    // document.getElementById('bulk-user-upload-input')?.click();
  };


  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Gestión de Usuarios</h1>
        <div className="flex gap-2 flex-wrap">
            <Link href="/users/add" passHref>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Usuario
                </Button>
            </Link>
            <Button variant="outline" onClick={handleBulkUploadClick}>
                <Upload className="mr-2 h-4 w-4" /> Carga Masiva de Usuarios
            </Button>
        </div>
      </header>
      {/* Hidden file input for bulk upload, if needed for a more elaborate implementation later
      <input type="file" id="bulk-user-upload-input" className="hidden" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
      */}

      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Buscar por Nombre, Email, Departamento..."
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
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Equipos Asignados</TableHead>
              <TableHead><span className="sr-only">Acciones</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                 <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                         {/* Placeholder image, replace with actual user images if available */}
                        <AvatarImage src={`https://i.pravatar.cc/40?u=${user.email}`} alt={user.name} data-ai-hint="people avatar"/>
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                 <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Package className="w-4 h-4"/>
                        {user.assignedItems}
                    </div>
                </TableCell>
                <TableCell>
                   <Link href={`/users/${user.id}`} passHref>
                     <Button variant="ghost" size="sm">Ver Detalles</Button>
                   </Link>
                </TableCell>
              </TableRow>
            ))}
             {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No se encontraron usuarios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
