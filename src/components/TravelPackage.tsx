import React, { useState } from 'react';
import { ArrowLeft, Plane, Hotel, Car, CreditCard, Check, Calendar, Users, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TravelPackage() {
  const { state, dispatch } = useApp();
  const [showPayment, setShowPayment] = useState(false);

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'cab-booking' });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate package totals (mock data for demo)
  const flightTotal = state.currentBooking?.totalAmount || 0;
  const hotelTotal = 15000; // Mock hotel booking
  const cabTotal = 2500; // Mock cab booking
  const packageTotal = flightTotal + hotelTotal + cabTotal;
  const individualTotal = flightTotal + hotelTotal + cabTotal + 1500; // Mock individual booking total
  const savings = individualTotal - packageTotal;

  const handleCompleteBooking = () => {
    // Complete the travel package booking
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'package-confirmation' });
  };

  if (!state.selectedFlight || !state.currentBooking) {
    return <div>No booking information found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Cab Booking</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complete Travel Package</h1>
          <p className="text-gray-600">Review your complete travel itinerary</p>
        </div>
      </div>

      {/* Package Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Travel Package</h2>
            <p className="text-blue-200">
              {state.selectedFlight.origin.city} → {state.selectedFlight.destination.city}
            </p>
            <p className="text-blue-200">
              {formatDateTime(state.selectedFlight.departureTime)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-200">Package Total</p>
            <p className="text-3xl font-bold">{formatPrice(packageTotal)}</p>
            <p className="text-green-300 text-sm">Save {formatPrice(savings)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Package Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Flight Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Flight</h3>
                <p className="text-gray-600">{state.selectedFlight.flightNumber} - {state.selectedFlight.airline}</p>
              </div>
              <div className="ml-auto">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  ✓ Confirmed
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Departure</p>
                <p className="font-semibold">{state.selectedFlight.origin.city} ({state.selectedFlight.origin.code})</p>
                <p className="text-sm text-gray-500">{formatDateTime(state.selectedFlight.departureTime)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Arrival</p>
                <p className="font-semibold">{state.selectedFlight.destination.city} ({state.selectedFlight.destination.code})</p>
                <p className="text-sm text-gray-500">{formatDateTime(state.selectedFlight.arrivalTime)}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Passengers: {state.currentBooking.passengers.length}</span>
                <span className="font-semibold">{formatPrice(flightTotal)}</span>
              </div>
            </div>
          </div>

          {/* Hotel Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <Hotel className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Hotel</h3>
                <p className="text-gray-600">The Grand Plaza Hotel - Deluxe Room</p>
              </div>
              <div className="ml-auto">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  ✓ Confirmed
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Check-in</p>
                <p className="font-semibold">Dec 25, 2024</p>
                <p className="text-sm text-gray-500">3:00 PM</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-out</p>
                <p className="font-semibold">Dec 27, 2024</p>
                <p className="text-sm text-gray-500">11:00 AM</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Guests</p>
                <p className="font-semibold">2 Adults</p>
                <p className="text-sm text-gray-500">2 Nights</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">2 nights × ₹7,500</span>
                <span className="font-semibold">{formatPrice(hotelTotal)}</span>
              </div>
            </div>
          </div>

          {/* Cab Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Car className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Airport Transfer</h3>
                <p className="text-gray-600">Premium Sedan - Airport Pickup</p>
              </div>
              <div className="ml-auto">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  ✓ Confirmed
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Pickup</p>
                <p className="font-semibold">{state.selectedFlight.destination.name}</p>
                <p className="text-sm text-gray-500">After flight arrival</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Drop</p>
                <p className="font-semibold">The Grand Plaza Hotel</p>
                <p className="text-sm text-gray-500">25 km • 45 mins</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Premium Sedan Transfer</span>
                <span className="font-semibold">{formatPrice(cabTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Flight</span>
                <span>{formatPrice(flightTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hotel (2 nights)</span>
                <span>{formatPrice(hotelTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Airport Transfer</span>
                <span>{formatPrice(cabTotal)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Individual booking total</span>
                <span>{formatPrice(individualTotal)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Package discount</span>
                <span>-{formatPrice(savings)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Package Total</span>
                <span className="text-blue-600">{formatPrice(packageTotal)}</span>
              </div>
            </div>

            {/* Package Benefits */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-green-800 mb-2">Package Benefits</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>Save {formatPrice(savings)} vs individual booking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>Coordinated transfers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>24/7 travel support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>Single booking reference</span>
                </li>
              </ul>
            </div>

            {/* Booking Reference */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Booking Reference</h4>
              <p className="text-blue-700 font-mono text-lg">{state.currentBooking.bookingReference}</p>
            </div>

            {/* Complete Booking Button */}
            <button
              onClick={handleCompleteBooking}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-semibold flex items-center justify-center space-x-2"
            >
              <CreditCard className="h-5 w-5" />
              <span>Complete Package Booking</span>
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Secure payment • All bookings confirmed instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}