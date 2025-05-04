
"use client";

import { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScanBarcode, Search, Loader2, AlertTriangle, CheckCircle, Tag, User, Info, Package } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';


// Mock data fetching function (replace with actual data fetching)
async function getItemByBarcode(barcode: string) {
  console.log("Searching for barcode:", barcode);
  // Simulate API call latency
  await new Promise(resolve => setTimeout(resolve, 750));

  const items = [
    { id: 'ASSET-001', name: 'Laptop Pro 15"', type: 'Laptop', status: 'Assigned', assignedTo: 'Alice Smith (asmith@example.com)', barcode: '123456789012', serialNumber: 'SN123XYZ' },
    { id: 'ASSET-002', name: 'Wireless Mouse X', type: 'Mouse', status: 'In Stock', assignedTo: null, barcode: '987654321098', serialNumber: 'SN456ABC' },
    { id: 'ASSET-003', name: 'Docking Station Z', type: 'Docking Station', status: 'Assigned', assignedTo: 'Bob Johnson (bjohnson@example.com)', barcode: '112233445566', serialNumber: 'SNDEF789' },
    { id: 'ASSET-005', name: 'Monitor 27" 4K', type: 'Monitor', status: 'Assigned', assignedTo: 'Alice Smith (asmith@example.com)', barcode: '334455667788', serialNumber: 'SNMON4K01' },
  ];

  // Simulate finding item or not
  if (barcode && items.some(i => i.barcode === barcode)) {
     return items.find(i => i.barcode === barcode) || null;
  } else if (barcode && items.some(i => i.id === barcode)) { // Allow searching by Asset Tag too
     return items.find(i => i.id === barcode) || null;
  }

  return null; // Not found
}

type Item = {
  id: string;
  name: string;
  type: string;
  status: string;
  assignedTo: string | null;
  barcode: string;
  serialNumber?: string;
} | null;


export default function ScanPage() {
  const [barcodeInput, setBarcodeInput] = useState('');
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
    if (!barcodeInput.trim()) {
      setError("Please enter or scan a barcode/asset tag.");
      setScanResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const result = await getItemByBarcode(barcodeInput.trim());
      setScanResult(result);
      if (!result) {
        setError(`No item found for "${barcodeInput.trim()}".`);
      }
    } catch (err) {
      console.error("Scan error:", err);
      setError("An error occurred while searching. Please try again.");
      setScanResult(null);
    } finally {
      setIsLoading(false);
       // Optionally clear input after scan
       // setBarcodeInput('');
       // inputRef.current?.focus(); // Re-focus for next scan
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-xl mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <ScanBarcode className="w-6 h-6" /> Scan Barcode or Enter Asset Tag
          </CardTitle>
          <CardDescription>Enter the barcode or asset tag below to view item details and assignment.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleScan} className="flex items-center gap-2">
            <Input
              ref={inputRef}
              placeholder="Scan or type barcode/asset tag..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !barcodeInput.trim()} size="icon">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center p-6 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Searching...
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
                    <CheckCircle className="w-5 h-5"/> Item Found: {scanResult.name}
                </CardTitle>
                <CardDescription className="text-green-200/80">{scanResult.type}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
                 <Separator className="bg-green-500/30"/>
                 <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-green-300 flex items-center gap-1"><Tag className="w-4 h-4"/> Asset Tag:</span>
                    <span className="col-span-2 text-green-100">{scanResult.id}</span>

                    <span className="font-medium text-green-300 flex items-center gap-1"><Package className="w-4 h-4"/> Status:</span>
                    <span className="col-span-2">
                         <span className={`px-2 py-0.5 rounded-full text-xs ${scanResult.status === 'Assigned' ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'}`}>
                           {scanResult.status}
                        </span>
                    </span>

                    <span className="font-medium text-green-300 flex items-center gap-1"><User className="w-4 h-4"/> Assigned To:</span>
                    <span className="col-span-2 text-green-100">{scanResult.assignedTo || 'Not Assigned'}</span>

                     <span className="font-medium text-green-300 flex items-center gap-1"><Info className="w-4 h-4"/> Serial No:</span>
                    <span className="col-span-2 text-green-100">{scanResult.serialNumber || 'N/A'}</span>

                     <span className="font-medium text-green-300 flex items-center gap-1"><Barcode className="w-4 h-4"/> Barcode:</span>
                    <span className="col-span-2 text-green-100">{scanResult.barcode}</span>
                 </div>
                  <Separator className="bg-green-500/30 mt-2"/>
                   <Link href={`/inventory/${scanResult.id}`} passHref className="mt-2">
                     <Button variant="link" className="text-green-400 p-0 h-auto hover:text-green-200">
                        View Full Details & History &rarr;
                     </Button>
                   </Link>
            </CardContent>
         </Card>
      )}

       {!isLoading && !error && !scanResult && (
         <Card className="w-full max-w-xl border-dashed">
            <CardContent className="p-6 text-center text-muted-foreground">
                <p>Scan or enter a barcode/asset tag above to see item details.</p>
            </CardContent>
         </Card>
       )}

    </div>
  );
}
