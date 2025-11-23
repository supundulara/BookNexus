import React, { useState } from 'react';
import { motion } from 'framer-motion';

import type { StudentLoginCredentials } from '../../types/auth';
import { loginStudent } from '../../services/authService';

import toast from 'react-hot-toast';

const StudentLoginForm: React.FC = () => {
  const [formData, setFormData] = useState<StudentLoginCredentials>({
    registrationNumber: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userData = await loginStudent(formData);
      toast.success('Login successful!');
      console.log('Login successful:', userData);
      
      // Manually update localStorage and redirect
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error: unknown) {
      console.error('Login error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || 'Invalid registration number or password';
      toast.error(errorMessage);
      // Don't redirect on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Student Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="registrationNumber" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Registration Number
            </label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                       dark:bg-gray-700 dark:text-white"
              placeholder="Enter your registration number"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                       dark:bg-gray-700 dark:text-white"
              placeholder="Enter your password"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold 
                     py-3 px-6 rounded-lg transition-colors duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default StudentLoginForm;
