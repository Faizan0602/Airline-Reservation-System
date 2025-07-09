import React from 'react';
import { CheckCircle, Download, Mail, Calendar, MapPin, Users, CreditCard, Plane, Hotel, Car } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateTicketPDF, generateSimplePDF } from '../utils/pdfGenerator';

export default function BookingConfirmation() {
  const { state, dispatch } = useApp();
  
  const booking = state.bookings[state.bookings.length - 1];

  const handleNewSearch = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'search' });
    dispatch({ type: 'SET_SELECTED_FLIGHT', payload: null });
    dispatch({ type: 'SET_SELECTED_SEATS', payload: [] });
    dispatch({ type: 'SET_CURRENT_BOOKING', payload: null });
  };

  const handleViewBookings = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'bookings' });
  };

  const handleBookHotel = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'hotel-booking' });
  };

  const handleDownloadPDF = async () => {
    if (!booking) return;
    
    try {
      await generateTicketPDF(booking);
    } catch (error) {
      console.error('Error with advanced PDF generation, falling back to simple PDF:', error);
      generateSimplePDF(booking);
    }
  };

  const handleEmailTicket = () => {
    // Simulate email sending
    alert(`Ticket has been sent to ${booking.passengers[0].email}`);
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!booking) {
    return <div>No booking found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">
          Your flight has been successfully booked. We've sent confirmation details to your email.
        </p>
      </div>

      {/* Booking Details */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 py-8">
        {/* 1. Add a large airplane illustration at the top. */}
        <div className="flex justify-center mb-6">
          <svg width="200" height="100" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="24" rx="12" fill="#fff" fillOpacity="0.1" />
            <path d="M8 12h32M24 4v16" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        {/* 2. Style the confirmation card as a white, rounded rectangle with black text and minimalist layout. */}
        <div className="bg-white rounded-2xl shadow-xl text-black max-w-md w-full mx-auto p-6">
          {/* Route and Date/Time */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <div className="text-lg font-semibold tracking-widest">{booking.flight.origin.code}</div>
              <div className="text-xs text-gray-500">{booking.flight.origin.city}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">{formatDateTime(booking.flight.departureTime).split(',')[0]}</div>
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="black" className="mx-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.5 19.5l19-7-19-7v5l15 2-15 2v5z" />
              </svg>
              <div className="text-xs text-gray-500 mt-1">{formatDateTime(booking.flight.arrivalTime).split(',')[0]}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold tracking-widest">{booking.flight.destination.code}</div>
              <div className="text-xs text-gray-500">{booking.flight.destination.city}</div>
            </div>
          </div>
          {/* Flight Details */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="text-xs text-gray-500">Flight</div>
              <div className="font-bold">{booking.flight.flightNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Gate</div>
              <div className="font-bold">6</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Boarding</div>
              <div className="font-bold">{formatDateTime(booking.flight.departureTime).split(',')[1]?.trim() || ''}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Seat</div>
              <div className="font-bold">{booking.seats[0]?.seatNumber || '23A'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Class</div>
              <div className="font-bold capitalize">{booking.seats[0]?.class || booking.travelClass}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Passenger</div>
              <div className="font-bold">{booking.passengers[0]?.firstName} {booking.passengers[0]?.lastName}</div>
            </div>
          </div>
          {/* Barcode */}
          <div className="flex justify-center items-center bg-gray-200 py-3">
            {/* Placeholder barcode SVG */}
            <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="180" height="40" rx="8" fill="#fff" fillOpacity="0.1" />
              <rect x="10" y="10" width="4" height="20" fill="#fff" />
              <rect x="18" y="10" width="2" height="20" fill="#fff" />
              <rect x="24" y="10" width="6" height="20" fill="#fff" />
              <rect x="34" y="10" width="2" height="20" fill="#fff" />
              <rect x="40" y="10" width="4" height="20" fill="#fff" />
              <rect x="48" y="10" width="2" height="20" fill="#fff" />
              <rect x="54" y="10" width="6" height="20" fill="#fff" />
              <rect x="64" y="10" width="2" height="20" fill="#fff" />
              <rect x="70" y="10" width="4" height="20" fill="#fff" />
              <rect x="78" y="10" width="2" height="20" fill="#fff" />
              <rect x="84" y="10" width="6" height="20" fill="#fff" />
              <rect x="94" y="10" width="2" height="20" fill="#fff" />
              <rect x="100" y="10" width="4" height="20" fill="#fff" />
              <rect x="108" y="10" width="2" height="20" fill="#fff" />
              <rect x="114" y="10" width="6" height="20" fill="#fff" />
              <rect x="124" y="10" width="2" height="20" fill="#fff" />
              <rect x="130" y="10" width="4" height="20" fill="#fff" />
              <rect x="138" y="10" width="2" height="20" fill="#fff" />
              <rect x="144" y="10" width="6" height="20" fill="#fff" />
              <rect x="154" y="10" width="2" height="20" fill="#fff" />
              <rect x="160" y="10" width="4" height="20" fill="#fff" />
              <rect x="168" y="10" width="2" height="20" fill="#fff" />
            </svg>
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Your Travel Experience</h3>
        <p className="text-gray-600 mb-6">
          Make your trip even better with our additional services. Book hotels and airport transfers for a seamless travel experience.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Hotel className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Hotels</h4>
                <p className="text-sm text-gray-600">Find perfect accommodation</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Discover great hotels in {booking.flight.destination.city} with special rates for flight passengers.
            </p>
            <button
              onClick={handleBookHotel}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Book Hotels
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Airport Transfers</h4>
                <p className="text-sm text-gray-600">Convenient cab services</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Book reliable airport transfers and city cabs for a comfortable journey.
            </p>
            <button
              onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'cab-booking' })}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Book Cabs
            </button>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleNewSearch}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold transform hover:scale-105 duration-200"
        >
          Book Another Flight
        </button>
        <button
          onClick={handleViewBookings}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-semibold transform hover:scale-105 duration-200"
        >
          View All Bookings
        </button>
      </div>
    </div>
  );
}