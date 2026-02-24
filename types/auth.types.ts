export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  userId: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  role: string;
  user: AuthUser;
}
