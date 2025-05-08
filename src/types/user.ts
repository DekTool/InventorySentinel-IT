
export interface User {
  id: string; // e.g., USR-001
  name: string;
  email: string;
  department: string;
  phone?: string | null;
  joinDate?: string | null; // YYYY-MM-DD
  assignedItems: number; // Count of items assigned to this user
}
