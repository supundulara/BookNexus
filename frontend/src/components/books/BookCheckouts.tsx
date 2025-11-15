import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getBookCheckouts, getBookCheckoutHistory } from '../../services/bookService';
import type { Checkout } from '../../types/books';
import toast from 'react-hot-toast';
import { UserIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface BookCheckoutsProps {
  bookId: number;
}

const BookCheckouts: React.FC<BookCheckoutsProps> = ({ bookId }) => {
  const [activeCheckouts, setActiveCheckouts] = useState<Checkout[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [checkoutHistory, setCheckoutHistory] = useState<Checkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActiveCheckouts = useCallback(async () => {
    try {
      const data = await getBookCheckouts(bookId);
      setActiveCheckouts(data);
    } catch {
      toast.error('Failed to fetch checkout information');
    } finally {
      setIsLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    fetchActiveCheckouts();
  }, [fetchActiveCheckouts]);

  const fetchCheckoutHistory = async () => {
    try {
      const data = await getBookCheckoutHistory(bookId);
      setCheckoutHistory(data);
      setShowHistory(true);
    } catch {
      toast.error('Failed to fetch checkout history');
    }
  };

  const calculateDaysAgo = (date: string) => {
    const now = new Date();
    const checkoutDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - checkoutDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Checkout Information
      </h3>

      {activeCheckouts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No active checkouts for this book
        </p>
      ) : (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Currently Borrowed By:</h4>
          {activeCheckouts.map((checkout) => (
            <motion.div
              key={checkout.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {checkout.User?.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Reg. No: {checkout.User?.registrationNumber}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{calculateDaysAgo(checkout.checkedOutAt)}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {new Date(checkout.checkedOutAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={fetchCheckoutHistory}
          className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 
                   dark:hover:text-emerald-300 font-medium text-sm"
        >
          {showHistory ? 'Hide History' : 'View Full Checkout History'}
        </button>
      </div>

      {showHistory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Full History:</h4>
          {checkoutHistory.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No checkout history</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {checkoutHistory.map((checkout) => (
                <div
                  key={checkout.id}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                >
                  <div className="flex items-center space-x-2">
                    {checkout.returnedAt ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ClockIcon className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="text-gray-900 dark:text-white">
                      {checkout.User?.name} ({checkout.User?.registrationNumber})
                    </span>
                  </div>
                  <div className="text-right text-xs text-gray-600 dark:text-gray-400">
                    <div>{new Date(checkout.checkedOutAt).toLocaleDateString()}</div>
                    {checkout.returnedAt && (
                      <div className="text-green-600 dark:text-green-400">
                        Returned: {new Date(checkout.returnedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default BookCheckouts;
