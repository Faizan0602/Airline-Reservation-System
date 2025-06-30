import React, { useState } from 'react';
import { Calendar, MapPin, Users, CreditCard, Download, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { generateTicketPDF, generateSimplePDF } from '../utils/pdfGenerator';

export default function BookingsList() {
  const { state } = useApp();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
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

  const isUpcoming = (booking: Booking) => {
    return new Date(booking.flight.departureTime) > new Date();
  };

  const filterBookings = (bookings: Booking[]) => {
    switch (filter) {
      case 'upcoming':
        return bookings.filter(booking => isUpcoming(booking) && booking.status !== 'cancelled');
      case 'past':
        return bookings.filter(booking => !isUpcoming(booking) && booking.status !== 'cancelled');
      case 'cancelled':
        return bookings.filter(booking => booking.status === 'cancelled');
      default:
        return bookings;
    }
  };

  const filteredBookings = filterBookings(state.bookings);

  const getStatusBadge = (booking: Booking) => {
    if (booking.status === 'cancelled') {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Cancelled</span>;
    }
    
    if (isUpcoming(booking)) {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Upcoming</span>;
    }
    
    return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Completed</span>;
  };

  const handleDownloadTicket = async (booking: Booking) => {
    try {
      await generateTicketPDF(booking);
    } catch (error) {
      console.error('Error with advanced PDF generation, falling back to simple PDF:', error);
      generateSimplePDF(booking);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage your flight reservations</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200">
          {[
            { key: 'all', label: 'All Bookings' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'past', label: 'Past Flights' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                filter === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "You haven't made any bookings yet. Start by searching for flights!"
              : `No ${filter} bookings found.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                {/* Booking Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.bookingReference}
                      </h3>
                      {getStatusBadge(booking)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatPrice(booking.totalAmount)}
                    </p>
                    <p className="text-sm text-gray-600">Total Paid</p>
                  </div>
                </div>

                {/* Flight Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {booking.flight.origin.code} → {booking.flight.destination.code}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.flight.origin.city} to {booking.flight.destination.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {formatDateTime(booking.flight.departureTime)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Flight {booking.flight.flightNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {booking.passengers.length} Passenger{booking.passengers.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-gray-600">
                        Seats: {booking.seats.map(seat => seat.seatNumber).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Passenger List */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Passengers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {booking.passengers.map((passenger, index) => (
                      <div key={passenger.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">
                          {passenger.title} {passenger.firstName} {passenger.lastName}
                        </span>
                        {booking.seats[index] && (
                          <span className="text-sm text-gray-600">
                            Seat {booking.seats[index].seatNumber}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => handleDownloadTicket(booking)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105 duration-200"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Ticket</span>
                  </button>
                  
                  {isUpcoming(booking) && booking.status === 'confirmed' && (
                    <>
                      <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors transform hover:scale-105 duration-200">
                        <Calendar className="h-4 w-4" />
                        <span>Check-in</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors transform hover:scale-105 duration-200">
                        <AlertCircle className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}