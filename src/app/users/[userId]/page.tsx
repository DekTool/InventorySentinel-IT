"use client"; // Make this a client component to use hooks/event handlers

import * as React from "react"; // Import React for useCallback
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Mail, Building, Package, Download, AlertTriangle, Loader2, UserX, Phone } from "lucide-react"; // Added Phone, UserX, Loader2
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation'; // Import useRouter
import { useState, useEffect, useCallback } from "react"; // Import useState, useEffect, useCallback
import { useToast } from "@/hooks/use-toast"; // Import useToast


// Mock data fetching functions (replace with actual data fetching)
async function getUserDetails(userId: string) {
  console.log("Fetching user details for:", userId);
  await new Promise(resolve => setTimeout(resolve, 100)); // Increased delay slightly
  const users = [
    { id: 'USR-001', name: 'Alice Smith', email: 'asmith@example.com', department: 'Ingeniería', phone: '123-456-7890', joinDate: '2022-03-01' },
    { id: 'USR-002', name: 'Bob Johnson', email: 'bjohnson@example.com', department: 'Marketing', phone: '987-654-3210', joinDate: '2021-08-15' },
    { id: 'USR-003', name: 'Charlie Brown', email: 'cbrown@example.com', department: 'Ventas', phone: '555-123-4567', joinDate: '2023-01-10' },
    { id: 'USR-004', name: 'Diana Prince', email: 'dprince@example.com', department: 'RRHH', phone: '111-222-3333', joinDate: '2020-05-20' },
    { id: 'USR-005', name: 'Ethan Hunt', email: 'ehunt@example.com', department: 'IT', phone: '777-888-9999', joinDate: '2019-11-11' },
  ];
  return users.find(u => u.id === userId);
}

async function getUserAssignedItems(userId: string) {
   console.log("Fetching assigned items for:", userId);
   await new Promise(resolve => setTimeout(resolve, 150)); // Increased delay slightly
   const allItems = [
     { id: 'ASSET-001', name: 'Laptop Pro 15"', type: 'Portátil', status: 'Asignado', assignedToId: 'USR-001', barcode: '123456789012', assignmentDate: '2023-01-20' },
     { id: 'ASSET-003', name: 'Docking Station Z', type: 'Docking Station', status: 'Asignado', assignedToId: 'USR-002', barcode: '112233445566', assignmentDate: '2022-11-05' },
     { id: 'ASSET-005', name: 'Monitor 27" 4K', type: 'Monitor', status: 'Asignado', assignedToId: 'USR-001', barcode: '334455667788', assignmentDate: '2023-08-10' },
     { id: 'ASSET-006', name: 'Keyboard K1', type: 'Teclado', status: 'Asignado', assignedToId: 'USR-004', barcode: 'KB001', assignmentDate: '2021-06-01' },
     { id: 'ASSET-007', name: 'Dev Laptop X', type: 'Portátil', status: 'Asignado', assignedToId: 'USR-005', barcode: 'DEVLP01', assignmentDate: '2020-01-15' },
     { id: 'ASSET-008', name: 'Server Rack R1', type: 'Servidor', status: 'Asignado', assignedToId: 'USR-005', barcode: 'SRVR01', assignmentDate: '2020-01-15' },
     { id: 'ASSET-009', name: 'Network Switch S1', type: 'Redes', status: 'Asignado', assignedToId: 'USR-005', barcode: 'NETSW01', assignmentDate: '2020-01-15' },
     { id: 'ASSET-010', name: 'Firewall F1', type: 'Redes', status: 'Asignado', assignedToId: 'USR-005', barcode: 'FIREW01', assignmentDate: '2020-01-15' },
     { id: 'ASSET-011', name: 'Backup Drive B1', type: 'Almacenamiento', status: 'Asignado', assignedToId: 'USR-005', barcode: 'BKDRV01', assignmentDate: '2020-01-15' },
   ];
   return allItems.filter(item => item.assignedToId === userId);
}


