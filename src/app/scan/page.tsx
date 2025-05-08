
"use client";

import { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScanBarcode, Search, Loader2, AlertTriangle, CheckCircle, Tag, User, Info, Package, Mail } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { findInventoryItemByBarcodeOrId } from '@/lib/inventory-data';
import { getUserById } from '@/lib/user-data'; // To fetch user details if an ID is scanned


type ScannedEntityType = 'Equipo' | 'Usuario';

type ScannedItem = {
  id: string;
  name: string;
  entityType: ScannedEntityType; 
  status?: string; // Status can be different for equipment vs user
  // Equipment specific
  itemType?: string; // e.g., Portátil, Monitor
  assignedTo?: string | null; 
  barcode?: string | null;    
  serialNumber?: string | null;
  // User specific
  email?: string | null; 
  department?: string | null;
} | null;


export default function ScanPage() {
  const [scanInput, setScanInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScannedItem>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!scanInput.trim()) {
      setError("Por favor, introduce o escanea un código de barras / ID de activo / ID de usuario.");
      setScanResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setScanResult(null);
    const query = scanInput.trim();

    try {
      // Attempt to find as inventory item first
      const inventoryItem = await findInventoryItemByBarcodeOrId(query);
      if (inventoryItem) {
        setScanResult({
            id: inventoryItem.id,
            name: inventoryItem.name,
            entityType: 'Equipo',
            status: inventoryItem.status,
            itemType: inventoryItem.type,
            assignedTo: inventoryItem.assignedTo,
            barcode: inventoryItem.barcode,
            serialNumber: inventoryItem.serialNumber,
        });
      } else if (query.toUpperCase().startsWith('USR-')) { // Check if it looks like a User ID
        const user = await getUserById(query);
        if (user) {
            setScanResult({
                id: user.id,
                name: user.name,
                entityType: 'Usuario',
                status: 'Activo', // Users might have a status like Active/Inactive
                email: user.email,
                department: user.department,
            });
        } else {
            setError(`No se encontró ningún usuario para el ID "${query}".`);
        }
      } else {
        setError(`No se encontró ningún elemento o usuario para "${query}".`);
      }
    } catch (err) {
      console.error("Scan error:", err);
      setError("Ocurrió un error durante la búsqueda. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-xl mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <ScanBarcode className="w-6 h-6" /> Escanear Código o Introducir ID
          </CardTitle>
          <CardDescription>Introduce el código de barras, ID de activo o ID de usuario abajo para ver los detalles.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleScan} className="flex items-center gap-2">
            <Input
              ref={inputRef}
              placeholder="Escanea o escribe código/ID..."
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !scanInput.trim()} size="icon">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="sr-only">Buscar</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center p-6 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Buscando...
        </div>
      )}

      {error && !isLoading && (
         <Card className="w-full max-w-xl border-destructive bg-destructive/10">
            <CardContent className="p-4 flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <p className="font-medium">{error}</p>
            </CardContent>
         </Card>
      )}

       {scanResult && !isLoading && (
         <Card className="w-full max-w-xl border-green-500 bg-green-950/50">
            <CardHeader>
                <CardTitle className="text-xl text-green-400 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5"/> {scanResult.entityType === 'Usuario' ? 'Usuario Encontrado' : 'Equipo Encontrado'}: {scanResult.name}
                </CardTitle>
                <CardDescription className="text-green-200/80">{scanResult.entityType}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
                 <Separator className="bg-green-500/30"/>
                 <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-green-300 flex items-center gap-1"><Tag className="w-4 h-4"/> ID:</span>
                    <span className="col-span-2 text-green-100">{scanResult.id}</span>

                    {scanResult.status && (
                        <>
                            <span className="font-medium text-green-300 flex items-center gap-1"><Info className="w-4 h-4"/> Estado:</span>
                            <span className="col-span-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    scanResult.status === 'Asignado' ? 'bg-yellow-900 text-yellow-300' :
                                    scanResult.status === 'En Stock' ? 'bg-green-700 text-green-200' : // Brighter green for stock
                                    scanResult.status === 'Activo' ? 'bg-blue-700 text-blue-200' :
                                    scanResult.status === 'Mantenimiento' ? 'bg-orange-700 text-orange-200' :
                                    scanResult.status === 'Retirado' ? 'bg-red-700 text-red-200' :
                                    'bg-gray-700 text-gray-300'
                                }`}>
                                {scanResult.status}
                                </span>
                            </span>
                        </>
                    )}

                    {scanResult.entityType === 'Equipo' && (
                        <>
                            {scanResult.itemType && (
                                <>
                                <span className="font-medium text-green-300 flex items-center gap-1"><Package className="w-4 h-4"/> Tipo Equipo:</span>
                                <span className="col-span-2 text-green-100">{scanResult.itemType}</span>
                                </>
                            )}
                            <span className="font-medium text-green-300 flex items-center gap-1"><User className="w-4 h-4"/> Asignado A:</span>
                            <span className="col-span-2 text-green-100">{scanResult.assignedTo || 'Sin Asignar'}</span>

                            <span className="font-medium text-green-300 flex items-center gap-1"><Info className="w-4 h-4"/> N/S:</span>
                            <span className="col-span-2 text-green-100">{scanResult.serialNumber || 'N/A'}</span>

                            <span className="font-medium text-green-300 flex items-center gap-1"><Barcode className="w-4 h-4"/> Código Barras:</span>
                            <span className="col-span-2 text-green-100">{scanResult.barcode || 'N/A'}</span>
                        </>
                    )}

                    {scanResult.entityType === 'Usuario' && (
                         <>
                            <span className="font-medium text-green-300 flex items-center gap-1"><Mail className="w-4 h-4"/> Email:</span>
                            <span className="col-span-2 text-green-100">{scanResult.email || 'N/A'}</span>
                            <span className="font-medium text-green-300 flex items-center gap-1"><Info className="w-4 h-4"/> Departamento:</span>
                            <span className="col-span-2 text-green-100">{scanResult.department || 'N/A'}</span>
                        </>
                    )}
                 </div>
                  <Separator className="bg-green-500/30 mt-2"/>
                   <Link href={scanResult.entityType === 'Usuario' ? `/users/${scanResult.id}` : `/inventory/${scanResult.id}`} passHref className="mt-2">
                     <Button variant="link" className="text-green-400 p-0 h-auto hover:text-green-200">
                        Ver Detalles Completos e Historial &rarr;
                     </Button>
                   </Link>
            </CardContent>
         </Card>
      )}

       {!isLoading && !error && !scanResult && (
         <Card className="w-full max-w-xl border-dashed">
            <CardContent className="p-6 text-center text-muted-foreground">
                <p>Escanea o introduce un código/ID arriba para ver los detalles.</p>
            </CardContent>
         </Card>
       )}
    </div>
  );
}
