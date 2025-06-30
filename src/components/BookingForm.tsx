import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Calendar, CreditCard, Baby } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Passenger, Infant } from '../types';

export default function BookingForm() {
  const { state, dispatch } = useApp();
  const totalTravelers = state.searchFilters.passengers + (state.searchFilters.infants || 0);
  
  const [passengers, setPassengers] = useState<Passenger[]>(
    Array.from({ length: state.searchFilters.passengers }, (_, i) => ({
      id: `passenger-${i + 1}`,
      title: 'Mr',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: i === 0 ? state.user?.email || '' : '',
      phone: i === 0 ? state.user?.phone || '' : '',
      passportNumber: '',
      type: 'adult' as const
    }))
  );

  const [infants, setInfants] = useState<Infant[]>(
    Array.from({ length: state.searchFilters.infants || 0 }, (_, i) => ({
      id: `infant-${i + 1}`,
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      parentId: passengers[0]?.id || `passenger-1` // Default to first passenger
    }))
  );

  const [contactInfo, setContactInfo] = useState({
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'seats' });
  };

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    setPassengers(prev => prev.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    ));
  };

  const updateInfant = (index: number, field: keyof Infant, value: string) => {
    setInfants(prev => prev.map((infant, i) => 
      i === index ? { ...infant, [field]: value } : infant
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Check if this is an international flight
  const isInternationalFlight = () => {
    if (!state.selectedFlight) return false;
    return state.selectedFlight.origin.country !== state.selectedFlight.destination.country;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.selectedFlight || !state.selectedSeats) return;

    const booking = {
      id: `booking-${Date.now()}`,
      bookingReference: `SW${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      flight: state.selectedFlight,
      passengers,
      infants,
      seats: state.selectedSeats,
      totalAmount: getTotalPrice(),
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'SET_CURRENT_BOOKING', payload: booking });
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'payment' });
  };

  const getTotalPrice = () => {
    const flightPrice = state.selectedFlight?.price[state.searchFilters.travelClass] || 0;
    const seatPrice = state.selectedSeats?.reduce((total, seat) => total + seat.price, 0) || 0;
    const infantPrice = (state.searchFilters.infants || 0) * (flightPrice * 0.1); // 10% of adult fare for infants
    return (flightPrice * state.searchFilters.passengers) + seatPrice + infantPrice;
  };

  const isFormValid = () => {
    const passengersValid = passengers.every(p => {
      const basicFieldsValid = p.firstName && p.lastName && p.dateOfBirth && p.email;
      // For international flights, passport is mandatory
      const passportValid = isInternationalFlight() ? p.passportNumber : true;
      return basicFieldsValid && passportValid;
    });
    const infantsValid = infants.every(i => 
      i.firstName && i.lastName && i.dateOfBirth
    );
    const contactValid = contactInfo.email && contactInfo.phone;
    return passengersValid && infantsValid && contactValid;
  };

  const getMaxInfantDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 2);
    return today.toISOString().split('T')[0];
  };

  if (!state.selectedFlight) {
    return <div>No flight selected</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Seat Selection</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Passenger Details</h1>
          <p className="text-gray-600">
            {state.selectedFlight.flightNumber} - {state.selectedFlight.origin.code} → {state.selectedFlight.destination.code}
            {isInternationalFlight() && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                International Flight
              </span>
            )}
          </p>
        </div>
      </div>

      {/* International Flight Notice */}
      {isInternationalFlight() && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-amber-800">International Flight Requirements</h3>
              <p className="text-sm text-amber-700 mt-1">
                This is an international flight from {state.selectedFlight.origin.country} to {state.selectedFlight.destination.country}. 
                Passport information is <strong>mandatory</strong> for all passengers.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Adult Passenger Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Adult Passenger Information</span>
          </h2>
          
          {passengers.map((passenger, index) => (
            <div key={passenger.id} className="mb-8 last:mb-0">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Adult Passenger {index + 1}</span>
                {state.selectedSeats && state.selectedSeats[index] && (
                  <span className="text-sm text-gray-600">
                    (Seat {state.selectedSeats[index].seatNumber})
                  </span>
                )}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={passenger.title}
                    onChange={(e) => updatePassenger(index, 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={passenger.firstName}
                    onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={passenger.lastName}
                    onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={passenger.dateOfBirth}
                    onChange={(e) => updatePassenger(index, 'dateOfBirth', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={passenger.email}
                    onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={passenger.phone}
                    onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passport Number 
                    {isInternationalFlight() ? (
                      <span className="text-red-500">*</span>
                    ) : (
                      <span className="text-gray-500">(for international flights)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={passenger.passportNumber}
                    onChange={(e) => updatePassenger(index, 'passportNumber', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={isInternationalFlight() ? "Required for international flights" : "Optional for domestic flights"}
                    required={isInternationalFlight()}
                  />
                </div>
              </div>
              
              {index < passengers.length - 1 && <hr className="mt-6" />}
            </div>
          ))}
        </div>

        {/* Infant Information */}
        {infants.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Baby className="h-5 w-5" />
              <span>Infant Information (Under 2 years)</span>
            </h2>
            
            {infants.map((infant, index) => (
              <div key={infant.id} className="mb-8 last:mb-0">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                  <Baby className="h-5 w-5" />
                  <span>Infant {index + 1}</span>
                  <span className="text-sm text-gray-600">(Traveling on parent's lap)</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={infant.firstName}
                      onChange={(e) => updateInfant(index, 'firstName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={infant.lastName}
                      onChange={(e) => updateInfant(index, 'lastName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={infant.dateOfBirth}
                      onChange={(e) => updateInfant(index, 'dateOfBirth', e.target.value)}
                      min={getMaxInfantDate()}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Traveling with <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={infant.parentId}
                      onChange={(e) => updateInfant(index, 'parentId', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {passengers.map((passenger, pIndex) => (
                        <option key={passenger.id} value={passenger.id}>
                          Adult Passenger {pIndex + 1} ({passenger.firstName || 'Unnamed'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> Infants under 2 years travel on the parent's lap and typically pay 10% of the adult fare. 
                    No separate seat is assigned for infants.
                  </p>
                </div>
                
                {index < infants.length - 1 && <hr className="mt-6" />}
              </div>
            ))}
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Contact Information</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={contactInfo.emergencyContact.name}
                onChange={(e) => setContactInfo(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={contactInfo.emergencyContact.phone}
                onChange={(e) => setContactInfo(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
              <select
                value={contactInfo.emergencyContact.relationship}
                onChange={(e) => setContactInfo(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select relationship</option>
                <option value="spouse">Spouse</option>
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Booking Summary</span>
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Flight</span>
              <span className="font-medium">
                {state.selectedFlight.flightNumber} - {state.selectedFlight.origin.code} → {state.selectedFlight.destination.code}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Adult Passengers</span>
              <span className="font-medium">{state.searchFilters.passengers}</span>
            </div>
            
            {(state.searchFilters.infants || 0) > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Infants</span>
                <span className="font-medium">{state.searchFilters.infants}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Class</span>
              <span className="font-medium capitalize">{state.searchFilters.travelClass}</span>
            </div>
            
            {state.selectedSeats && state.selectedSeats.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Selected Seats</span>
                <span className="font-medium">
                  {state.selectedSeats.map(seat => seat.seatNumber).join(', ')}
                </span>
              </div>
            )}
            
            <hr />
            
            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Adult fare ({state.searchFilters.passengers}x)</span>
                <span>{formatPrice(state.selectedFlight.price[state.searchFilters.travelClass] * state.searchFilters.passengers)}</span>
              </div>
              
              {(state.searchFilters.infants || 0) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Infant fare ({state.searchFilters.infants}x)</span>
                  <span>{formatPrice((state.searchFilters.infants || 0) * (state.selectedFlight.price[state.searchFilters.travelClass] * 0.1))}</span>
                </div>
              )}
              
              {state.selectedSeats && state.selectedSeats.reduce((total, seat) => total + seat.price, 0) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Seat fees</span>
                  <span>+{formatPrice(state.selectedSeats.reduce((total, seat) => total + seat.price, 0))}</span>
                </div>
              )}
            </div>
            
            <hr />
            
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount</span>
              <span className="text-blue-600">{formatPrice(getTotalPrice())}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isFormValid()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-8 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}