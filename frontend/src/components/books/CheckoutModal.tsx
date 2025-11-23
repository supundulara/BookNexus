import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (registrationNumber: string) => Promise<void>;
  bookTitle: string;
  modalTitle?: string;
  actionText?: string;
  isReturn?: boolean;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  onCheckout, 
  bookTitle,
  modalTitle,
  actionText,
  isReturn = false
}) => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registrationNumber.trim()) {
      toast.error('Please enter a registration number');
      return;
    }

    setIsLoading(true);
    try {
      await onCheckout(registrationNumber);
      setRegistrationNumber('');
      onClose();
    } catch {
      // Error handling is done in parent
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {modalTitle || (isReturn ? 'Return Book' : 'Checkout Book')}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Enter the student's registration number to {isReturn ? 'return' : 'checkout'} "{bookTitle}"
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label 
                    htmlFor="registrationNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Student Registration Number
                  </label>
                  <input
                    type="text"
                    id="registrationNumber"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                             dark:bg-gray-700 dark:text-white"
                    placeholder="Enter registration number"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 
                             text-gray-700 dark:text-gray-200 rounded-lg 
                             hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 
                             text-white rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : (actionText || (isReturn ? 'Return' : 'Checkout'))}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
