
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Search, Package } from "lucide-react";
import Link from 'next/link';

// Mock data for demonstration
const users = [
  { id: 'USR-001', name: 'Alice Smith', email: 'asmith@example.com', department: 'Engineering', assignedItems: 2 },
  { id: 'USR-002', name: 'Bob Johnson', email: 'bjohnson@example.com', department: 'Marketing', assignedItems: 1 },
  { id: 'USR-003', name: 'Charlie Brown', email: 'cbrown@example.com', department: 'Sales', assignedItems: 0 },
  { id: 'USR-004', name: 'Diana Prince', email: 'dprince@example.com', department: 'HR', assignedItems: 1 },
  { id: 'USR-005', name: 'Ethan Hunt', email: 'ehunt@example.com', department: 'IT', assignedItems: 5 },
];

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

export default function UsersPage() {
  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary">User Management</h1>
         {/* Add User button if needed later
         <Link href="/users/add" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </Link>
        */}
      </header>

      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Search by Name, Email, Department..."
          className="max-w-sm"
        />
         <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
             <span className="sr-only">Search</span>
         </Button>
      </div>

      <div className="flex-1 overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Assigned Items</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                 <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                         {/* Placeholder image, replace with actual user images if available */}
                        <AvatarImage src={`https://i.pravatar.cc/40?u=${user.email}`} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                 <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Package className="w-4 h-4"/>
                        {user.assignedItems}
                    </div>
                </TableCell>
                <TableCell>
                   <Link href={`/users/${user.id}`} passHref>
                     <Button variant="ghost" size="sm">View Details</Button>
                   </Link>
                </TableCell>
              </TableRow>
            ))}
             {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
