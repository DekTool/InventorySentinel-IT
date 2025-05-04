
"use client";

import { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScanBarcode, Search, Loader2, AlertTriangle, CheckCircle, Tag, User, Info, Package } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';


// Mock data fetching function (replace with actual data fetching)
async function getItemByBarcode(barcodeOrId: string) {
  console.log("Searching for barcode/ID:", barcodeOrId);
  // Simulate API call latency
  await new Promise(resolve => setTimeout(resolve, 750));

  const items = [
    { id: 'ASSET-001', name: 'Laptop Pro 15"', type: 'Portátil', status: 'Asignado', assignedTo: 'Alice Smith (asmith@example.com)', barcode: '123456789012', serialNumber: 'SN123XYZ' },
    { id: 'ASSET-002', name: 'Ratón Inalámbrico X', type: 'Ratón', status: 'En Stock', assignedTo: null, barcode: '987654321098', serialNumber: 'SN456ABC' },
    { id: 'ASSET-003', name: 'Docking Station Z', type: 'Docking Station', status: 'Asignado', assignedTo: 'Bob Johnson (bjohnson@example.com)', barcode: '112233445566', serialNumber: 'SNDEF789' },
    { id: 'ASSET-005', name: 'Monitor 27" 4K', type: 'Monitor', status: 'Asignado', assignedTo: 'Alice Smith (asmith@example.com)', barcode: '334455667788', serialNumber: 'SNMON4K01' },
    { id: 'USR-001', name: 'Alice Smith', type: 'Usuario', status: 'Activo', assignedTo: null, barcode: null, serialNumber: null, email: 'asmith@example.com' }, // Add user example
  ];

  // Search by barcode first, then by asset tag/user ID
  const foundItem = items.find(i => i.barcode === barcodeOrId) || items.find(i => i.id === barcodeOrId);

  return foundItem || null; // Not found
}

type Item = {
  id: string;
  name: string;
  type: string; // Could be 'Equipo' or 'Usuario'
  status: string;
  assignedTo?: string | null; // Relevant for equipment
  barcode?: string | null;    // Relevant for equipment
  serialNumber?: string | null; // Relevant for equipment
  email?: string | null; // Relevant for user
} | null;


export default function ScanPage() {
  const [scanInput, setScanInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<Item>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

   // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault(); // Prevent default form submission if used
    if (!scanInput.trim()) {
      setError("Por favor, introduce o escanea un código de barras / ID de activo / ID de usuario.");
      setScanResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const result = await getItemByBarcode(scanInput.trim());
      setScanResult(result);
      if (!result) {
        setError(`No se encontró ningún elemento para "${scanInput.trim()}".`);
      }
    } catch (err) {
      console.error("Scan error:", err);
      setError("Ocurrió un error durante la búsqueda. Por favor, inténtalo de nuevo.");
      setScanResult(null);
    } finally {
      setIsLoading(false);
       // Optionally clear input after scan
       // setScanInput('');
       // inputRef.current?.focus(); // Re-focus for next scan
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
                    <CheckCircle className="w-5 h-5"/> {scanResult.type === 'Usuario' ? 'Usuario Encontrado' : 'Equipo Encontrado'}: {scanResult.name}
                </CardTitle>
                <CardDescription className="text-green-200/80">{scanResult.type}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
                 <Separator className="bg-green-500/30"/>
                 <div className="grid grid-cols-3 gap-2">
                    {/* Common Fields */}
                    <span className="font-medium text-green-300 flex items-center gap-1"><Tag className="w-4 h-4"/> ID:</span>
                    <span className="col-span-2 text-green-100">{scanResult.id}</span>

                    <span className="font-medium text-green-300 flex items-center gap-1"><Info className="w-4 h-4"/> Estado:</span>
                    <span className="col-span-2">
                         <span className={`px-2 py-0.5 rounded-full text-xs ${
                            scanResult.status === 'Asignado' ? 'bg-yellow-900 text-yellow-300' :
                            scanResult.status === 'En Stock' ? 'bg-green-900 text-green-300' :
                            scanResult.status === 'Activo' ? 'bg-blue-900 text-blue-300' : // Status for User
                            'bg-gray-700 text-gray-300'
                         }`}>
                           {scanResult.status}
                        </span>
                    </span>

                    {/* Equipment Specific Fields */}
                    {scanResult.type !== 'Usuario' && (
                        <>
                            <span className="font-medium text-green-300 flex items-center gap-1"><User className="w-4 h-4"/> Asignado A:</span>
                            <span className="col-span-2 text-green-100">{scanResult.assignedTo || 'Sin Asignar'}</span>

                            <span className="font-medium text-green-300 flex items-center gap-1"><Info className="w-4 h-4"/> N/S:</span>
                            <span className="col-span-2 text-green-100">{scanResult.serialNumber || 'N/A'}</span>

                            <span className="font-medium text-green-300 flex items-center gap-1"><Barcode className="w-4 h-4"/> Código Barras:</span>
                            <span className="col-span-2 text-green-100">{scanResult.barcode || 'N/A'}</span>
                        </>
                    )}

                    {/* User Specific Fields */}
                    {scanResult.type === 'Usuario' && (
                         <>
                            <span className="font-medium text-green-300 flex items-center gap-1"><Info className="w-4 h-4"/> Email:</span>
                            <span className="col-span-2 text-green-100">{scanResult.email || 'N/A'}</span>
                        </>
                    )}

                 </div>
                  <Separator className="bg-green-500/30 mt-2"/>
                  {/* Link to appropriate details page */}
                   <Link href={scanResult.type === 'Usuario' ? `/users/${scanResult.id}` : `/inventory/${scanResult.id}`} passHref className="mt-2">
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
