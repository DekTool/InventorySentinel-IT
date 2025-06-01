
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PlusCircle, Search, Package, Upload, Loader2, User as UserIcon, ShieldCheck } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useMemo } from "react";
import type { User } from "@/types/user";
import { getAllUsers } from "@/lib/user-data";
import { Badge } from "@/components/ui/badge";


const getInitials = (name: string) => {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length === 1) return names[0]?.[0]?.toUpperCase() ?? '';
  if (names.length > 1) return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  return '';
}

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const usersData = await getAllUsers();
      setUsers(usersData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(lowerSearchTerm) ||
      user.email.toLowerCase().includes(lowerSearchTerm) ||
      user.department.toLowerCase().includes(lowerSearchTerm) ||
      user.id.toLowerCase().includes(lowerSearchTerm) ||
      user.role.toLowerCase().includes(lowerSearchTerm)
    );
  }, [users, searchTerm]);

  const handleBulkUploadClick = () => {
    toast({
        title: "Función no implementada",
        description: "La carga masiva de usuarios estará disponible pronto.",
        variant: "default"
    });
  };

  const getRoleVariant = (role: User['role']): "default" | "secondary" | "outline" => {
    switch (role) {
      case 'Administrador': return 'default';
      case 'Tecnico': return 'secondary';
      case 'Usuario': return 'outline';
      default: return 'outline';
    }
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

      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Buscar por Nombre, Email, Departamento, ID, Rol..."
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
          <span className="ml-2">Cargando usuarios...</span>
        </div>
      ) : (
        <div className="flex-1 overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Equipos Asignados</TableHead>
                <TableHead><span className="sr-only">Acciones</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                           <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleVariant(user.role)} className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
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
              {filteredUsers.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron usuarios que coincidan con la búsqueda o no hay usuarios registrados.
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
