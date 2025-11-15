import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import { getMyCheckouts } from '../services/bookService';
import type { Checkout } from '../types/books';
import toast from 'react-hot-toast';
import { BookOpenIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

const MyBooksPage: React.FC = () => {
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCheckouts = async () => {
    try {
      const data = await getMyCheckouts();
      setCheckouts(data);
    } catch {
      toast.error('Failed to fetch your borrowed books');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckouts();
  }, []);

  const calculateDaysAgo = (date: string) => {
    const now = new Date();
    const checkoutDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - checkoutDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <MainLayout>
      <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Borrowed Books
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View all books you have currently borrowed from the library
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
        </div>
      ) : checkouts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          <BookOpenIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 dark:text-gray-400">
            You haven't borrowed any books yet
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checkouts.map((checkout) => (
            <motion.div
              key={checkout.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              {checkout.Book?.imageUrl && (
                <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${checkout.Book.imageUrl}`}
                    alt={checkout.Book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {checkout.Book?.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  by {checkout.Book?.author}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span>ISBN: {checkout.Book?.isbn}</span>
                  </div>
                  
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    <span>Borrowed {calculateDaysAgo(checkout.checkedOutAt)}</span>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Checked out on: {new Date(checkout.checkedOutAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {checkouts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <p className="text-blue-800 dark:text-blue-200">
            <strong>Total books borrowed:</strong> {checkouts.length}
          </p>
        </motion.div>
      )}
      </div>
    </MainLayout>
  );
};

export default MyBooksPage;
