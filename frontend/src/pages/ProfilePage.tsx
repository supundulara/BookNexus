import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/authService';
import api from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { type ProfileFormData, profileSchema } from '../types/auth';
import { UserCircleIcon, KeyIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ProfilePage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !!user,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profileData?.name || user?.name || '',
      email: profileData?.email || user?.email || '',
    },
  });

  // Watch for new password to show/hide confirm password field
  const newPassword = watch('newPassword');

  useEffect(() => {
    if (profileData) {
      reset({
        name: profileData.name,
        email: profileData.email || '',
      });
    }
  }, [profileData, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await api.put('/auth/profile', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
      setIsEditing(false);
      reset({
        name: data.name,
        email: data.email || '',
      });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    // Clean up the data - remove empty password fields
    const submitData: Partial<ProfileFormData> = {
      name: data.name,
    };

    // Only include password fields if user is trying to change password
    // All three fields must be provided (validated by schema)
    if (data.newPassword && data.newPassword.trim() !== '' &&
        data.currentPassword && data.currentPassword.trim() !== '' &&
        data.confirmPassword && data.confirmPassword.trim() !== '') {
      submitData.currentPassword = data.currentPassword;
      submitData.newPassword = data.newPassword;
    }

    console.log('Submitting profile data:', submitData);
    updateProfileMutation.mutate(submitData as ProfileFormData);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      name: profileData?.name || user?.name || '',
      email: profileData?.email || user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  if (authLoading || profileLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner size="large" />
        </div>
      </MainLayout>
    );
  }

  // Use profileData if available, otherwise fall back to user from AuthContext
  const displayUser = profileData || user;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <UserCircleIcon className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {displayUser?.name}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {displayUser?.role === 'admin' ? 'Librarian' : displayUser?.role === 'student' ? 'Student' : 'User'} Account
                  </p>
                </div>
              </div>
              
              {!isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
                >
                  <PencilIcon className="h-5 w-5" />
                  <span>Edit Profile</span>
                </motion.button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <UserCircleIcon className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                    Personal Information
                  </h2>
                </div>
                
                <div className="p-6">
                  {isEditing ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all`}
                          {...register('name')}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                      </div>
                      
                      {displayUser?.role === 'student' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Registration Number
                          </label>
                          <input
                            type="text"
                            value={displayUser.registrationNumber}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          />
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Registration number cannot be changed
                          </p>
                        </div>
                      )}

                      {displayUser?.role !== 'student' && displayUser?.email && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={displayUser.email}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          />
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Email cannot be changed
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <KeyIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                          Change Password
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Leave blank if you don't want to change your password
                        </p>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Current Password
                            </label>
                            <input
                              id="currentPassword"
                              type="password"
                              className={`w-full px-4 py-3 border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all`}
                              {...register('currentPassword')}
                            />
                            {errors.currentPassword && <p className="mt-1 text-sm text-red-500">{errors.currentPassword.message}</p>}
                          </div>
                          
                          <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              New Password
                            </label>
                            <input
                              id="newPassword"
                              type="password"
                              className={`w-full px-4 py-3 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all`}
                              {...register('newPassword')}
                            />
                            {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>}
                          </div>
                          
                          {newPassword && (
                            <div>
                              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm New Password
                              </label>
                              <input
                                id="confirmPassword"
                                type="password"
                                className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all`}
                                {...register('confirmPassword')}
                              />
                              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-4">
                        <motion.button
                          type="button"
                          onClick={handleCancel}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <XMarkIcon className="h-5 w-5" />
                          <span>Cancel</span>
                        </motion.button>
                        <motion.button
                          type="submit"
                          disabled={updateProfileMutation.isPending}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updateProfileMutation.isPending ? (
                            <>
                              <LoadingSpinner size="small" color="white" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <CheckIcon className="h-5 w-5" />
                              <span>Save Changes</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoItem label="Name" value={displayUser?.name} />
                      
                      {displayUser?.role === 'student' ? (
                        <>
                          <InfoItem label="Registration Number" value={displayUser.registrationNumber} />
                          <InfoItem label="Index Number" value={displayUser.indexNumber} />
                          <InfoItem label="Title" value={displayUser.title} />
                          <InfoItem label="Last Name" value={displayUser.lastName} />
                          <InfoItem label="Name with Initials" value={displayUser.nameWithInitials} />
                        </>
                      ) : (
                        displayUser?.email && <InfoItem label="Email" value={displayUser.email} />
                      )}
                      
                      <InfoItem label="Role" value={displayUser?.role === 'admin' ? 'Librarian' : displayUser?.role} capitalize />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Additional Information Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Additional Details
                  </h2>
                </div>
                
                <div className="p-6 space-y-4">
                  {displayUser?.role === 'student' ? (
                    <>
                      <InfoItem label="Faculty" value={displayUser.faculty} />
                      <InfoItem label="Course of Study" value={displayUser.courseOfStudy} />
                      <InfoItem label="Intake Batch" value={displayUser.intakeBatch} />
                      <InfoItem label="Gender" value={displayUser.gender} />
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <UserCircleIcon className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No additional details available
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

// Reusable Info Item Component
const InfoItem: React.FC<{ label: string; value?: string | null; capitalize?: boolean }> = ({ 
  label, 
  value,
  capitalize = false 
}) => (
  <div>
    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
      {label}
    </h4>
    <p className={`text-base font-medium text-gray-900 dark:text-white ${capitalize ? 'capitalize' : ''}`}>
      {value || '-'}
    </p>
  </div>
);

export default ProfilePage;