import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import type { StudentData } from '../../types/auth';
import { registerStudent } from '../../services/authService';

interface StudentRegisterFormProps {
  onSuccess?: () => void;
}

const StudentRegisterForm: React.FC<StudentRegisterFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<StudentData>({
    name: '',
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
      await registerStudent(formData);
      toast.success('Student registered successfully!');
      setFormData({
        name: '',
        registrationNumber: '',
        password: '',
      });
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register student');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Register New Student
      </h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Student Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                   dark:bg-gray-700 dark:text-white"
          placeholder="Enter student name"
        />
      </div>

      <div>
        <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
          placeholder="Enter registration number"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                   dark:bg-gray-700 dark:text-white"
          placeholder="Enter password"
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
        {isLoading ? 'Registering...' : 'Register Student'}
      </motion.button>
    </motion.form>
  );
};

export default StudentRegisterForm;
