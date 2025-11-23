import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import StudentLoginForm from '../components/auth/StudentLoginForm';
import { HomeIcon } from '@heroicons/react/24/outline';

const StudentLoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <Toaster position="top-right" />
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900/20 rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-800/10 rounded-full -ml-32 -mb-32"></div>
      
      <div className="max-w-md w-full mx-auto space-y-4 relative z-10">
        <StudentLoginForm />
        
        {/* Back to Homepage Button - positioned below login form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link 
            to="/"
            className="group flex items-center justify-center space-x-2 bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-emerald-300 w-full"
          >
            <HomeIcon className="h-5 w-5" />
            <span className="font-medium">Back to Homepage</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentLoginPage;
