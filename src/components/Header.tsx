import React, { useState } from 'react';
import { Plane, User, Menu, X, CreditCard, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SignInModal from './SignInModal';

export default function Header() {
  const { state, dispatch } = useApp();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const handleViewChange = (view: string) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  const handleSignInClick = () => {
    setShowSignInModal(true);
    setShowUserMenu(false);
  };

  const handleSignOut = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'search' });
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-300 transform hover:scale-105"
              onClick={() => handleViewChange('search')}
            >
              <Plane className="h-8 w-8 text-blue-300 hover:text-blue-200 transition-colors duration-300" />
              <span className="text-xl font-bold hover:text-blue-200 transition-colors duration-300">SkyWays</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => handleViewChange('search')}
                className={`hover:text-blue-300 transition-all duration-300 transform hover:scale-105 hover:bg-blue-800 px-3 py-2 rounded-lg ${
                  state.currentView === 'search' ? 'text-blue-300 bg-blue-800' : ''
                }`}
              >
                Search Flights
              </button>
              {state.user && (
                <>
                  <button
                    onClick={() => handleViewChange('bookings')}
                    className={`hover:text-blue-300 transition-all duration-300 transform hover:scale-105 hover:bg-blue-800 px-3 py-2 rounded-lg ${
                      state.currentView === 'bookings' ? 'text-blue-300 bg-blue-800' : ''
                    }`}
                  >
                    My Bookings
                  </button>
                  <button
                    onClick={() => handleViewChange('history')}
                    className={`hover:text-blue-300 transition-all duration-300 transform hover:scale-105 hover:bg-blue-800 px-3 py-2 rounded-lg ${
                      state.currentView === 'history' ? 'text-blue-300 bg-blue-800' : ''
                    }`}
                  >
                    Travel History
                  </button>
                </>
              )}
            </nav>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 hover:bg-blue-800 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <User className="h-5 w-5 hover:text-blue-300 transition-colors duration-300" />
                <span className="hidden md:block hover:text-blue-300 transition-colors duration-300">
                  {state.user ? `${state.user.firstName} ${state.user.lastName}` : 'Sign In'}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 transform transition-all duration-300 scale-100 opacity-100">
                  {state.user ? (
                    <>
                      <div className="px-4 py-2 text-gray-800 border-b hover:bg-gray-50 transition-colors duration-200">
                        <p className="font-semibold">{state.user.firstName} {state.user.lastName}</p>
                        <p className="text-sm text-gray-600">{state.user.email}</p>
                      </div>
                      <button
                        onClick={() => handleViewChange('profile')}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center space-x-2 transition-all duration-200 hover:text-blue-600"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => handleViewChange('bookings')}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center space-x-2 transition-all duration-200 hover:text-blue-600"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>My Bookings</span>
                      </button>
                      <button
                        onClick={() => handleViewChange('history')}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center space-x-2 transition-all duration-200 hover:text-blue-600"
                      >
                        <Clock className="h-4 w-4" />
                        <span>Travel History</span>
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-all duration-200 hover:text-red-700"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleSignInClick}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-all duration-200 hover:text-blue-600"
                    >
                      Sign In / Sign Up
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-blue-800 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-blue-700 animate-fadeIn">
              <nav className="flex flex-col space-y-2">
                <button
                  onClick={() => handleViewChange('search')}
                  className={`text-left py-2 px-4 hover:bg-blue-800 rounded transition-all duration-300 transform hover:translate-x-2 ${
                    state.currentView === 'search' ? 'bg-blue-800' : ''
                  }`}
                >
                  Search Flights
                </button>
                {state.user && (
                  <>
                    <button
                      onClick={() => handleViewChange('bookings')}
                      className={`text-left py-2 px-4 hover:bg-blue-800 rounded transition-all duration-300 transform hover:translate-x-2 ${
                        state.currentView === 'bookings' ? 'bg-blue-800' : ''
                      }`}
                    >
                      My Bookings
                    </button>
                    <button
                      onClick={() => handleViewChange('history')}
                      className={`text-left py-2 px-4 hover:bg-blue-800 rounded transition-all duration-300 transform hover:translate-x-2 ${
                        state.currentView === 'history' ? 'bg-blue-800' : ''
                      }`}
                    >
                      Travel History
                    </button>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Sign In Modal */}
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)} 
      />
    </>
  );
}