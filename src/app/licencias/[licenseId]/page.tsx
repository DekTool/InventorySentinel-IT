"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash2, KeyRound, CalendarDays, Users, Building, Info, AlertTriangle, Loader2, Tag } from "lucide-react";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { License } from '@/types/license';
import { getLicenseById, deleteLicense } from '@/lib/license-data'; // Mock data functions
import { Badge } from '@/components/ui/badge';

export default function LicenseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const licenseId = params?.licenseId as string;

  const [license, setLicense] = useState<License | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLicenseData = useCallback(async () => {
    if (!licenseId) return;
    setIsLoading(true);
    const data = await getLicenseById(licenseId);
    if (data) {
      setLicense(data);
    } else {
      toast({ title: "Error", description: "Licencia no encontrada.", variant: "destructive" });
      router.push('/licencias');
    }
    setIsLoading(false);
  }, [licenseId, router, toast]);

  useEffect(() => {
    fetchLicenseData();
  }, [fetchLicenseData]);

  const handleDeleteLicense = async () => {
    if (!license) return;
    if (confirm(`¿Estás seguro de que quieres eliminar la licencia "${license.softwareName}" (ID: ${license.id})? Esta acción no se puede deshacer.`)) {
      setIsDeleting(true);
      const success = await deleteLicense(license.id);
      if (success) {
        toast({
          title: "Licencia Eliminada",
          description: `La licencia ${license.softwareName} ha sido eliminada.`,
          variant: "default" // Or "destructive" if preferred for delete actions
        });
        router.push('/licencias');
      } else {
        toast({
          title: "Error al Eliminar",
          description: "No se pudo eliminar la licencia.",
          variant: "destructive"
        });
      }
      setIsDeleting(false);
    }
  };
  
  const getStatusVariant = (status?: License['status']): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return "secondary";
    switch (status) {
      case 'Activa':
        return 'default';
      case 'Expirada':
        return 'destructive';
      case 'Sin Asignar':
        return 'secondary';
      case 'Archivada':
        return 'outline';
      default:
        return 'secondary';
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando detalles de la licencia...</span>
      </div>
    );
  }

  if (!license) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-destructive">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-semibold mb-4">Licencia no Encontrada</h2>
        <p>La licencia solicitada no pudo ser cargada.</p>
        <Link href="/licencias" passHref className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Licencias
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <div className="mb-6">
        <Link href="/licencias" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Licencias
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <Tag className="w-6 h-6" /> {license.id}
              </CardTitle>
              <CardDescription>{license.softwareName} - {license.licenseType}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href={`/licencias/${license.id}/edit`} passHref>
                <Button variant="outline" size="icon" title="Editar Licencia" disabled={isDeleting}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar Licencia</span>
                </Button>
              </Link>
              <Button variant="destructive" size="icon" onClick={handleDeleteLicense} title="Eliminar Licencia" disabled={isDeleting}>
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                <span className="sr-only">Eliminar Licencia</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Detalles de la Licencia</h3>
            <Separator />
            <div className="grid grid-cols-3 gap-3 text-sm">
              <span className="font-medium text-muted-foreground flex items-center gap-1"><KeyRound className="w-4 h-4" /> Clave:</span>
              <span className="col-span-2 break-all">{license.licenseKey}</span>

              <span className="font-medium text-muted-foreground flex items-center gap-1"><Users className="w-4 h-4" /> Puestos:</span>
              <span className="col-span-2">{license.seats}</span>

              <span className="font-medium text-muted-foreground flex items-center gap-1"><CalendarDays className="w-4 h-4" /> Fecha Compra:</span>
              <span className="col-span-2">{license.purchaseDate ? new Date(license.purchaseDate).toLocaleDateString() : 'N/A'}</span>

              <span className="font-medium text-muted-foreground flex items-center gap-1"><CalendarDays className="w-4 h-4" /> Fecha Caducidad:</span>
              <span className="col-span-2">{license.expirationDate ? new Date(license.expirationDate).toLocaleDateString() : 'N/A'}</span>
              
              <span className="font-medium text-muted-foreground flex items-center gap-1"><Building className="w-4 h-4" /> Proveedor:</span>
              <span className="col-span-2">{license.vendor || 'N/A'}</span>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Asignación y Estado</h3>
            <Separator />
            <div className="grid grid-cols-3 gap-3 text-sm">
              <span className="font-medium text-muted-foreground">Estado:</span>
              <span className="col-span-2">
                <Badge variant={getStatusVariant(license.status)}>{license.status}</Badge>
              </span>

              <span className="font-medium text-muted-foreground flex items-center gap-1"><Users className="w-4 h-4" /> Asignado A:</span>
              <span className="col-span-2">{license.assignedTo || 'Sin Asignar'}</span>
            </div>
            <h3 className="font-semibold text-lg mt-4">Notas</h3>
            <Separator />
            <p className="text-sm text-muted-foreground italic whitespace-pre-wrap">
              {license.notes || 'No hay notas.'}
            </p>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <p>ID de Licencia: {license.id}</p>
        </CardFooter>
      </Card>

      {/* Placeholder for History Section if needed for licenses */}
      {/* 
      <Card className="w-full max-w-4xl mx-auto mt-6">
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><Info className="w-5 h-5"/> Historial de la Licencia</CardTitle>
            <CardDescription>Registro de asignaciones, cambios y renovaciones.</CardDescription>
        </CardHeader>
         <CardContent>
            <p className="text-sm text-muted-foreground">Seguimiento del historial próximamente...</p>
         </CardContent>
      </Card>
      */}
    </div>
  );
}