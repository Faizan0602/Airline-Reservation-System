import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Flight, SearchFilters, Booking, User, Seat } from '../types';

interface AppState {
  user: User | null;
  searchFilters: SearchFilters;
  searchResults: Flight[];
  selectedFlight: Flight | null;
  selectedSeats: Seat[];
  currentBooking: Booking | null;
  bookings: Booking[];
  isLoading: boolean;
  currentView: string;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_SEARCH_FILTERS'; payload: SearchFilters }
  | { type: 'SET_SEARCH_RESULTS'; payload: Flight[] }
  | { type: 'SET_SELECTED_FLIGHT'; payload: Flight | null }
  | { type: 'SET_SELECTED_SEATS'; payload: Seat[] }
  | { type: 'SET_CURRENT_BOOKING'; payload: Booking | null }
  | { type: 'ADD_BOOKING'; payload: Booking }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_VIEW'; payload: string };

const initialState: AppState = {
  user: null,
  searchFilters: {
    origin: '',
    destination: '',
    departureDate: '',
    passengers: 1,
    infants: 0, // Added infants field
    travelClass: 'economy',
    tripType: 'one-way'
  },
  searchResults: [],
  selectedFlight: null,
  selectedSeats: [],
  currentBooking: null,
  bookings: [],
  isLoading: false,
  currentView: 'search'
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      // Save user to localStorage for persistence
      if (action.payload) {
        localStorage.setItem('skyways_current_user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('skyways_current_user');
      }
      return { ...state, user: action.payload };
    case 'SET_SEARCH_FILTERS':
      return { ...state, searchFilters: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'SET_SELECTED_FLIGHT':
      return { ...state, selectedFlight: action.payload };
    case 'SET_SELECTED_SEATS':
      return { ...state, selectedSeats: action.payload };
    case 'SET_CURRENT_BOOKING':
      return { ...state, currentBooking: action.payload };
    case 'ADD_BOOKING':
      const newBookings = [...state.bookings, action.payload];
      // Save bookings to localStorage with user association
      if (state.user) {
        const userBookings = JSON.parse(localStorage.getItem(`skyways_bookings_${state.user.id}`) || '[]');
        userBookings.push(action.payload);
        localStorage.setItem(`skyways_bookings_${state.user.id}`, JSON.stringify(userBookings));
      }
      return { ...state, bookings: newBookings };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user and bookings from localStorage on app start
  useEffect(() => {
    // Load current user
    try {
      const savedUser = localStorage.getItem('skyways_current_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: user });
        
        // Load user's bookings
        const userBookings = localStorage.getItem(`skyways_bookings_${user.id}`);
        if (userBookings) {
          const bookings = JSON.parse(userBookings);
          // Set bookings in state (we'll need to modify the reducer to handle this)
          bookings.forEach((booking: Booking) => {
            dispatch({ type: 'ADD_BOOKING', payload: booking });
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }

    // Create demo account if it doesn't exist
    const users = JSON.parse(localStorage.getItem('skyways_users') || '[]');
    const demoExists = users.some((user: any) => user.email === 'demo@skyways.com');
    
    if (!demoExists) {
      const demoUser = {
        id: 'demo-user-123',
        email: 'demo@skyways.com',
        password: 'demo123',
        firstName: 'Demo',
        lastName: 'User',
        phone: '+91 98765 43210',
        dateOfBirth: '1990-01-01',
        createdAt: new Date().toISOString()
      };
      
      users.push(demoUser);
      localStorage.setItem('skyways_users', JSON.stringify(users));
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}