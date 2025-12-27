import type { User } from "../types";

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    email: 'admin@fleet.com',
  },
  {
    id: '2',
    username: 'manager',
    password: 'manager123',
    role: 'fleet_manager',
    name: 'Fleet Manager',
    email: 'manager@fleet.com',
  },
  {
    id: '3',
    username: 'driver',
    password: 'driver123',
    role: 'driver',
    name: 'Driver User',
    email: 'driver@fleet.com',
  },
];

export const authenticateUser = (username: string, password: string): User | null => {
  const user = mockUsers.find(
    (u) => u.username === username && u.password === password
  );
  return user || null;
};

