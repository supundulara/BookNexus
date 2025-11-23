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
    faculty: '',
    courseOfStudy: '',
    intakeBatch: '',
    indexNumber: '',
    title: '',
    lastName: '',
    nameWithInitials: '',
    gender: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        faculty: '',
        courseOfStudy: '',
        intakeBatch: '',
        indexNumber: '',
        title: '',
        lastName: '',
        nameWithInitials: '',
        gender: '',
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Faculty
          </label>
          <input
            type="text"
            id="faculty"
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     dark:bg-gray-700 dark:text-white"
            placeholder="e.g., Faculty of Science"
          />
        </div>

        <div>
          <label htmlFor="courseOfStudy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Course of Study
          </label>
          <input
            type="text"
            id="courseOfStudy"
            name="courseOfStudy"
            value={formData.courseOfStudy}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     dark:bg-gray-700 dark:text-white"
            placeholder="e.g., Physical Science"
          />
        </div>

        <div>
          <label htmlFor="intakeBatch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Intake Batch
          </label>
          <input
            type="text"
            id="intakeBatch"
            name="intakeBatch"
            value={formData.intakeBatch}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     dark:bg-gray-700 dark:text-white"
            placeholder="e.g., 2021/2022"
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
            placeholder="e.g., EU/IS/2021/PHY/000"
          />
        </div>

        <div>
          <label htmlFor="indexNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Index Number
          </label>
          <input
            type="text"
            id="indexNumber"
            name="indexNumber"
            value={formData.indexNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     dark:bg-gray-700 dark:text-white"
            placeholder="e.g., PS0000"
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <select
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Title</option>
            <option value="Mr.">Mr.</option>
            <option value="Ms.">Ms.</option>
            <option value="Mrs.">Mrs.</option>
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
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
         
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     dark:bg-gray-700 dark:text-white"
           
          />
        </div>

        <div>
          <label htmlFor="nameWithInitials" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name with Initials
          </label>
          <input
            type="text"
            id="nameWithInitials"
            name="nameWithInitials"
            value={formData.nameWithInitials}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     dark:bg-gray-700 dark:text-white"
       
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
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
