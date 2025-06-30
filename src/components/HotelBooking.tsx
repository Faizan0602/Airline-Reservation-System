import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Wifi, Car, Coffee, Dumbbell, Users, Calendar, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateHotelsForCity } from '../data/hotelData';
import { Hotel, HotelRoom } from '../types';

export default function HotelBooking() {
  const { state, dispatch } = useApp();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (state.selectedFlight) {
      const destinationHotels = generateHotelsForCity(state.selectedFlight.destination.code);
      setHotels(destinationHotels);
      
      // Set default dates based on flight
      const flightDate = new Date(state.selectedFlight.arrivalTime);
      const checkIn = new Date(flightDate);
      const checkOut = new Date(flightDate);
      checkOut.setDate(checkOut.getDate() + 2); // Default 2 nights
      
      setCheckInDate(checkIn.toISOString().split('T')[0]);
      setCheckOutDate(checkOut.toISOString().split('T')[0]);
    }
  }, [state.selectedFlight]);

  const handleBack = () => {
    if (showBookingForm) {
      setShowBookingForm(false);
      setSelectedHotel(null);
      setSelectedRoom(null);
    } else {
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'confirmation' });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTotalPrice = (room: HotelRoom) => {
    return room.pricePerNight * calculateNights();
  };

  const handleRoomSelect = (hotel: Hotel, room: HotelRoom) => {
    setSelectedHotel(hotel);
    setSelectedRoom(room);
    setShowBookingForm(true);
  };

  const handleBookHotel = () => {
    // Navigate to cab booking
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'cab-booking' });
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'free wifi':
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'swimming pool':
      case 'pool':
        return <div className="h-4 w-4 bg-blue-500 rounded"></div>;
      case 'fitness center':
      case 'gym':
        return <Dumbbell className="h-4 w-4" />;
      case 'restaurant':
        return <Coffee className="h-4 w-4" />;
      case 'parking':
        return <Car className="h-4 w-4" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  if (!state.selectedFlight) {
    return <div>No flight selected</div>;
  }

  if (showBookingForm && selectedHotel && selectedRoom) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <h1 className="text-2xl font-bold text-gray-900">Complete Hotel Booking</h1>
            <p className="text-gray-600">{selectedHotel.name} - {selectedRoom.name}</p>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img 
                src={selectedRoom.images[0]} 
                alt={selectedRoom.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold">{selectedRoom.name}</h3>
              <p className="text-gray-600 mb-2">{selectedRoom.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Up to {selectedRoom.maxOccupancy} guests</span>
                </span>
                <span>{selectedRoom.size}</span>
              </div>
            </div>
            
            <div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in</span>
                  <span className="font-medium">{new Date(checkInDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out</span>
                  <span className="font-medium">{new Date(checkOutDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nights</span>
                  <span className="font-medium">{calculateNights()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-medium">{guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rate per night</span>
                  <span className="font-medium">{formatPrice(selectedRoom.pricePerNight)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">{formatPrice(getTotalPrice(selectedRoom))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setShowBookingForm(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Choose Different Room
          </button>
          <button
            onClick={handleBookHotel}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-semibold"
          >
            Continue to Cab Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Confirmation</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hotels in {state.selectedFlight.destination.city}</h1>
          <p className="text-gray-600">Find the perfect stay for your trip</p>
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate || new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-center">
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-lg font-semibold text-blue-600">{calculateNights()} Night{calculateNights() !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hotels List */}
      <div className="space-y-6">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="md:flex">
              {/* Hotel Image */}
              <div className="md:w-1/3">
                <img 
                  src={hotel.images[0]} 
                  alt={hotel.name}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              
              {/* Hotel Details */}
              <div className="md:w-2/3 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < hotel.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({hotel.reviews.count} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{hotel.distanceFromAirport}km from airport</span>
                      </span>
                      <span>{hotel.distanceFromCity}km from city center</span>
                    </div>
                    <p className="text-gray-600 mb-4">{hotel.description}</p>
                    
                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.slice(0, 6).map((amenity, index) => (
                        <span 
                          key={index}
                          className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Room Options */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Available Rooms</h4>
                  {hotel.rooms.filter(room => room.available && room.maxOccupancy >= guests).map((room) => (
                    <div key={room.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <div>
                        <h5 className="font-medium text-gray-900">{room.name}</h5>
                        <p className="text-sm text-gray-600">{room.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>Up to {room.maxOccupancy}</span>
                          </span>
                          <span>{room.size}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{formatPrice(room.pricePerNight)}</p>
                        <p className="text-xs text-gray-500">per night</p>
                        {calculateNights() > 0 && (
                          <p className="text-sm font-semibold text-gray-900">
                            Total: {formatPrice(getTotalPrice(room))}
                          </p>
                        )}
                        <button
                          onClick={() => handleRoomSelect(hotel, room)}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                        >
                          <span>Select</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skip Hotel Booking */}
      <div className="mt-8 text-center">
        <button
          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'cab-booking' })}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Skip Hotel Booking
        </button>
      </div>
    </div>
  );
}