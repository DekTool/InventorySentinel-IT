
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Mail, Building, Package, AlertTriangle, Loader2, UserX, Phone, Printer } from "lucide-react";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type { User } from '@/types/user';
import type { InventoryItem } from '@/types/inventory';
import { getUserById, deleteUser } from '@/lib/user-data';
import { getInventoryItemsByUserId } from '@/lib/inventory-data';


const getInitials = (name: string) => {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

type FormType = 'entrega' | 'devolucion' | 'entrega-devolucion';

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const userId = params?.userId as string;

  const [user, setUser] = useState<User | null>(null);
  const [assignedItems, setAssignedItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const userData = await getUserById(userId);
      if (userData) {
        setUser(userData);
        const itemsData = await getInventoryItemsByUserId(userId);
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
  }, [userId, router, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const handleGenerateForm = useCallback((formType: FormType) => {
    if (!user) return;
    let toastTitle = "Preparando Formulario";
    let toastDescription = "Se está abriendo el formulario en una nueva pestaña.";

    switch(formType) {
        case 'entrega':
            toastDescription = "Se está abriendo el formulario de entrega en una nueva pestaña.";
            break;
        case 'devolucion':
            toastDescription = "Se está abriendo el formulario de devolución en una nueva pestaña.";
            break;
        case 'entrega-devolucion':
            toastDescription = "Se está abriendo el formulario de entrega/devolución en una nueva pestaña.";
            break;
    }
    
    window.open(`/users/${user.id}/print-return-form?type=${formType}`, '_blank');
    toast({
      title: toastTitle,
      description: toastDescription,
      variant: "default"
    });
  }, [user, toast]);

   const handleDeleteUser = useCallback(async () => {
    if (!user) return;
    if (assignedItems.length > 0) {
        toast({
            title: "Acción Requerida",
            description: `El usuario ${user.name} tiene ${assignedItems.length} equipo(s) asignado(s). Debes reasignarlos o retirarlos antes de eliminar al usuario.`,
            variant: "destructive",
            duration: 5000,
        });
        return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.name}" (ID: ${user.id})? Esta acción no se puede deshacer.`)) {
        setIsDeleting(true);
        const success = await deleteUser(user.id);
        if (success) {
            toast({
                title: "Usuario Eliminado",
                description: `El usuario ${user.name} ha sido eliminado.`,
                variant: "default"
            });
            router.push('/users');
        } else {
             toast({
                title: "Error al Eliminar",
                description: "No se pudo eliminar el usuario.",
                variant: "destructive"
            });
        }
        setIsDeleting(false);
    }
  }, [user, router, toast, assignedItems.length]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
         <span className="ml-2">Cargando detalles del usuario...</span>
      </div>
    );
  }

   if (!user) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-destructive">
          <AlertTriangle className="w-12 h-12 mb-4" />
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
        <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" onClick={() => handleGenerateForm('entrega')} disabled={isDeleting}>
                <Printer className="mr-2 h-4 w-4" /> Generar Form. Entrega
            </Button>
            <Button variant="secondary" onClick={() => handleGenerateForm('devolucion')} disabled={isDeleting}>
                <Printer className="mr-2 h-4 w-4" /> Generar Form. Devolución
            </Button>
            <Button variant="secondary" onClick={() => handleGenerateForm('entrega-devolucion')} disabled={isDeleting}>
                <Printer className="mr-2 h-4 w-4" /> Generar Form. Entrega/Devolución
            </Button>
             <Button variant="destructive" onClick={handleDeleteUser} disabled={isDeleting}>
                 {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="mr-2 h-4 w-4" />}
                  Eliminar Usuario
             </Button>
         </div>
       </div>

      <div className="grid gap-6 md:grid-cols-3">
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
               <Button variant="outline" className="w-full" disabled>
                 <Edit className="mr-2 h-4 w-4" /> Editar Usuario (No Implementado)
               </Button>
           </CardFooter>
        </Card>

        <Card className="md:col-span-2">
           <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Package className="w-5 h-5"/> Equipos Asignados ({assignedItems.length})
                 </CardTitle>
                <CardDescription>Lista de activos IT asignados actualmente a {user.name}.</CardDescription>
           </CardHeader>
           <CardContent>
                {assignedItems.length > 0 ? (
                     <div className="overflow-auto max-h-[400px] rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Etiqueta Activo</TableHead>
                                    <TableHead>Nombre Equipo</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Fecha Asignación (Entrada Equipo)</TableHead>
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
                                        <TableCell>{item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                     <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-md text-center">
                        <Package className="w-10 h-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Este usuario no tiene equipos asignados actualmente.</p>
                         <Button variant="link" className="mt-2" disabled>Asignar Nuevo Equipo (No Implementado)</Button>
                    </div>
                )}
           </CardContent>
           <CardFooter>
               <p className="text-xs text-muted-foreground italic">Basado en la información de asignación de inventario.</p>
           </CardFooter>
        </Card>
      </div>

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
