import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900/20 rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-800/10 rounded-full -ml-32 -mb-32"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border-2 border-emerald-500 relative z-10"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto h-16 w-16 flex items-center justify-center bg-emerald-800 rounded-full mb-6"
          >
            <BookOpenIcon className="h-10 w-10 text-white" />
          </motion.div>
          
          <h2 className="mt-2 text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Sign in to BookNexus
          </h2>
          <p className="mt-2 text-sm text-gray-300 mb-8">
            Access your library management system
          </p>
        </div>
        
        {/* We'll assume LoginForm is a component you already have */}
        {/* You may need to style this component separately to match the theme */}
        <LoginForm />
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you a student?{' '}
            <Link 
              to="/student-login" 
              className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Login here
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
};

export default LoginPage;