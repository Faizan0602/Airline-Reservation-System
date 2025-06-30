import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import SeatSelection from './components/SeatSelection';
import BookingForm from './components/BookingForm';
import PaymentForm from './components/PaymentForm';
import BookingConfirmation from './components/BookingConfirmation';
import BookingsList from './components/BookingsList';
import HotelBooking from './components/HotelBooking';
import CabBooking from './components/CabBooking';
import TravelPackage from './components/TravelPackage';

function AppContent() {
  const { state } = useApp();

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'search':
        return (
          <>
            <HeroSection />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <SearchForm />
            </div>
            <div className="py-16"></div>
          </>
        );
      case 'results':
        return <SearchResults />;
      case 'seats':
        return <SeatSelection />;
      case 'booking':
        return <BookingForm />;
      case 'payment':
        return <PaymentForm />;
      case 'confirmation':
        return <BookingConfirmation />;
      case 'hotel-booking':
        return <HotelBooking />;
      case 'cab-booking':
        return <CabBooking />;
      case 'travel-package':
        return <TravelPackage />;
      case 'bookings':
      case 'history':
        return <BookingsList />;
      default:
        return (
          <>
            <HeroSection />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <SearchForm />
            </div>
            <div className="py-16"></div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;