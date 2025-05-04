
"use client";

import { useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { Loader2, Upload } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  type: z.string().min(1, { message: "Please select an item type." }),
  serialNumber: z.string().optional(),
  barcode: z.string().min(5, { message: "Barcode must be at least 5 characters."}).max(50),
  purchaseDate: z.string().optional(), // Consider using a date picker component later
  warrantyEndDate: z.string().optional(), // Consider using a date picker component later
  notes: z.string().optional(),
  status: z.enum(["In Stock", "Assigned", "Maintenance", "Disposed"]),
});

export default function AddInventoryItemPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      serialNumber: "",
      barcode: "", // Maybe generate this later?
      purchaseDate: "",
      warrantyEndDate: "",
      notes: "",
      status: "In Stock",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log("Form Submitted:", values);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate asset tag generation (replace with actual logic)
    const generatedAssetTag = `ASSET-${Math.floor(1000 + Math.random() * 9000)}`;
    console.log("Generated Asset Tag:", generatedAssetTag);

    setIsSubmitting(false);

    toast({
      title: "Item Added Successfully",
      description: `Asset Tag ${generatedAssetTag} created for ${values.name}.`,
      variant: "default", // Use 'default' which maps to green in our theme
    });

    // Redirect to inventory page or the new item's detail page
    router.push('/inventory');
    // router.push(`/inventory/${generatedAssetTag}`); // Option to redirect to detail page
  }

  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Add New Inventory Item</CardTitle>
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
                     <FormDescription>
                      This will be used for scanning. An Asset Tag will be generated upon saving.
                    </FormDescription>
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
                    <FormLabel>Initial Status</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select initial status" />
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

              {/* Add optional fields like Purchase Date, Warranty End Date */}
               <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date (Optional)</FormLabel>
                    <FormControl>
                       {/* Basic input for now, replace with Calendar later if needed */}
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
                       {/* Basic input for now, replace with Calendar later if needed */}
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

              {/* Placeholder for file upload if needed later
              <FormItem>
                <FormLabel>Upload Document/Image (Optional)</FormLabel>
                <FormControl>
                  <Button variant="outline" type="button" className="w-full justify-start">
                     <Upload className="mr-2 h-4 w-4" /> Upload File
                  </Button>
                </FormControl>
                 <FormDescription>
                    Upload receipts, assignment forms, etc.
                 </FormDescription>
              </FormItem>
              */}

            </form>
          </Form>
        </CardContent>
         <CardFooter className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting} className="mr-2">
                Cancel
            </Button>
            <Button type="submit" form="add-item-form" disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Item & Generate Tag'
              )}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
