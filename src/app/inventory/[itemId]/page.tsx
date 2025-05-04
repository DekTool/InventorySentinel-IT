
"use client"; // Add "use client" directive

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash2, User, Calendar, Tag, Barcode, Info, Printer, Loader2 } from "lucide-react";
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation'; // Import useParams
import { useState, useEffect } from 'react'; // Import useState and useEffect

// Mock data fetching function (replace with actual data fetching)
async function getItemDetails(itemId: string) {
  console.log("Fetching details for:", itemId);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 50));

  const items = [
    { id: 'ASSET-001', name: 'Laptop Pro 15"', type: 'Laptop', status: 'Assigned', assignedTo: 'Alice Smith (asmith@example.com)', barcode: '123456789012', serialNumber: 'SN123XYZ', purchaseDate: '2023-01-15', warrantyEndDate: '2026-01-14', notes: 'Minor scratch on the lid.' },
    { id: 'ASSET-002', name: 'Wireless Mouse X', type: 'Mouse', status: 'In Stock', assignedTo: null, barcode: '987654321098', serialNumber: 'SN456ABC', purchaseDate: '2023-05-20', warrantyEndDate: '2024-05-19', notes: '' },
    { id: 'ASSET-003', name: 'Docking Station Z', type: 'Docking Station', status: 'Assigned', assignedTo: 'Bob Johnson (bjohnson@example.com)', barcode: '112233445566', serialNumber: 'SNDEF789', purchaseDate: '2022-11-01', warrantyEndDate: '2024-10-31', notes: 'Requires specific power adapter.' },
    { id: 'ASSET-004', name: 'Mobile Phone S23', type: 'Mobile Phone', status: 'In Stock', assignedTo: null, barcode: '778899001122', serialNumber: 'SNMOB001', purchaseDate: '2024-02-10', warrantyEndDate: '2026-02-09', notes: 'Unlocked version.' },
    { id: 'ASSET-005', name: 'Monitor 27" 4K', type: 'Monitor', status: 'Assigned', assignedTo: 'Alice Smith (asmith@example.com)', barcode: '334455667788', serialNumber: 'SNMON4K01', purchaseDate: '2023-08-05', warrantyEndDate: '2026-08-04', notes: 'Includes HDMI cable.' },
  ];

  const item = items.find(i => i.id === itemId);
  return item;
}

// Define Item type
type Item = {
  id: string;
  name: string;
  type: string;
  status: string;
  assignedTo: string | null;
  barcode: string;
  serialNumber: string | null;
  purchaseDate: string | null;
  warrantyEndDate: string | null;
  notes: string | null;
};

