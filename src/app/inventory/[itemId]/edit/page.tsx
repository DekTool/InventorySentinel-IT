
"use client";

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams, notFound } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock data fetching function (replace with actual data fetching)
async function getItemDetails(itemId: string) {
  console.log("Fetching details for edit:", itemId);
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
   // Format dates for input type="date"
   if (item?.purchaseDate) {
     item.purchaseDate = new Date(item.purchaseDate).toISOString().split('T')[0];
   }
   if (item?.warrantyEndDate) {
     item.warrantyEndDate = new Date(item.warrantyEndDate).toISOString().split('T')[0];
   }
  return item;
}


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  type: z.string().min(1, { message: "Please select an item type." }),
  serialNumber: z.string().optional(),
  barcode: z.string().min(5, { message: "Barcode must be at least 5 characters."}).max(50),
  purchaseDate: z.string().optional(),
  warrantyEndDate: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["In Stock", "Assigned", "Maintenance", "Disposed"]),
  // Add assignedTo field if editable here
});

type ItemFormData = z.infer<typeof formSchema>;

export default function EditInventoryItemPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const itemId = params?.itemId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [itemData, setItemData] = useState<ItemFormData | null>(null);


  const form = useForm<ItemFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { // Set default values initially
      name: "",
      type: "",
      serialNumber: "",
      barcode: "",
      purchaseDate: "",
      warrantyEndDate: "",
      notes: "",
      status: "In Stock",
    },
  });

 useEffect(() => {
    if (!itemId) return;

    const fetchData = async () => {
        setIsLoadingData(true);
        const data = await getItemDetails(itemId);
        if (data) {
            setItemData(data);
            // Reset form with fetched data
            form.reset({
                name: data.name || "",
                type: data.type || "",
                serialNumber: data.serialNumber || "",
                barcode: data.barcode || "",
                purchaseDate: data.purchaseDate || "",
                warrantyEndDate: data.warrantyEndDate || "",
                notes: data.notes || "",
                status: data.status as ItemFormData['status'] || "In Stock",
            });
        } else {
             // Handle item not found - maybe redirect or show error
             toast({ title: "Error", description: "Item not found.", variant: "destructive" });
             router.push('/inventory'); // Redirect back
        }
         setIsLoadingData(false);
    };
     fetchData();
  }, [itemId, form, router, toast]);


  async function onSubmit(values: ItemFormData) {
    setIsSubmitting(true);
    console.log("Form Submitted for Update:", values);
    console.log("Updating item ID:", itemId);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    toast({
      title: "Item Updated Successfully",
      description: `${values.name} (Asset Tag: ${itemId}) has been updated.`,
      variant: "default",
    });

    // Redirect back to the item's detail page
    router.push(`/inventory/${itemId}`);
  }

  if (isLoadingData) {
      return (
          <div className="flex justify-center items-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      );
  }

   if (!itemData) {
     // This should technically be handled by the notFound in useEffect, but as a fallback
     return (
       <div className="flex justify-center items-center min-h-screen p-4 text-destructive">
         Item not found or could not be loaded.
       </div>
     );
   }


  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
             <CardTitle className="text-2xl text-primary">Edit Item: {itemData?.name}</CardTitle>
              <Link href={`/inventory/${itemId}`} passHref>
                <Button variant="ghost" size="sm">
                   <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
                 </Button>
               </Link>
          </div>
           <FormDescription>Asset Tag: {itemId}</FormDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Laptop Pro 15, Wireless Mouse X" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

             <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select item type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="Laptop">Laptop</SelectItem>
                          <SelectItem value="Desktop">Desktop</SelectItem>
                          <SelectItem value="Monitor">Monitor</SelectItem>
                          <SelectItem value="Mobile Phone">Mobile Phone</SelectItem>
                          <SelectItem value="Tablet">Tablet</SelectItem>
                          <SelectItem value="Keyboard">Keyboard</SelectItem>
                          <SelectItem value="Mouse">Mouse</SelectItem>
                          <SelectItem value="Docking Station">Docking Station</SelectItem>
                          <SelectItem value="Printer">Printer</SelectItem>
                          <SelectItem value="Server">Server</SelectItem>
                          <SelectItem value="Networking">Networking</SelectItem>
                           <SelectItem value="Storage">Storage</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode / Identifier</FormLabel>
                    <FormControl>
                      <Input placeholder="Scan or enter barcode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter serial number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="In Stock">In Stock</SelectItem>
                          <SelectItem value="Assigned">Assigned</SelectItem>
                           <SelectItem value="Maintenance">Maintenance</SelectItem>
                           <SelectItem value="Disposed">Disposed</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Optional fields */}
               <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="warrantyEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty End Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional details about the item..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
         <CardFooter className="flex justify-end">
            <Link href={`/inventory/${itemId}`} passHref>
                 <Button type="button" variant="outline" disabled={isSubmitting} className="mr-2">
                    Cancel
                 </Button>
            </Link>
            <Button type="submit" form="edit-item-form" disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


