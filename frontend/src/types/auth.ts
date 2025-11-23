import { z } from 'zod';

export interface User {
  id: number;
  name: string;
  email: string | null;
  registrationNumber?: string;
  role: 'user' | 'admin' | 'student';
  token?: string;
  faculty?: string;
  courseOfStudy?: string;
  intakeBatch?: string;
  indexNumber?: string;
  title?: string;
  lastName?: string;
  nameWithInitials?: string;
  gender?: string;
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
  faculty: string;
  courseOfStudy: string;
  intakeBatch: string;
  indexNumber: string;
  title: string;
  lastName: string;
  nameWithInitials: string;
  gender: string;
}

export interface StudentLoginCredentials {
  registrationNumber: string;
  password: string;
}

// Add Zod validation schema for profile update
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  currentPassword: z.string().optional().or(z.literal('')),
  newPassword: z.string().optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine(data => {
  const hasCurrentPassword = data.currentPassword && data.currentPassword.trim() !== '';
  const hasNewPassword = data.newPassword && data.newPassword.trim() !== '';
  const hasConfirmPassword = data.confirmPassword && data.confirmPassword.trim() !== '';
  
  // If any password field is filled, all must be filled
  if (hasCurrentPassword || hasNewPassword || hasConfirmPassword) {
    if (!hasCurrentPassword) {
      return false;
    }
    if (!hasNewPassword) {
      return false;
    }
    if (!hasConfirmPassword) {
      return false;
    }
    // Validate new password length
    if (data.newPassword!.length < 6) {
      return false;
    }
    // Confirm password must match
    if (data.newPassword !== data.confirmPassword) {
      return false;
    }
  }
  
  return true;
}, {
  message: "All password fields are required to change password",
  path: ['newPassword'],
});