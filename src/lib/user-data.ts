
import type { User, UserRole } from '@/types/user';
import { getInventoryItemsByUserId } from './inventory-data'; // For updating assignedItems count

let mockUsers: User[] = [
  { id: 'USR-006', name: 'Admin User', email: 'admin@admin.com', department: 'Administración', phone: '000-000-0000', joinDate: '2024-01-01', assignedItems: 0, role: 'Administrador', password: 'admin' },
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
  
  // Ensure new IDs are unique even if we manually reduced the list
  let nextIdNumber = 1;
  if (mockUsers.length > 0) {
    const existingIds = mockUsers.map(u => parseInt(u.id.split('-')[1]));
    nextIdNumber = Math.max(...existingIds, 0) + 1;
  }
  const newId = `USR-${String(nextIdNumber).padStart(3, '0')}`;

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

