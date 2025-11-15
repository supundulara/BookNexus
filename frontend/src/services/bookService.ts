import api from './api';
import type { Book,  BookSearchParams, BookSummary, Checkout } from '../types/books';

export const getBooks = async (): Promise<Book[]> => {
  const response = await api.get('/books');
  return response.data;
};

export const getBookById = async (id: number): Promise<Book> => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const searchBooks = async (params: BookSearchParams): Promise<Book[]> => {
  const response = await api.get('/books/search', { params });
  return response.data;
};

export const searchBooksWithAI = async (query: string): Promise<Book[]> => {
  const response = await api.get('/books/ai-search', { params: { query } });
  return response.data.books;
};

export const getBookSummary = async (id: number): Promise<BookSummary> => {
  const response = await api.get(`/books/${id}/summary`);
  return response.data;
};

// Create book (update to handle FormData)
export const createBook = async (data: FormData): Promise<Book> => {
  const response = await api.post('/books', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update book (update to handle FormData)
export const updateBook = async (id: number, data: FormData): Promise<Book> => {
  const response = await api.put(`/books/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteBook = async (id: number): Promise<void> => {
  await api.delete(`/books/${id}`);
};

export const checkoutBook = async (id: number, registrationNumber: string): Promise<Book> => {
  const response = await api.post(`/books/${id}/checkout`, { registrationNumber });
  return response.data.book;
};

export const returnBook = async (id: number, registrationNumber: string): Promise<Book> => {
  const response = await api.put(`/books/${id}/return`, { registrationNumber });
  return response.data.book;
};

// Get student's borrowed books
export const getMyCheckouts = async (): Promise<Checkout[]> => {
  const response = await api.get('/books/my-checkouts');
  return response.data;
};

// Get checkouts for a specific book (admin only)
export const getBookCheckouts = async (id: number): Promise<Checkout[]> => {
  const response = await api.get(`/books/${id}/checkouts`);
  return response.data;
};

// Get full checkout history for a book (admin only)
export const getBookCheckoutHistory = async (id: number): Promise<Checkout[]> => {
  const response = await api.get(`/books/${id}/checkout-history`);
  return response.data;
};