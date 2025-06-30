import React, { useState } from 'react';
import { ArrowLeft, MapPin, Star, Users, Clock, Car, Shield, Wifi } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cabServices, generateCabBookingEstimate } from '../data/hotelData';
import { CabService } from '../types';

export default function CabBooking() {
  const { state, dispatch } = useApp();
  const [selectedService, setSelectedService] = useState<CabService | null>(null);
  const [bookingType, setBookingType] = useState<'airport-pickup' | 'airport-drop' | 'hotel-transfer'>('airport-pickup');
  const [pickupDateTime, setPickupDateTime] = useState('');
  const [customPickup, setCustomPickup] = useState('');
  const [customDrop, setCustomDrop] = useState('');
  const [passengers, setPassengers] = useState(state.searchFilters.passengers);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleBack = () => {
    if (showBookingForm) {
      setShowBookingForm(false);
      setSelectedService(null);
    } else {
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'hotel-booking' });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPickupLocation = () => {
    switch (bookingType) {
      case 'airport-pickup':
        return `${state.selectedFlight?.destination.name}`;
      case 'airport-drop':
        return customPickup || 'Hotel/City Location';
      case 'hotel-transfer':
        return customPickup || 'Current Location';
      default:
        return 'Pickup Location';
    }
  };

  const getDropLocation = () => {
    switch (bookingType) {
      case 'airport-pickup':
        return customDrop || 'Hotel/City Destination';
      case 'airport-drop':
        return `${state.selectedFlight?.origin.name}`;
      case 'hotel-transfer':
        return customDrop || 'Destination';
      default:
        return 'Drop Location';
    }
  };

  const getEstimate = (service: CabService) => {
    return generateCabBookingEstimate(getPickupLocation(), getDropLocation(), service);
  };

  const handleServiceSelect = (service: CabService) => {
    setSelectedService(service);
    setShowBookingForm(true);
  };

  const handleBookCab = () => {
    // Navigate to travel package summary
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'travel-package' });
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'economy':
        return <Car className="h-6 w-6 text-blue-600" />;
      case 'premium':
        return <Car className="h-6 w-6 text-green-600" />;
      case 'luxury':
        return <Car className="h-6 w-6 text-purple-600" />;
      case 'suv':
        return <Car className="h-6 w-6 text-orange-600" />;
      default:
        return <Car className="h-6 w-6 text-gray-600" />;
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'economy':
        return 'border-blue-200 hover:border-blue-400';
      case 'premium':
        return 'border-green-200 hover:border-green-400';
      case 'luxury':
        return 'border-purple-200 hover:border-purple-400';
      case 'suv':
        return 'border-orange-200 hover:border-orange-400';
      default:
        return 'border-gray-200 hover:border-gray-400';
    }
  };

  if (!state.selectedFlight) {
    return <div>No flight selected</div>;
  }

  if (showBookingForm && selectedService) {
    const estimate = getEstimate(selectedService);
    
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Cab Services</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Complete Cab Booking</h1>
            <p className="text-gray-600">{selectedService.name} - {bookingType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img 
                src={selectedService.image} 
                alt={selectedService.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold">{selectedService.name}</h3>
              <p className="text-gray-600 mb-2">{selectedService.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Up to {selectedService.capacity} passengers</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{selectedService.rating}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedService.features.map((feature, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup</span>
                  <span className="font-medium text-right">{getPickupLocation()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Drop</span>
                  <span className="font-medium text-right">{getDropLocation()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance</span>
                  <span className="font-medium">{estimate.distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{estimate.estimatedDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passengers</span>
                  <span className="font-medium">{passengers}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">{formatPrice(estimate.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pickup Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date & Time</label>
              <input
                type="datetime-local"
                value={pickupDateTime}
                onChange={(e) => setPickupDateTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
              <input
                type="tel"
                defaultValue={state.user?.phone}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setShowBookingForm(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Choose Different Service
          </button>
          <button
            onClick={handleBookCab}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-semibold"
          >
            Continue to Package Summary
          </button>
        </div>
      </div>
    );
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
          <span>Back to Hotels</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Airport & City Transfers</h1>
          <p className="text-gray-600">Book reliable cab services for your journey</p>
        </div>
      </div>

      {/* Booking Type Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Transfer Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setBookingType('airport-pickup')}
            className={`p-4 border-2 rounded-lg transition-all ${
              bookingType === 'airport-pickup' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold">Airport Pickup</h3>
              <p className="text-sm text-gray-600">From airport to hotel/city</p>
            </div>
          </button>
          
          <button
            onClick={() => setBookingType('airport-drop')}
            className={`p-4 border-2 rounded-lg transition-all ${
              bookingType === 'airport-drop' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold">Airport Drop</h3>
              <p className="text-sm text-gray-600">From hotel/city to airport</p>
            </div>
          </button>
          
          <button
            onClick={() => setBookingType('hotel-transfer')}
            className={`p-4 border-2 rounded-lg transition-all ${
              bookingType === 'hotel-transfer' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="text-center">
              <Car className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold">City Transfer</h3>
              <p className="text-sm text-gray-600">Local city transportation</p>
            </div>
          </button>
        </div>
      </div>

      {/* Route Information */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
            <input
              type="text"
              value={getPickupLocation()}
              onChange={(e) => setCustomPickup(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter pickup location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Drop Location</label>
            <input
              type="text"
              value={getDropLocation()}
              onChange={(e) => setCustomDrop(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter drop location"
            />
          </div>
        </div>
      </div>

      {/* Cab Services */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Available Services</h2>
        
        {cabServices.map((service) => {
          const estimate = getEstimate(service);
          
          return (
            <div 
              key={service.id} 
              className={`bg-white rounded-xl shadow-lg border-2 transition-all hover:shadow-xl ${getServiceColor(service.type)}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={service.image} 
                        alt={service.name}
                        className="w-20 h-16 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getServiceIcon(service.type)}
                        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
                          {service.type}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{service.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>Up to {service.capacity}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{service.rating}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{estimate.estimatedDuration}</span>
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {service.features.slice(0, 4).map((feature, index) => (
                          <span 
                            key={index}
                            className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {feature === 'WiFi' && <Wifi className="h-3 w-3" />}
                            {feature === 'Phone Charging' && <div className="h-3 w-3 bg-green-500 rounded"></div>}
                            {feature === 'Air Conditioning' && <div className="h-3 w-3 bg-blue-500 rounded"></div>}
                            <span>{feature}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="mb-2">
                      <p className="text-2xl font-bold text-blue-600">{formatPrice(estimate.totalAmount)}</p>
                      <p className="text-sm text-gray-600">{estimate.distance} km</p>
                    </div>
                    
                    <button
                      onClick={() => handleServiceSelect(service)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skip Cab Booking */}
      <div className="mt-8 text-center">
        <button
          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'travel-package' })}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Skip Cab Booking
        </button>
      </div>
    </div>
  );
}