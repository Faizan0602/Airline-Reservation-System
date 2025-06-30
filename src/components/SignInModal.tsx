import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Calendar, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StoredUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  createdAt: string;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const { dispatch } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  // Get stored users from localStorage
  const getStoredUsers = (): StoredUser[] => {
    try {
      return JSON.parse(localStorage.getItem('skyways_users') || '[]');
    } catch {
      return [];
    }
  };

  // Save user to localStorage
  const saveUser = (user: StoredUser) => {
    const users = getStoredUsers();
    users.push(user);
    localStorage.setItem('skyways_users', JSON.stringify(users));
  };

  // Find user by email and password
  const findUser = (email: string, password: string): StoredUser | null => {
    const users = getStoredUsers();
    return users.find(user => user.email === email && user.password === password) || null;
  };

  // Check if email already exists
  const emailExists = (email: string): boolean => {
    const users = getStoredUsers();
    return users.some(user => user.email === email);
  };

  const validateForm = (): boolean => {
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (isSignUp) {
      if (!formData.firstName || !formData.lastName) {
        setError('First name and last name are required');
        return false;
      }

      if (!formData.phone) {
        setError('Phone number is required');
        return false;
      }

      if (!formData.dateOfBirth) {
        setError('Date of birth is required');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }

      if (emailExists(formData.email)) {
        setError('An account with this email already exists. Please sign in instead.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    // Simulate API call delay
    setTimeout(() => {
      try {
        if (isSignUp) {
          // Create new user
          const newUser: StoredUser = {
            id: Math.random().toString(36).substr(2, 9),
            email: formData.email.toLowerCase().trim(),
            password: formData.password, // In real app, this would be hashed
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            phone: formData.phone.trim(),
            dateOfBirth: formData.dateOfBirth,
            createdAt: new Date().toISOString()
          };

          saveUser(newUser);
          
          // Sign in the new user
          const { password, ...userWithoutPassword } = newUser;
          dispatch({ type: 'SET_USER', payload: userWithoutPassword });
          
          setSuccess('Account created successfully! Welcome to SkyWays!');
          
          setTimeout(() => {
            onClose();
            resetForm();
          }, 1500);
          
        } else {
          // Sign in existing user
          const user = findUser(formData.email.toLowerCase().trim(), formData.password);
          
          if (user) {
            const { password, ...userWithoutPassword } = user;
            dispatch({ type: 'SET_USER', payload: userWithoutPassword });
            
            setSuccess('Welcome back! Signed in successfully.');
            
            setTimeout(() => {
              onClose();
              resetForm();
            }, 1000);
          } else {
            setError('Invalid email or password. Please check your credentials and try again.');
          }
        }
      } catch (error) {
        setError('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: ''
    });
    setError('');
    setSuccess('');
    setIsSignUp(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setFormData(prev => ({
      ...prev,
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: ''
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {isSignUp && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="John"
                      required={isSignUp}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Doe"
                      required={isSignUp}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="+91 98765 43210"
                    required={isSignUp}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    max={new Date().toISOString().split('T')[0]}
                    required={isSignUp}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password * {isSignUp && <span className="text-xs text-gray-500">(minimum 6 characters)</span>}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  required={isSignUp}
                  minLength={6}
                />
              </div>
            </div>
          )}

          {/* Demo Account Info */}
          {!isSignUp && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                <strong>Demo Account:</strong><br />
                Email: demo@skyways.com<br />
                Password: demo123
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
              </div>
            ) : (
              <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>

          {/* Toggle Sign Up/Sign In */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}