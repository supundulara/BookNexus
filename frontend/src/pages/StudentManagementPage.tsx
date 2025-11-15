import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import StudentRegisterForm from '../components/auth/StudentRegisterForm';
import { getStudents, deleteStudent } from '../services/authService';
import type { User } from '../types/auth';
import toast from 'react-hot-toast';
import { TrashIcon } from '@heroicons/react/24/outline';

const StudentManagementPage: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch {
      toast.error('Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete student "${name}"?`)) {
      try {
        await deleteStudent(id);
        toast.success('Student deleted successfully');
        fetchStudents();
      } catch {
        toast.error('Failed to delete student');
      }
    }
  };

  const handleRegistrationSuccess = () => {
    fetchStudents();
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
          Student Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Register new students and manage existing student accounts
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Form */}
        <div>
          <StudentRegisterForm onSuccess={handleRegistrationSuccess} />
        </div>

        {/* Students List */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Registered Students
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : students.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No students registered yet
            </p>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Reg. No: {student.registrationNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(student.id, student.name)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete student"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </MainLayout>
  );
};

export default StudentManagementPage;
