
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Mail, Building, Package, Download, AlertTriangle } from "lucide-react";
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Mock data fetching functions (replace with actual data fetching)
async function getUserDetails(userId: string) {
  console.log("Fetching user details for:", userId);
  await new Promise(resolve => setTimeout(resolve, 50));
  const users = [
    { id: 'USR-001', name: 'Alice Smith', email: 'asmith@example.com', department: 'Engineering', phone: '123-456-7890', joinDate: '2022-03-01' },
    { id: 'USR-002', name: 'Bob Johnson', email: 'bjohnson@example.com', department: 'Marketing', phone: '987-654-3210', joinDate: '2021-08-15' },
    { id: 'USR-003', name: 'Charlie Brown', email: 'cbrown@example.com', department: 'Sales', phone: '555-123-4567', joinDate: '2023-01-10' },
    { id: 'USR-004', name: 'Diana Prince', email: 'dprince@example.com', department: 'HR', phone: '111-222-3333', joinDate: '2020-05-20' },
    { id: 'USR-005', name: 'Ethan Hunt', email: 'ehunt@example.com', department: 'IT', phone: '777-888-9999', joinDate: '2019-11-11' },
  ];
  return users.find(u => u.id === userId);
}

async function getUserAssignedItems(userId: string) {
   console.log("Fetching assigned items for:", userId);
   await new Promise(resolve => setTimeout(resolve, 100));
   const allItems = [
     { id: 'ASSET-001', name: 'Laptop Pro 15"', type: 'Laptop', status: 'Assigned', assignedToId: 'USR-001', barcode: '123456789012', assignmentDate: '2023-01-20' },
     { id: 'ASSET-003', name: 'Docking Station Z', type: 'Docking Station', status: 'Assigned', assignedToId: 'USR-002', barcode: '112233445566', assignmentDate: '2022-11-05' },
     { id: 'ASSET-005', name: 'Monitor 27" 4K', type: 'Monitor', status: 'Assigned', assignedToId: 'USR-001', barcode: '334455667788', assignmentDate: '2023-08-10' },
     { id: 'ASSET-006', name: 'Keyboard K1', type: 'Keyboard', status: 'Assigned', assignedToId: 'USR-004', barcode: 'KB001', assignmentDate: '2021-06-01' },
     { id: 'ASSET-007', name: 'Dev Laptop X', type: 'Laptop', status: 'Assigned', assignedToId: 'USR-005', barcode: 'DEVLP01', assignmentDate: '2020-01-15' },
     { id: 'ASSET-008', name: 'Server Rack R1', type: 'Server', status: 'Assigned', assignedToId: 'USR-005', barcode: 'SRVR01', assignmentDate: '2020-01-15' },
     { id: 'ASSET-009', name: 'Network Switch S1', type: 'Networking', status: 'Assigned', assignedToId: 'USR-005', barcode: 'NETSW01', assignmentDate: '2020-01-15' },
     { id: 'ASSET-010', name: 'Firewall F1', type: 'Networking', status: 'Assigned', assignedToId: 'USR-005', barcode: 'FIREW01', assignmentDate: '2020-01-15' },
     { id: 'ASSET-011', name: 'Backup Drive B1', type: 'Storage', status: 'Assigned', assignedToId: 'USR-005', barcode: 'BKDRV01', assignmentDate: '2020-01-15' },
   ];
   return allItems.filter(item => item.assignedToId === userId);
}


const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

export default async function UserDetailsPage({ params }: { params: { userId: string } }) {
  const [user, assignedItems] = await Promise.all([
    getUserDetails(params.userId),
    getUserAssignedItems(params.userId)
  ]);

  if (!user) {
    notFound();
  }

  const handleGenerateReturnForm = () => {
      // In a real app, this would:
      // 1. Collect item conditions (maybe open a modal).
      // 2. Generate a PDF or document.
      // 3. Potentially trigger an email to HR.
      alert(`Generating return form for ${user.name}...\nThis would typically include a list of items (${assignedItems.length}) and fields for condition assessment before sending to HR.`);
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
       <div className="mb-6 flex justify-between items-center">
         <Link href="/users" passHref>
             <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
             </Button>
        </Link>
        {assignedItems.length > 0 && (
             <Button variant="destructive" onClick={handleGenerateReturnForm}>
                 <Download className="mr-2 h-4 w-4" /> Generate Return Form
             </Button>
         )}
       </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Info Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
              <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl text-primary">{user.name}</CardTitle>
             <CardDescription>{user.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Separator />
             <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground"/>
                <span>{user.email}</span>
             </div>
             <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground"/>
                <span>{user.department}</span>
             </div>
             <div className="flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-muted-foreground"><path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5A1.5 1.5 0 0 1 16.5 18h-13A1.5 1.5 0 0 1 2 16.5v-13Z" /></svg>
                <span>{user.phone || 'N/A'}</span>
             </div>
             <Separator />
             <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Joined: {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</span>
             </div>
          </CardContent>
           <CardFooter>
              {/* Add Edit User button if needed */}
               <Button variant="outline" className="w-full" disabled>
                 <Edit className="mr-2 h-4 w-4" /> Edit User (Not Implemented)
               </Button>
           </CardFooter>
        </Card>

        {/* Assigned Items Card */}
        <Card className="md:col-span-2">
           <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Package className="w-5 h-5"/> Assigned Equipment ({assignedItems.length})
                 </CardTitle>
                <CardDescription>List of IT assets currently assigned to {user.name}.</CardDescription>
           </CardHeader>
           <CardContent>
                {assignedItems.length > 0 ? (
                     <div className="overflow-auto max-h-[400px] rounded-md border"> {/* Added scroll */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Asset Tag</TableHead>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Assigned On</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignedItems.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                             <Link href={`/inventory/${item.id}`} className="hover:underline text-primary">
                                                 {item.id}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>{item.assignmentDate ? new Date(item.assignmentDate).toLocaleDateString() : 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                     <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-md text-center">
                        <Package className="w-10 h-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No equipment currently assigned to this user.</p>
                         <Button variant="link" className="mt-2">Assign New Item</Button>
                    </div>
                )}
           </CardContent>
           <CardFooter>
               <p className="text-xs text-muted-foreground italic">Based on signed equipment responsibility forms.</p>
           </CardFooter>
        </Card>
      </div>

       {/* Placeholder for User Activity/History */}
       <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl">User Activity Log</CardTitle>
             <CardDescription>History of assignments, returns, and system interactions.</CardDescription>
          </CardHeader>
           <CardContent>
              <p className="text-sm text-muted-foreground">User activity logging coming soon...</p>
           </CardContent>
        </Card>

    </div>
  );
}
