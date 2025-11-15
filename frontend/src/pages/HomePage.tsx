import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import BookCard from '../components/books/BookCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getBooks } from '../services/bookService';
import { MagnifyingGlassIcon, BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: books, isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  });

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-16 px-8 bg-white border-2 border-emerald-500 rounded-3xl shadow-lg relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full -mr-32 -mt-32 z-0"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-50 rounded-full -ml-20 -mb-20 z-0"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6 p-3 bg-emerald-100 rounded-full"
            >
              <BookOpenIcon className="h-10 w-10 text-emerald-600" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-black to-black bg-clip-text text-transparent">
              Welcome to BookNexus 
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Discover, explore, and manage your library with ease
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearchClick}
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Search Books
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Latest Additions Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <SparklesIcon className="h-6 w-6 text-emerald-500 mr-2" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Latest Additions
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/books')}
            className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center"
          >
            View all
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="large" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-6 rounded-xl border border-red-200 dark:border-red-800">
            An error occurred while fetching books. Please try again later.
          </div>
        )}

        {books && books.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8"
          >
            {books.slice(0, 5).map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {books && books.length === 0 && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700">
            <BookOpenIcon className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-xl">No books found in the library.</p>
            <button 
              onClick={() => navigate('/books/add')}
              className="mt-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              Add your first book
            </button>
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-3xl overflow-hidden border border-emerald-100 dark:border-emerald-900">
          <div className="px-8 py-10">
            <h2 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About BookNexus
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              BookNexus is a modern library management system designed to make organizing, searching,
              and managing your book collection as seamless as possible.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              With AI-powered search and book summaries, finding the perfect book has never been easier.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex-1 min-w-[200px] p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900"
              >
                <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Smart Search</h3>
                <p className="text-gray-600 dark:text-gray-400">Find books instantly with our intelligent search system</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex-1 min-w-[200px] p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900"
              >
                <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400 mb-2">AI Summaries</h3>
                <p className="text-gray-600 dark:text-gray-400">Get quick insights with AI-generated book summaries</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;