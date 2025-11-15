import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import SearchPage from './pages/SearchPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminBooksPage from './pages/AdminBooksPage';
import BookFormPage from './pages/BookFormPage';
import NotFoundPage from './pages/NotFoundPage';
import LibrarianManagementPage from './pages/LibrarianManagementPage';
import StudentManagementPage from './pages/StudentManagementPage';
import StudentLoginPage from './pages/StudentLoginPage';
import MyBooksPage from './pages/MyBooksPage';


// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/student-login" element={<StudentLoginPage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              
              {/* Protected routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              {/* Student routes */}
              <Route path="/my-books" element={
                <ProtectedRoute>
                  <MyBooksPage />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin/students" element={
                <AdminRoute>
                  <StudentManagementPage />
                </AdminRoute>
              } />
              <Route path="/admin/librarians" element={
                <AdminRoute>
                  <LibrarianManagementPage />
                </AdminRoute>
              } />
              <Route path="/admin/dashboard" element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              } />
              <Route path="/admin/books" element={
                <AdminRoute>
                  <AdminBooksPage />
                </AdminRoute>
              } />
              <Route path="/admin/books/new" element={
                <AdminRoute>
                  <BookFormPage />
                </AdminRoute>
              } />
              <Route path="/admin/books/edit/:id" element={
                <AdminRoute>
                  <BookFormPage />
                </AdminRoute>
              } />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;