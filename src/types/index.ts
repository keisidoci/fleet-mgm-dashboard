export type UserRole = "admin" | "fleet_manager" | "driver";

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  email: string;
}

// User without password (for storage and state)
export type StoredUser = Omit<User, "password">;

export interface AuthState {
  user: StoredUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Permission {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
}