const getInitials = (name: string) => {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

// Define types for user and item data
type User = {
  id: string;
  name: string;
  email: string;
  department: string;
  phone: string | null;
  joinDate: string | null;
};

type AssignedItem = {
  id: string;
  name: string;
  type: string;
  assignmentDate: string | null;
};

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const userId = params?.userId as string;

  const [user, setUser] = useState<User | null>(null);
  const [assignedItems, setAssignedItems] = useState<AssignedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [userData, itemsData] = await Promise.all([
          getUserDetails(userId),
          getUserAssignedItems(userId)
        ]);

        if (userData) {
          setUser(userData);
          setAssignedItems(itemsData);
        } else {
          toast({ title: "Error", description: "Usuario no encontrado.", variant: "destructive" });
          router.push('/users');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({ title: "Error", description: "No se pudieron cargar los datos del usuario.", variant: "destructive" });
        router.push('/users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, router, toast]);


  const handleGenerateReturnForm = useCallback(() => {
      if (!user) return;
      // In a real app, this would:
      // 1. Collect item conditions (maybe open a modal).
      // 2. Generate a PDF or document.
      // 3. Potentially trigger an email to HR.
      alert(`Generando formulario de devolución para ${user.name}...\nNormalmente incluiría una lista de ${assignedItems.length} equipos y campos para evaluar su condición antes de enviarlo a RRHH.`);
  }, [user, assignedItems]); // Added dependencies

   const handleDeleteUser = useCallback(() => {
    if (!user) return;
    // Placeholder for delete confirmation and action
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.name}" (ID: ${user.id})? Si tiene equipos asignados, deberás gestionarlos primero. Esta acción no se puede deshacer.`)) {
        console.log("Deleting user:", user.id);
        // Simulate API call for deletion
        toast({
            title: "Usuario Eliminado (Simulado)",
            description: `El usuario ${user.name} ha sido eliminado.`,
            variant: "destructive"
        });
        router.push('/users'); // Redirect after deletion
    }
  }, [user, router, toast]); // Added dependencies


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
         <span className="ml-2">Cargando detalles del usuario...</span>
      </div>
    );
  }

  // User not found is handled in useEffect by redirecting

   if (!user) {
     // Fallback if redirect hasn't happened yet
     return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-destructive">
         <h2 className="text-xl font-semibold mb-4">Usuario no encontrado</h2>
         <p>No se pudo cargar la información del usuario solicitado.</p>
         <Link href="/users" passHref className="mt-4">
             <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Usuarios
             </Button>
        </Link>
       </div>
     )
   }

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
       <div className="mb-6 flex justify-between items-center flex-wrap gap-2">
         <Link href="/users" passHref>
             <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Usuarios
             </Button>
        </Link>
        <div className="flex gap-2">
            {assignedItems.length > 0 && (
                <Button variant="secondary" onClick={handleGenerateReturnForm}>
                    <Download className="mr-2 h-4 w-4" /> Generar Form. Devolución
                </Button>
            )}
             <Button variant="destructive" onClick={handleDeleteUser}>
                 <UserX className="mr-2 h-4 w-4" /> Eliminar Usuario
             </Button>
         </div>
       </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Info Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} data-ai-hint="people avatar"/>
              <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl text-primary">{user.name}</CardTitle>
             <CardDescription>{user.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Separator />
             <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground"/>
                <span>{user.email}</span>
             </div>
             <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground"/>
                <span>{user.department}</span>
             </div>
             <div className="flex items-center gap-2">
                 <Phone className="w-4 h-4 text-muted-foreground"/>
                <span>{user.phone || 'N/A'}</span>
             </div>
             <Separator />
             <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Incorporación: {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</span>
             </div>
          </CardContent>
           <CardFooter>
              {/* Add Edit User button if needed */}
               <Button variant="outline" className="w-full" disabled>
                 <Edit className="mr-2 h-4 w-4" /> Editar Usuario (No Implementado)
               </Button>
           </CardFooter>
        </Card>

        {/* Assigned Items Card */}
        <Card className="md:col-span-2">
           <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Package className="w-5 h-5"/> Equipos Asignados ({assignedItems.length})
                 </CardTitle>
                <CardDescription>Lista de activos IT asignados actualmente a {user.name}.</CardDescription>
           </CardHeader>
           <CardContent>
                {assignedItems.length > 0 ? (
                     <div className="overflow-auto max-h-[400px] rounded-md border"> {/* Added scroll */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Etiqueta Activo</TableHead>
                                    <TableHead>Nombre Equipo</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Asignado el</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignedItems.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                             <Link href={`/inventory/${item.id}`} className="hover:underline text-primary">
                                                 {item.id}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>{item.assignmentDate ? new Date(item.assignmentDate).toLocaleDateString() : 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                     <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-md text-center">
                        <Package className="w-10 h-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Este usuario no tiene equipos asignados actualmente.</p>
                         <Button variant="link" className="mt-2" disabled>Asignar Nuevo Equipo</Button> {/* Disabled for now */}
                    </div>
                )}
           </CardContent>
           <CardFooter>
               <p className="text-xs text-muted-foreground italic">Basado en formularios de responsabilidad de equipo firmados.</p>
           </CardFooter>
        </Card>
      </div>

       {/* Placeholder for User Activity/History */}
       <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl">Registro de Actividad del Usuario</CardTitle>
             <CardDescription>Historial de asignaciones, devoluciones e interacciones con el sistema.</CardDescription>
          </CardHeader>
           <CardContent>
              <p className="text-sm text-muted-foreground">Registro de actividad del usuario próximamente...</p>
           </CardContent>
        </Card>

    </div>
  );
}