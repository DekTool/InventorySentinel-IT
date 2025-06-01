
export type UserRole = "Administrador" | "Tecnico" | "Usuario";

export interface User {
  id: string; // e.g., USR-001
  name: string;
  email: string;
  department: string;
  phone?: string | null;
  joinDate?: string | null; // YYYY-MM-DD
  assignedItems: number; // Count of items assigned to this user
  role: UserRole;
  password?: string; // Placeholder for password, NOT FOR SECURE STORAGE in this version
}