export default function InventoryItemDetailsPage() {
  const params = useParams();
  const itemId = params?.itemId as string;
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!itemId) return;

    const fetchData = async () => {
      setIsLoading(true);
      const data = await getItemDetails(itemId);
      if (data) {
        setItem(data);
      } else {
        // Handle item not found - this component renders after layout, so notFound() might not work as expected here.
        // Redirecting or showing an error message might be better.
        console.error("Item not found:", itemId);
        // Optional: Redirect back or show a message
        // router.push('/inventory');
      }
      setIsLoading(false);
    };

    fetchData();
  }, [itemId]);


  const handlePrintTag = () => {
    if (!item) return;
    // In a real app, this would trigger a print dialog
    // potentially generating a specific layout for the asset tag.
    alert(`Printing Asset Tag for ${item.id}...\nBarcode: ${item.barcode}\nName: ${item.name}`);
    // Consider using a dedicated print library or CSS for better control
    // window.print(); // Basic browser print - needs specific styling via @media print
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) {
    // Use notFound() here if routing allows, or display an error message.
    // For client components, direct rendering might be better than notFound()
     return (
       <div className="flex flex-col items-center justify-center min-h-screen p-4 text-destructive">
         <h2 className="text-xl font-semibold mb-4">Item Not Found</h2>
         <p>The requested inventory item could not be found.</p>
         <Link href="/inventory" passHref className="mt-4">
             <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
             </Button>
        </Link>
       </div>
     );
    // Or alternatively: notFound(); // If Next.js handles this correctly in Client Components now
  }


  return (
    <div className="flex flex-col h-full p-4 md:p-8">
       <div className="mb-6">
         <Link href="/inventory" passHref>
             <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
             </Button>
        </Link>
       </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
             <div>
                <CardTitle className="text-2xl text-primary flex items-center gap-2">
                    <Tag className="w-6 h-6"/> {item.id}
                 </CardTitle>
                <CardDescription>{item.name} - {item.type}</CardDescription>
             </div>
             <div className="flex gap-2">
                 {/* onClick is now allowed because this is a Client Component */}
                 <Button variant="outline" size="icon" onClick={handlePrintTag}>
                    <Printer className="h-4 w-4" />
                    <span className="sr-only">Print Asset Tag</span>
                 </Button>
                 <Link href={`/inventory/${item.id}/edit`} passHref>
                    <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                         <span className="sr-only">Edit Item</span>
                    </Button>
                 </Link>
                 {/* Add Delete confirmation later */}
                 <Button variant="destructive" size="icon" disabled> {/* Disable delete for now */}
                    <Trash2 className="h-4 w-4" />
                     <span className="sr-only">Delete Item</span>
                 </Button>
             </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
                 <h3 className="font-semibold text-lg">Details</h3>
                 <Separator />
                 <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="font-medium text-muted-foreground flex items-center gap-1"><Barcode className="w-4 h-4"/> Barcode:</span>
                    <span className="col-span-2">{item.barcode}</span>

                    <span className="font-medium text-muted-foreground">Serial No:</span>
                    <span className="col-span-2">{item.serialNumber || 'N/A'}</span>

                    <span className="font-medium text-muted-foreground flex items-center gap-1"><Calendar className="w-4 h-4"/> Purchase Date:</span>
                    <span className="col-span-2">{item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}</span>

                    <span className="font-medium text-muted-foreground flex items-center gap-1"><Calendar className="w-4 h-4"/> Warranty End:</span>
                    <span className="col-span-2">{item.warrantyEndDate ? new Date(item.warrantyEndDate).toLocaleDateString() : 'N/A'}</span>
                 </div>
            </div>
             <div className="space-y-3">
                 <h3 className="font-semibold text-lg">Assignment & Status</h3>
                 <Separator />
                 <div className="grid grid-cols-3 gap-2 text-sm">
                     <span className="font-medium text-muted-foreground">Status:</span>
                     <span className="col-span-2">
                         <span className={`px-2 py-0.5 rounded-full text-xs ${item.status === 'Assigned' ? 'bg-yellow-900 text-yellow-300' : item.status === 'In Stock' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                           {item.status}
                        </span>
                    </span>

                    <span className="font-medium text-muted-foreground flex items-center gap-1"><User className="w-4 h-4"/> Assigned To:</span>
                    <span className="col-span-2">{item.assignedTo || 'Not Assigned'}</span>

                    {/* Add Assignment Date, Location if needed */}
                 </div>
                  <h3 className="font-semibold text-lg mt-4">Notes</h3>
                  <Separator />
                   <p className="text-sm text-muted-foreground italic">
                     {item.notes || 'No notes provided.'}
                  </p>
            </div>

        </CardContent>
         <CardFooter>
             {/* Add action buttons if needed, e.g., Assign, Check In/Out */}
             {item.status === 'In Stock' && <Button variant="accent" disabled>Assign Item</Button>} {/* Disable for now */}
             {item.status === 'Assigned' && <Button variant="secondary" disabled>Check In Item</Button>} {/* Disable for now */}
         </CardFooter>
      </Card>

       {/* Placeholder for History Section */}
      <Card className="w-full max-w-4xl mx-auto mt-6">
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><Info className="w-5 h-5"/> Item History</CardTitle>
            <CardDescription>Log of assignments, status changes, and maintenance.</CardDescription>
        </CardHeader>
         <CardContent>
            <p className="text-sm text-muted-foreground">History tracking coming soon...</p>
            {/* Display history log here */}
         </CardContent>
      </Card>
    </div>
  );
}

    