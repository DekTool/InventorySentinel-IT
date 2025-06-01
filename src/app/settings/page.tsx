
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings as SettingsIcon, Users as UsersIcon, UserCheck, Loader2, UserPlus, Trash2 } from "lucide-react"; // Added Trash2
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { User, UserRole } from '@/types/user';
import { getAllUsers, updateUser, userRoles, deleteUser } from '@/lib/user-data'; 
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingRole, setIsUpdatingRole] = useState<Record<string, boolean>>({});
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const { toast } = useToast();

  const fetchUsersData = async () => {
    setIsLoading(true);
    const usersData = await getAllUsers();
    setUsers(usersData);
    setIsLoading(false);
  };

  useEffect(() => {
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

  const confirmDeleteUser = (user: User) => {
    if (user.assignedItems > 0) {
      toast({
        title: "No se puede eliminar el usuario",
        description: `${user.name} tiene ${user.assignedItems} equipo(s) asignado(s). Por favor, reasigna o retira los equipos antes de eliminar al usuario.`,
        variant: "destructive",
        duration: 7000,
      });
      return;
    }
    setUserToDelete(user);
    setIsAlertDialogOpen(true);
  };

  const executeDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeletingUser(true);
    try {
      const success = await deleteUser(userToDelete.id);
      if (success) {
        toast({
          title: "Usuario Eliminado",
          description: `El usuario ${userToDelete.name} ha sido eliminado del sistema.`,
          variant: "default",
        });
        fetchUsersData(); // Refresh the user list
      } else {
        toast({
          title: "Error al Eliminar",
          description: "No se pudo eliminar el usuario del sistema.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting user from system:", error);
      toast({
        title: "Error del Servidor",
        description: "Ocurrió un error al intentar eliminar el usuario.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingUser(false);
      setIsAlertDialogOpen(false);
      setUserToDelete(null);
    }
  };


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
                <Link href="/settings/users/add" passHref> {/* Updated Link */}
                  <Button variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" /> Añadir Nuevo Usuario (Básico)
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
                          <TableHead className="text-right">Acciones</TableHead>
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
                                  disabled={isUpdatingRole[user.id]}
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
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => confirmDeleteUser(user)}
                                disabled={isDeletingUser && userToDelete?.id === user.id}
                                title="Eliminar usuario del sistema"
                              >
                                {isDeletingUser && userToDelete?.id === user.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4 text-destructive"/>}
                                <span className="sr-only">Eliminar usuario del sistema</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
             </CardContent>
         </Card>
      </div>
        
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al usuario <span className="font-semibold">{userToDelete?.name}</span> del sistema. 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)} disabled={isDeletingUser}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={executeDeleteUser} disabled={isDeletingUser} className="bg-destructive hover:bg-destructive/90">
              {isDeletingUser ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sí, eliminar usuario
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
