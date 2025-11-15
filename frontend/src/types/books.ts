export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  imageUrl?: string;
  subject: string;
  researchArea: string;
  location: string;
  totalCopies: number;
  availableCopies: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookSummary {
  summary: string;
}

export interface BookSearchParams {
  query?: string;
  subject?: string;
  researchArea?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  imageUrl?: string;
  subject: string;
  researchArea: string;
  location: string;
  totalCopies: number;
  availableCopies: number;
  description?: string;
}

export interface Checkout {
  id: number;
  userId: number;
  bookId: number;
  checkedOutAt: string;
  returnedAt?: string;
  Book?: Book;
  User?: {
    id: number;
    name: string;
    registrationNumber?: string;
  };
}