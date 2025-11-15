import { z } from 'zod';

export interface User {
  id: number;
  name: string;
  email: string | null;
  registrationNumber?: string;
  role: 'user' | 'admin' | 'student';
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string; // Adding optional role property
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Add the missing ProfileFormData interface
export interface ProfileFormData {
  name: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface LibrarianData {
  name: string;
  email: string;
  password: string;
  role: 'admin';
}

export interface StudentData {
  name: string;
  registrationNumber: string;
  password: string;
}

export interface StudentLoginCredentials {
  registrationNumber: string;
  password: string;
}

// Add Zod validation schema for profile update
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .optional()
    .refine(val => !val || /[A-Z]/.test(val), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine(val => !val || /[0-9]/.test(val), {
      message: 'Password must contain at least one number',
    }),
  confirmPassword: z.string().optional(),
}).refine(data => {
  // If new password is provided, confirm password must match
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  
  // If new password is provided, current password is required
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  
  return true;
}, {
  message: "Passwords don't match or current password is required",
  path: ['confirmPassword'],
});