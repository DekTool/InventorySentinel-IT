
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings as SettingsIcon, Users as UsersIcon, UserCheck, Loader2, UserPlus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { User, UserRole } from '@/types/user';
import { getAllUsers, updateUser, userRoles } from '@/lib/user-data'; // deleteUser no longer needed here
import Link from 'next/link';
// AlertDialog components are no longer needed here as delete functionality is removed from this page.

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingRole, setIsUpdatingRole] = useState<Record<string, boolean>>({});
  // State related to user deletion (userToDelete, isAlertDialogOpen, isDeletingUser) is removed
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUsersData() {
      setIsLoading(true);
      const usersData = await getAllUsers();
      setUsers(usersData);
      setIsLoading(false);
    }
    fetchUsersData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setIsUpdatingRole(prev => ({ ...prev, [userId]: true }));
    try {
      const updatedUser = await updateUser(userId, { role: newRole });
      if (updatedUser) {
        setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
        toast({
          title: "Rol Actualizado",
          description: `El rol de ${updatedUser.name} ha sido cambiado a ${newRole}.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Error al Actualizar Rol",
          description: "No se pudo actualizar el rol del usuario.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error del Servidor",
        description: "Ocurrió un error al intentar actualizar el rol.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingRole(prev => ({ ...prev, [userId]: false }));
    }
  };

  // confirmDeleteUser and executeDeleteUser functions are removed from this page.
  // User deletion will be handled on the user details page.

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <SettingsIcon className="w-7 h-7" /> Configuración
        </h1>
        <p className="text-muted-foreground">Gestiona los ajustes y preferencias de la aplicación.</p>
      </header>

      <div className="grid gap-6">
         <Card>
            <CardHeader>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2"><UserCheck className="w-5 h-5"/> Gestión de Roles de Usuario</CardTitle>
                <Link href="/users/add" passHref>
                  <Button variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" /> Añadir Nuevo Usuario
                  </Button>
                </Link>
              </div>
               <CardDescription>Asigna roles a los usuarios para definir sus permisos. La lógica de autorización completa se implementará en futuras versiones. Actualmente, solo el rol 'Usuario' tiene restricciones visuales simuladas.</CardDescription>
            </CardHeader>
             <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <span>Cargando usuarios...</span>
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay usuarios registrados para gestionar roles.</p>
                ) : (
                  <div className="overflow-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre de Usuario</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Departamento</TableHead>
                          <TableHead className="w-[200px]">Rol Actual</TableHead>
                          {/* Acciones column removed */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.department}</TableCell>
                            <TableCell>
                              {isUpdatingRole[user.id] ? (
                                <div className="flex items-center">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  <span>Actualizando...</span>
                                </div>
                              ) : (
                                <Select
                                  value={user.role}
                                  onValueChange={(newRole) => handleRoleChange(user.id, newRole as UserRole)}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Selecciona un rol" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {userRoles.map((roleOption) => (
                                      <SelectItem key={roleOption} value={roleOption}>
                                        {roleOption}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </TableCell>
                            {/* TableCell for delete button removed */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
             </CardContent>
         </Card>
      </div>

      {/* AlertDialog for delete confirmation is removed from this page */}
    </div>
  );
}
