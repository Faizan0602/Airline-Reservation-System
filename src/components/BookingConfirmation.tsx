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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">Booking Reference</h2>
              <p className="text-2xl font-bold">{booking.bookingReference}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-200">Total Paid</p>
              <p className="text-2xl font-bold">{formatPrice(booking.totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Flight Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Flight Details</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Flight Number</p>
                  <p className="font-semibold">{booking.flight.flightNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Airline</p>
                  <p className="font-semibold">{booking.flight.airline}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Aircraft</p>
                  <p className="font-semibold">{booking.flight.aircraft}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Departure</p>
                  <p className="font-semibold">
                    {booking.flight.origin.city} ({booking.flight.origin.code})
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(booking.flight.departureTime)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Arrival</p>
                  <p className="font-semibold">
                    {booking.flight.destination.city} ({booking.flight.destination.code})
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(booking.flight.arrivalTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Passenger Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Passengers</span>
            </h3>
            
            <div className="space-y-4">
              {booking.passengers.map((passenger, index) => (
                <div key={passenger.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">
                      {passenger.title} {passenger.firstName} {passenger.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{passenger.email}</p>
                  </div>
                  {booking.seats[index] && (
                    <div className="text-right">
                      <p className="font-semibold">Seat {booking.seats[index].seatNumber}</p>
                      <p className="text-sm text-gray-600 capitalize">{booking.seats[index].class}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Important Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights</li>
              <li>• Check-in opens 24 hours before departure</li>
              <li>• Bring a valid ID and passport (for international flights)</li>
              <li>• Review baggage allowances on our website</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleDownloadPDF}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2 transform hover:scale-105 duration-200"
            >
              <Download className="h-5 w-5" />
              <span>Download Ticket (PDF)</span>
            </button>
            <button 
              onClick={handleEmailTicket}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center space-x-2 transform hover:scale-105 duration-200"
            >
              <Mail className="h-5 w-5" />
              <span>Email Ticket</span>
            </button>
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