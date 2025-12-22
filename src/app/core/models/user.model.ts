export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt: string;
  lastLoginAt: string;
  profilePicture: string;
  roles: string[];
}



// ==========================
// AUTH: Servicios de autenticación
// ==========================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    success: boolean;
    requires2FA?: boolean;
    tempToken?: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  dateofBirth: string; 
  gender: number;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: any;
}


// ==========================
// GÉNERICO: Modelos genéricos
// ==========================

export enum Gender {
  MALE = 1,
  FEMALE = 2,
  OTHER = 3
}

export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User'
}

export interface GenderOption {
  label: string;
  value: number;
}
