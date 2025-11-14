import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getBookById, createBook, updateBook } from '../services/bookService';
import MainLayout from '../components/layout/MainLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { BookCover, formatImageUrl } from '../utils/imageUtils';

interface FormData {
  title: string;
  author: string;
  isbn: string;
  subject: string;
  researchArea: string;
  location: string;
  totalCopies: number;
  availableCopies: number;
  description?: string;
  imageUrl?: string;
}

const BookFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      subject: '',
      researchArea: '',
      location: '',
      totalCopies: 1,
      availableCopies: 1,
      description: '',
      imageUrl: '',
    },
  });

  // Current imageUrl value for conditional rendering
  const currentImageUrl = watch('imageUrl');

  // Fetch book data if in edit mode
  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['book', id],
    queryFn: () => getBookById(Number(id)),
    enabled: isEditMode,
    refetchOnWindowFocus: false,
  });

  // Update form values when book data is loaded
  React.useEffect(() => {
    if (book) {
      // Explicitly set each field to ensure proper type handling
      setValue('title', book.title || '');
      setValue('author', book.author || '');
      setValue('isbn', book.isbn || '');
      setValue('subject', book.subject || '');
      setValue('researchArea', book.researchArea || '');
      setValue('location', book.location || '');
      setValue('totalCopies', book.totalCopies || 1);
      setValue('availableCopies', book.availableCopies || 0);
      setValue('description', book.description || '');
      setValue('imageUrl', book.imageUrl || '');
      
      // Set image preview for existing image
      if (book.imageUrl) {
        setImagePreview(formatImageUrl(book.imageUrl));
      }
    }
  }, [book, setValue]);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, GIF, or WEBP)');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setCoverImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear the imageUrl field since we're using file upload
      setValue('imageUrl', '');
    }
  };

  // Create FormData object with all form fields
  const prepareFormData = (data: FormData) => {
    const formData = new FormData();
    
    // Add all form fields
    formData.append('title', data.title);
    formData.append('author', data.author);
    formData.append('isbn', data.isbn);
    formData.append('subject', data.subject);
    formData.append('researchArea', data.researchArea);
    formData.append('location', data.location);
    formData.append('totalCopies', data.totalCopies.toString());
    formData.append('availableCopies', data.availableCopies.toString());
    
    // Optional fields
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (data.imageUrl && !coverImage) {
      formData.append('imageUrl', data.imageUrl);
    }
    
    // Append the file if it exists
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }
    
    return formData;
  };

  // Create book mutation
  const createMutation = useMutation({
    mutationFn: (data: FormData) => {
      const formData = prepareFormData(data);
      return createBook(formData);
    },
    onSuccess: () => {
      toast.success('Book created successfully!');
      navigate('/admin/books');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create book');
      setIsSubmitting(false);
    },
  });

  // Update book mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => {
      const formData = prepareFormData(data);
      return updateBook(id, formData);
    },
    onSuccess: () => {
      toast.success('Book updated successfully!');
      navigate('/admin/books');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update book');
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    
    if (isEditMode && id) {
      updateMutation.mutate({ id: Number(id), data });
    } else {
      createMutation.mutate(data);
    }
  };

  const validateUrl = (value: string | undefined) => {
    if (!value) return true;
    if (value) return true;
    // try {
    //   new URL(value);
    //   return true;
    // } catch {
    //   return "Please enter a valid URL";
    // }
  };

  // Clear file input and preview
  const handleClearImage = () => {
    setCoverImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isEditMode && isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner size="large" />
        </div>
      </MainLayout>
    );
  }

  if (isEditMode && isError) {
    return (
      <MainLayout>
        <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-md">
          Failed to load book data. Please try again.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Book' : 'Add New Book'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isEditMode
              ? 'Update the book information in the library database.'
              : 'Add a new book to the library database.'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">
              Book Information
            </h2>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6" encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="form-group">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.title 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors`}
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
                )}
              </div>

              {/* Author */}
              <div className="form-group">
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Author
                </label>
                <input
                  id="author"
                  type="text"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.author 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors`}
                  {...register('author', { required: 'Author is required' })}
                />
                {errors.author && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.author.message}</p>
                )}
              </div>

              {/* ISBN */}
              <div className="form-group">
                <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ISBN
                </label>
                <input
                  id="isbn"
                  type="text"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.isbn 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors`}
                  {...register('isbn', { required: 'ISBN is required' })}
                />
                {errors.isbn && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.isbn.message}</p>
                )}
              </div>

              {/* Subject */}
              <div className="form-group">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.subject 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors`}
                  {...register('subject', { required: 'Subject is required' })}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject.message}</p>
                )}
              </div>

              {/* Research Area */}
              <div className="form-group">
                <label htmlFor="researchArea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Research Area
                </label>
                <input
                  id="researchArea"
                  type="text"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.researchArea 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors`}
                  {...register('researchArea', { required: 'Research area is required' })}
                />
                {errors.researchArea && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.researchArea.message}</p>
                )}
              </div>

              {/* Location */}
              <div className="form-group">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.location 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors`}
                  {...register('location', { required: 'Location is required' })}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location.message}</p>
                )}
              </div>

              {/* Total Copies */}
              <div className="form-group">
                <label htmlFor="totalCopies" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Copies
                </label>
                <input
                  id="totalCopies"
                  type="number"
                  min="1"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.totalCopies 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors`}
                  {...register('totalCopies', { 
                    required: 'Total copies is required',
                    min: { value: 1, message: 'Total copies must be at least 1' },
                    valueAsNumber: true
                  })}
                />
                {errors.totalCopies && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.totalCopies.message}</p>
                )}
              </div>

              {/* Available Copies */}
              <div className="form-group">
                <label htmlFor="availableCopies" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Available Copies
                </label>
                <input
                  id="availableCopies"
                  type="number"
                  min="0"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.availableCopies 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors`}
                  {...register('availableCopies', { 
                    required: 'Available copies is required',
                    min: { value: 0, message: 'Available copies cannot be negative' },
                    valueAsNumber: true
                  })}
                />
                {errors.availableCopies && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.availableCopies.message}</p>
                )}
              </div>

              {/* Cover Image Upload */}
              <div className="form-group md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Book Cover
                </label>
                
                <div className="mt-1 flex flex-col space-y-4">
                  {/* File Upload */}
                  <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <div className="space-y-2 text-center">
                      <div className="mx-auto h-12 w-12 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor="coverImage" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input
                            id="coverImage"
                            name="coverImage"
                            type="file"
                            ref={fileInputRef}
                            className="sr-only"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF or WEBP up to 5MB
                      </p>
                    </div>
                  </div>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative">
                      <div className="mt-2 relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                        <img
                          src={imagePreview}
                          alt="Cover preview"
                          className="h-64 w-auto mx-auto object-contain"
                        />
                        <button
                          type="button"
                          onClick={handleClearImage}
                          className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white hover:bg-red-700 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Alternative Image URL */}
                  <div>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      Or provide an image URL:
                    </p>
                    <input
                      id="imageUrl"
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      disabled={!!coverImage}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.imageUrl 
                          ? 'border-red-500 dark:border-red-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors ${
                        coverImage ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      {...register('imageUrl', { validate: validateUrl })}
                    />
                    {currentImageUrl && !imagePreview && !coverImage && (
                      <div className="mt-2 relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                        <BookCover
                          src={currentImageUrl}
                          alt="Cover from URL"
                          className="h-64 w-auto mx-auto object-contain"
                        />
                      </div>
                    )}
                    {errors.imageUrl && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.imageUrl.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="form-group md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.description 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors`}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/admin/books')}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="small" color="white" className="mr-2" />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{isEditMode ? 'Update Book' : 'Create Book'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookFormPage;