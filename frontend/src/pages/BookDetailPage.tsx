import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CheckoutModal from '../components/books/CheckoutModal';
import BookCheckouts from '../components/books/BookCheckouts';
import { getBookById, getBookSummary, checkoutBook, returnBook, deleteBook } from '../services/bookService';
import { useAuth } from '../contexts/AuthContext';
import { BookCover } from '../utils/imageUtils';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  BookOpenIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  BookmarkIcon,
  MapPinIcon,
  DocumentTextIcon,
  IdentificationIcon,
  AcademicCapIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showSummary, setShowSummary] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  
  const { data: book, isLoading, error, refetch } = useQuery({
    queryKey: ['book', id],
    queryFn: () => getBookById(Number(id)),
    enabled: !!id,
  });
  
  const { data: summary, isLoading: isSummaryLoading, isError: isSummaryError } = useQuery({
    queryKey: ['bookSummary', id],
    queryFn: () => getBookSummary(Number(id)),
    enabled: !!id && showSummary,
  });

  const handleCheckout = async (registrationNumber: string) => {
    if (!book) return;
    
    try {
      await checkoutBook(book.id, registrationNumber);
      refetch();
      toast.success('Book checked out successfully');
    } catch {
      toast.error('Failed to checkout book');
    }
  };

  const handleReturn = async (registrationNumber: string) => {
    if (!book) return;
    
    try {
      await returnBook(book.id, registrationNumber);
      refetch();
      toast.success('Book returned successfully');
    } catch {
      toast.error('Failed to return book');
    }
  };

  const handleDelete = async () => {
    if (!book) return;
    
    try {
      await deleteBook(book.id);
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book deleted successfully');
      navigate('/books');
    } catch (error) {
      toast.error('Failed to delete book');
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Loading book details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !book) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Error Loading Book</h3>
            <p>We couldn't retrieve the book details. Please try again later.</p>
          </div>
          <div className="mt-6">
            <Link 
              to="/books" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Books
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <Link 
            to="/books" 
            className="inline-flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Books
          </Link>
          
          {user?.role === 'admin' && (
            <div className="flex items-center space-x-3">
              <Link 
                to={`/admin/books/edit/${book.id}`} 
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </Link>
              <button 
                onClick={() => setShowDeleteModal(true)} 
                className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-700 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        >
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            {/* Book Cover and Actions */}
            <div className="md:w-1/3 flex flex-col">
              <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-lg relative group">
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 z-10"></div>
                <BookCover
                  src={book.imageUrl}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
                
                <div className="absolute bottom-3 left-3 z-20">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-md ${
                    book.availableCopies > 0 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              
              {user && user.role === 'admin' && (
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    disabled={book.availableCopies === 0}
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    Check Out Book
                  </button>
                  <button
                    onClick={() => setShowReturnModal(true)}
                    disabled={book.availableCopies === book.totalCopies}
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                    Return Book
                  </button>
                </div>
              )}

              {/* Book Quick Info Card */}
              <div className="mt-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 shadow-sm">
                <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-3">Quick Info</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <IdentificationIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">ISBN:</span>
                      <span className="text-gray-900 dark:text-white">{book.isbn}</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <MapPinIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">Location:</span>
                      <span className="text-gray-900 dark:text-white">{book.location}</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ArchiveBoxIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">Copies:</span>
                      <span className="text-gray-900 dark:text-white">{book.availableCopies} of {book.totalCopies} available</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Book Details */}
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{book.title}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-5 flex items-center">
                by <span className="font-medium ml-1">{book.author}</span>
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                  <BookmarkIcon className="h-4 w-4 mr-1" />
                  {book.subject}
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300">
                  <AcademicCapIcon className="h-4 w-4 mr-1" />
                  {book.researchArea}
                </div>
              </div>
              
              {book.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Description
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{book.description}</p>
                  </div>
                </div>
              )}
              
              <div>
                <button
                  onClick={() => setShowSummary(!showSummary)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <BookOpenIcon className="h-5 w-5 mr-2" />
                  {showSummary ? 'Hide AI Summary' : 'Show AI Summary'}
                </button>
                
                <AnimatePresence>
                  {showSummary && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-5 rounded-lg border border-blue-100 dark:border-blue-800/50 shadow-sm">
                        {isSummaryLoading ? (
                          <div className="flex justify-center items-center py-8">
                            <div className="relative">
                              <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                              <div className="h-12 w-12 rounded-full border-r-2 border-l-2 border-purple-500 animate-spin absolute top-0 left-0" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                            </div>
                            <span className="ml-4 text-gray-600 dark:text-gray-400">
                              Generating AI summary...
                            </span>
                          </div>
                        ) : isSummaryError ? (
                          <div className="py-4 text-center">
                            <p className="text-red-600 dark:text-red-400 mb-2">
                              Failed to generate summary.
                            </p>
                            <button 
                              onClick={() => queryClient.invalidateQueries({ queryKey: ['bookSummary', id] })}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Try again
                            </button>
                          </div>
                        ) : (
                          <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                              <span className="mr-2 text-blue-600 dark:text-blue-400">AI</span> 
                              Summary
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{summary?.summary}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Checkout Information for Admins */}
      {user?.role === 'admin' && (
        <BookCheckouts bookId={Number(id)} />
      )}

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onCheckout={handleCheckout}
        bookTitle={book.title}
      />

      {/* Return Modal - Similar to Checkout Modal */}
      <CheckoutModal 
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onCheckout={handleReturn}
        bookTitle={book.title}
        isReturn={true}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Delete Book</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{book.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default BookDetailPage;