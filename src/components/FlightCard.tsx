import React, { useState } from 'react';
import { Plane, Clock, MapPin, Wifi, Coffee, Tv, Check } from 'lucide-react';
import { Flight } from '../types';
import { useApp } from '../context/AppContext';

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const { state, dispatch } = useApp();
  const [selectedClass, setSelectedClass] = useState<'economy' | 'premium' | 'business' | 'first'>(state.searchFilters.travelClass);

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get the lowest price across all classes for display
  const getLowestPrice = () => {
    return Math.min(flight.price.economy, flight.price.premium, flight.price.business, flight.price.first);
  };

  // Get available seats for the selected class
  const getAvailableSeats = (travelClass: string) => {
    return flight.availableSeats[travelClass as keyof typeof flight.availableSeats];
  };

  const handleSelectFlight = () => {
    // Update the search filters with the selected class
    dispatch({ 
      type: 'SET_SEARCH_FILTERS', 
      payload: { ...state.searchFilters, travelClass: selectedClass } 
    });
    dispatch({ type: 'SET_SELECTED_FLIGHT', payload: flight });
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'seats' });
  };

  const getClassDisplayName = (classKey: string) => {
    const names = {
      economy: 'Economy',
      premium: 'Premium Economy',
      business: 'Business Class',
      first: 'First Class'
    };
    return names[classKey as keyof typeof names];
  };

  const getClassColor = (classKey: string, isSelected: boolean) => {
    const colors = {
      economy: isSelected 
        ? 'bg-blue-600 text-white border-blue-600' 
        : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300',
      premium: isSelected 
        ? 'bg-green-600 text-white border-green-600' 
        : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300',
      business: isSelected 
        ? 'bg-purple-600 text-white border-purple-600' 
        : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:border-purple-300',
      first: isSelected 
        ? 'bg-amber-600 text-white border-amber-600' 
        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300'
    };
    return colors[classKey as keyof typeof colors];
  };

  const isClassAvailable = (classKey: string) => {
    return getAvailableSeats(classKey) > 0;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl mb-6 p-6">
      {/* Flight Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Plane className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{flight.flightNumber}</h3>
            <p className="text-gray-600">{flight.airline}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Starting from</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatPrice(getLowestPrice())}
          </p>
          <p className="text-sm text-gray-600">per person</p>
        </div>
      </div>

      {/* Flight Route */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{formatTime(flight.departureTime)}</p>
          <p className="text-sm text-gray-600">{flight.origin.code}</p>
          <p className="text-xs text-gray-500">{formatDate(flight.departureTime)}</p>
        </div>
        
        <div className="flex-1 mx-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-px bg-gray-300 flex-1"></div>
            <div className="text-center">
              <Clock className="h-4 w-4 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-600">{flight.duration}</p>
              {flight.stops === 0 ? (
                <p className="text-xs text-green-600 font-medium">Non-stop</p>
              ) : (
                <p className="text-xs text-orange-600">{flight.stops} stop{flight.stops > 1 ? 's' : ''}</p>
              )}
            </div>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{formatTime(flight.arrivalTime)}</p>
          <p className="text-sm text-gray-600">{flight.destination.code}</p>
          <p className="text-xs text-gray-500">{formatDate(flight.arrivalTime)}</p>
        </div>
      </div>

      {/* Interactive Class Selection */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Select Your Travel Class
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {(['economy', 'premium', 'business', 'first'] as const).map((classKey) => (
            <button
              key={classKey}
              onClick={() => setSelectedClass(classKey)}
              disabled={!isClassAvailable(classKey)}
              className={`
                relative p-3 rounded-lg border-2 text-center transition-all duration-200 transform hover:scale-105
                ${getClassColor(classKey, selectedClass === classKey)}
                ${!isClassAvailable(classKey) ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'cursor-pointer'}
              `}
            >
              {selectedClass === classKey && (
                <div className="absolute top-1 right-1">
                  <Check className="h-4 w-4" />
                </div>
              )}
              <div className="text-xs font-medium mb-1">
                {getClassDisplayName(classKey)}
              </div>
              <div className="text-sm font-bold mb-1">
                {formatPrice(flight.price[classKey])}
              </div>
              <div className="text-xs opacity-80">
                {isClassAvailable(classKey) 
                  ? `${getAvailableSeats(classKey)} seats` 
                  : 'Sold out'
                }
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Class Summary */}
      <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-blue-800">Selected: {getClassDisplayName(selectedClass)}</p>
            <p className="text-xs text-blue-600">{getAvailableSeats(selectedClass)} seats available</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-800">
              {formatPrice(flight.price[selectedClass])}
            </p>
            <p className="text-xs text-blue-600">per person</p>
          </div>
        </div>
      </div>

      {/* Flight Details */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{flight.aircraft}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4 text-blue-500" />
            <Coffee className="h-4 w-4 text-amber-600" />
            <Tv className="h-4 w-4 text-purple-500" />
          </div>
        </div>
        <div className="text-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
            getAvailableSeats(selectedClass) > 9 
              ? 'bg-green-100 text-green-800' 
              : getAvailableSeats(selectedClass) > 3 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {getAvailableSeats(selectedClass)} seats left in {selectedClass}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleSelectFlight}
        disabled={!isClassAvailable(selectedClass)}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isClassAvailable(selectedClass) 
          ? `Select Flight - ${formatPrice(flight.price[selectedClass] * state.searchFilters.passengers)}`
          : 'Class Not Available'
        }
      </button>
    </div>
  );
}