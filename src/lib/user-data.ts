
import type { User, UserRole } from '@/types/user';
import { getInventoryItemsByUserId } from './inventory-data'; // For updating assignedItems count

let mockUsers: User[] = [
  { id: 'USR-001', name: 'Alice Smith', email: 'admin@example.com', department: 'Ingeniería', phone: '123-456-7890', joinDate: '2022-03-01', assignedItems: 2, role: 'Administrador', password: 'adminpassword' },
  { id: 'USR-002', name: 'Bob Johnson', email: 'tecnico@example.com', department: 'Marketing', phone: '987-654-3210', joinDate: '2021-08-15', assignedItems: 1, role: 'Tecnico', password: 'tecnicopassword' },
  { id: 'USR-003', name: 'Charlie Brown', email: 'usuario@example.com', department: 'Ventas', phone: '555-123-4567', joinDate: '2023-01-10', assignedItems: 0, role: 'Usuario', password: 'usuariopassword' },
  { id: 'USR-004', name: 'Diana Prince', email: 'dprince@example.com', department: 'RRHH', phone: '111-222-3333', joinDate: '2020-05-20', assignedItems: 1, role: 'Usuario', password: 'password123' },
  { id: 'USR-005', name: 'Ethan Hunt', email: 'ehunt@example.com', department: 'IT', phone: '777-888-9999', joinDate: '2019-11-11', assignedItems: 5, role: 'Tecnico', password: 'password123' },
];

export const userRoles: UserRole[] = ["Administrador", "Tecnico", "Usuario"];

// MOCKED_CURRENT_USER_ROLE is removed as role will come from logged-in user via useAuth hook.

export async function getAllUsers(): Promise<User[]> {
  console.log("Fetching all users (mock)");
  await new Promise(resolve => setTimeout(resolve, 50));
  return [...mockUsers];
}

export async function getUserById(id: string): Promise<User | undefined> {
  console.log(`Fetching user by ID: ${id} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 50));
  const user = mockUsers.find(u => u.id === id);
  return user ? { ...user } : undefined;
}

export async function addUser(userData: Omit<User, 'id' | 'assignedItems'>): Promise<User> {
  console.log("Adding new user (mock):", userData);
  await new Promise(resolve => setTimeout(resolve, 100));
  const newId = `USR-${String(mockUsers.length + 1).padStart(3, '0')}`;
  const newUser: User = {
    id: newId,
    ...userData,
    assignedItems: 0, 
  };
  mockUsers.push(newUser);
  return { ...newUser };
}

export async function updateUser(id: string, userUpdateData: Partial<Omit<User, 'id' | 'assignedItems'>>): Promise<User | null> {
  console.log(`Updating user ID: ${id} (mock) with data:`, userUpdateData);
  await new Promise(resolve => setTimeout(resolve, 100));
  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userUpdateData };
    return { ...mockUsers[userIndex] };
  }
  return null;
}

export async function deleteUser(id: string): Promise<boolean> {
  console.log(`Deleting user ID: ${id} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 100));
  const initialLength = mockUsers.length;
  mockUsers = mockUsers.filter(u => u.id !== id);
  return mockUsers.length < initialLength;
}

export async function updateUserAssignedItemsCount(userId: string) {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        const items = await getInventoryItemsByUserId(userId);
        mockUsers[userIndex].assignedItems = items.length;
        console.log(`Updated assigned items count for user ${userId} to ${items.length}`);
    }
}
