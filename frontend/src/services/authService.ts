import api from './api';
import type { LoginCredentials, RegisterData, User, StudentData, StudentLoginCredentials } from '../types/auth';

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await api.post('/auth/login', credentials);
  
  // Store token and user info in localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data));
  
  return response.data;
};

export const loginStudent = async (credentials: StudentLoginCredentials): Promise<User> => {
  const response = await api.post('/auth/students/login', credentials);
  
  // Store token and user info in localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data));
  
  return response.data;
};

export const register = async (userData: RegisterData): Promise<User> => {
  const response = await api.post('/auth/register', userData);
  
  // Store token and user info in localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data));
  
  return response.data;
};

// Used only by admins to register new librarians
export const registerLibrarian = async (userData: RegisterData) => {
  // Ensure the role is set to admin
  const librarianData = { ...userData, role: 'admin' };
  
  const response = await api.post('/auth/register', librarianData);
  return response.data;
};

export const getLibrarians = async (): Promise<User[]> => {
  const response = await api.get('/auth/users');
  return response.data;
};

export const deleteLibrarian = async (id: number): Promise<void> => {
  await api.delete(`/auth/librarians/${id}`);
};

// Student-related functions
export const registerStudent = async (studentData: StudentData): Promise<User> => {
  const response = await api.post('/auth/students/register', studentData);
  return response.data;
};

export const getStudents = async (): Promise<User[]> => {
  const response = await api.get('/auth/students');
  return response.data;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await api.delete(`/auth/students/${id}`);
};


export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const getCurrentUser = (): User | null => {
  const userString = localStorage.getItem('user');
  if (!userString) return null;
  
  try {
    return JSON.parse(userString);
  } catch (error) {
    localStorage.removeItem('user');
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};