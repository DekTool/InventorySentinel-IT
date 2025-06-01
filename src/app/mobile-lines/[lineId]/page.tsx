
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash2, Smartphone, CalendarDays, User, Info, AlertTriangle, Loader2, Tag, Key, ShieldCheck } from "lucide-react";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { MobileLine } from '@/types/mobile-line';
import { getMobileLineById, deleteMobileLine } from '@/lib/mobile-line-data';
import { Badge } from '@/components/ui/badge';

export default function MobileLineDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const lineId = params?.lineId as string;

  const [line, setLine] = useState<MobileLine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLineData = useCallback(async () => {
    if (!lineId) return;
    setIsLoading(true);
    const data = await getMobileLineById(lineId);
    if (data) {
      setLine(data);
    } else {
      toast({ title: "Error", description: "Línea móvil no encontrada.", variant: "destructive" });
      router.push('/mobile-lines');
    }
    setIsLoading(false);
  }, [lineId, router, toast]);

  useEffect(() => {
    fetchLineData();
  }, [fetchLineData]);

  const handleDeleteLine = async () => {
    if (!line) return;
    if (confirm(`¿Estás seguro de que quieres eliminar la línea móvil "${line.phoneNumber}" (ID: ${line.id})? Esta acción no se puede deshacer.`)) {
      setIsDeleting(true);
      const success = await deleteMobileLine(line.id);
      if (success) {
        toast({
          title: "Línea Móvil Eliminada",
          description: `La línea ${line.phoneNumber} ha sido eliminada.`,
          variant: "default"
        });
        router.push('/mobile-lines');
      } else {
        toast({
          title: "Error al Eliminar",
          description: "No se pudo eliminar la línea móvil.",
          variant: "destructive"
        });
      }
      setIsDeleting(false);
    }
  };
  
  const getStatusVariant = (status?: MobileLine['status']): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return "secondary";
    switch (status) {
      case 'Activa': return 'default';
      case 'Suspendida': return 'secondary';
      case 'Cancelada': return 'destructive';
      case 'Sin Asignar': return 'outline';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando detalles de la línea móvil...</span>
      </div>
    );
  }

  if (!line) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-destructive">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-semibold mb-4">Línea Móvil no Encontrada</h2>
        <p>La línea móvil solicitada no pudo ser cargada.</p>
        <Link href="/mobile-lines" passHref className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Líneas Móviles
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <div className="mb-6">
        <Link href="/mobile-lines" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Líneas Móviles
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <Smartphone className="w-6 h-6" /> Línea: {line.phoneNumber}
              </CardTitle>
              <CardDescription>ID: {line.id} - Operador: {line.carrier}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href={`/mobile-lines/${line.id}/edit`} passHref>
                <Button variant="outline" size="icon" title="Editar Línea Móvil" disabled={isDeleting}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar Línea Móvil</span>
                </Button>
              </Link>
              <Button variant="destructive" size="icon" onClick={handleDeleteLine} title="Eliminar Línea Móvil" disabled={isDeleting}>
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                <span className="sr-only">Eliminar Línea Móvil</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-3">
                <h3 className="font-semibold text-lg">Detalles de la Línea</h3>
                <Separator />
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="font-medium text-muted-foreground flex items-center gap-1"><Info className="w-4 h-4"/>Plan:</dt>
                    <dd>{line.planName}</dd>

                    <dt className="font-medium text-muted-foreground flex items-center gap-1"><CalendarDays className="w-4 h-4"/>Activación:</dt>
                    <dd>{line.activationDate ? new Date(line.activationDate).toLocaleDateString() : 'N/A'}</dd>
                    
                    <dt className="font-medium text-muted-foreground flex items-center gap-1"><Tag className="w-4 h-4"/>Nº SIM (ICCID):</dt>
                    <dd>{line.simCardNumber || 'N/A'}</dd>

                    <dt className="font-medium text-muted-foreground flex items-center gap-1"><Key className="w-4 h-4"/>PUK:</dt>
                    <dd>{line.pukCode || 'N/A'}</dd>
                </dl>
            </div>
            <div className="space-y-3">
                <h3 className="font-semibold text-lg">Estado y Asignación</h3>
                <Separator />
                 <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="font-medium text-muted-foreground flex items-center gap-1"><ShieldCheck className="w-4 h-4"/>Estado:</dt>
                    <dd><Badge variant={getStatusVariant(line.status)}>{line.status}</Badge></dd>
                    
                    <dt className="font-medium text-muted-foreground flex items-center gap-1"><User className="w-4 h-4"/>Asignado A:</dt>
                    <dd>
                        {line.assignedToUserId && line.assignedToUserName ? (
                            <Link href={`/users/${line.assignedToUserId}`} className="text-primary hover:underline">
                                {line.assignedToUserName} (ID: {line.assignedToUserId})
                            </Link>
                        ) : 'Sin Asignar'}
                    </dd>
                 </dl>
            </div>
          </div>
          
          {line.notes && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Notas Adicionales</h3>
              <Separator className="mb-4"/>
              <p className="text-sm text-muted-foreground italic whitespace-pre-wrap">
                {line.notes}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <p>ID de Línea: {line.id}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
