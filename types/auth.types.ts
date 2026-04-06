// types/auth.types.ts
export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  userId?: string; // optional (backward compatibility)
  email: string;
  role: string;
  name?: string;
  lastLogin?: Date | string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  role: string;
  user: AuthUser;
}

// ✅ AuthState interface export করুন
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
