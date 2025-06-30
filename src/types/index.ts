export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: Airport;
  destination: Airport;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: {
    economy: number;
    premium: number;
    business: number;
    first: number;
  };
  aircraft: string;
  stops: number;
  availableSeats: {
    economy: number;
    premium: number;
    business: number;
    first: number;
  };
}

export interface SearchFilters {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  infants: number; // Added infants count
  travelClass: 'economy' | 'premium' | 'business' | 'first';
  tripType: 'one-way' | 'round-trip';
}

export interface Passenger {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passportNumber?: string;
  email: string;
  phone: string;
  type: 'adult' | 'child' | 'infant'; // Added passenger type
}

export interface Infant {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  parentId: string; // Links to the parent passenger
}

export interface Seat {
  id: string;
  seatNumber: string;
  class: 'economy' | 'premium' | 'business' | 'first';
  isAvailable: boolean;
  isSelected: boolean;
  price: number;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  rating: number;
  images: string[];
  amenities: string[];
  description: string;
  distanceFromAirport: number;
  distanceFromCity: number;
  rooms: HotelRoom[];
  reviews: {
    count: number;
    averageRating: number;
    highlights: string[];
  };
}

export interface HotelRoom {
  id: string;
  type: 'standard' | 'deluxe' | 'suite' | 'luxury';
  name: string;
  description: string;
  maxOccupancy: number;
  amenities: string[];
  images: string[];
  pricePerNight: number;
  available: boolean;
  size: string;
}

export interface HotelBooking {
  id: string;
  hotel: Hotel;
  room: HotelRoom;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  guestDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
}

export interface CabService {
  id: string;
  name: string;
  type: 'economy' | 'premium' | 'luxury' | 'suv';
  capacity: number;
  description: string;
  features: string[];
  pricePerKm: number;
  basePrice: number;
  image: string;
  rating: number;
}

export interface CabBooking {
  id: string;
  service: CabService;
  pickupLocation: string;
  dropLocation: string;
  pickupDateTime: string;
  distance: number;
  estimatedDuration: string;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  passengerDetails: {
    name: string;
    phone: string;
    passengers: number;
  };
  bookingType: 'airport-pickup' | 'airport-drop' | 'hotel-transfer' | 'custom';
}

export interface TravelPackage {
  id: string;
  flightBooking: Booking;
  hotelBooking?: HotelBooking;
  cabBookings: CabBooking[];
  totalAmount: number;
  savings: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  flight: Flight;
  passengers: Passenger[];
  infants: Infant[]; // Added infants array
  seats: Seat[];
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
}