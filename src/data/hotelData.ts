import { Hotel, CabService } from '../types';

export const generateHotelsForCity = (cityCode: string): Hotel[] => {
  const cityHotels: { [key: string]: Partial<Hotel>[] } = {
    'BOM': [
      {
        name: 'The Taj Mahal Palace',
        rating: 5,
        description: 'Iconic luxury hotel overlooking the Gateway of India',
        distanceFromAirport: 25,
        distanceFromCity: 2
      },
      {
        name: 'The Oberoi Mumbai',
        rating: 5,
        description: 'Contemporary luxury with stunning views of the Arabian Sea',
        distanceFromAirport: 22,
        distanceFromCity: 3
      },
      {
        name: 'ITC Grand Central',
        rating: 4.5,
        description: 'Modern business hotel in the heart of Mumbai',
        distanceFromAirport: 18,
        distanceFromCity: 5
      },
      {
        name: 'Hotel Sahara Star',
        rating: 4,
        description: 'Airport hotel with unique architecture and modern amenities',
        distanceFromAirport: 3,
        distanceFromCity: 20
      }
    ],
    'DEL': [
      {
        name: 'The Imperial New Delhi',
        rating: 5,
        description: 'Historic luxury hotel in the heart of New Delhi',
        distanceFromAirport: 15,
        distanceFromCity: 2
      },
      {
        name: 'The Leela Palace New Delhi',
        rating: 5,
        description: 'Opulent palace-style hotel with world-class amenities',
        distanceFromAirport: 12,
        distanceFromCity: 8
      },
      {
        name: 'Radisson Blu Plaza Delhi Airport',
        rating: 4.5,
        description: 'Premium airport hotel with excellent connectivity',
        distanceFromAirport: 2,
        distanceFromCity: 18
      },
      {
        name: 'Hotel Diplomat',
        rating: 4,
        description: 'Comfortable business hotel in Karol Bagh',
        distanceFromAirport: 20,
        distanceFromCity: 5
      }
    ],
    'BLR': [
      {
        name: 'The Ritz-Carlton Bangalore',
        rating: 5,
        description: 'Luxury hotel in the heart of Bangalore\'s business district',
        distanceFromAirport: 35,
        distanceFromCity: 2
      },
      {
        name: 'Taj West End',
        rating: 5,
        description: 'Heritage hotel with lush gardens and colonial charm',
        distanceFromAirport: 40,
        distanceFromCity: 3
      },
      {
        name: 'Hilton Bangalore Embassy GolfLinks',
        rating: 4.5,
        description: 'Modern hotel with golf course views',
        distanceFromAirport: 30,
        distanceFromCity: 8
      },
      {
        name: 'Fairfield by Marriott Bangalore Airport',
        rating: 4,
        description: 'Contemporary airport hotel with modern facilities',
        distanceFromAirport: 5,
        distanceFromCity: 45
      }
    ],
    'DXB': [
      {
        name: 'Burj Al Arab Jumeirah',
        rating: 5,
        description: 'World\'s most luxurious hotel with iconic sail-shaped architecture',
        distanceFromAirport: 20,
        distanceFromCity: 5
      },
      {
        name: 'Atlantis The Palm',
        rating: 5,
        description: 'Spectacular resort on the iconic Palm Jumeirah',
        distanceFromAirport: 25,
        distanceFromCity: 15
      },
      {
        name: 'Emirates Palace Abu Dhabi',
        rating: 5,
        description: 'Opulent palace hotel with private beach',
        distanceFromAirport: 45,
        distanceFromCity: 10
      },
      {
        name: 'Le Meridien Dubai Airport',
        rating: 4.5,
        description: 'Convenient airport hotel with direct terminal access',
        distanceFromAirport: 1,
        distanceFromCity: 25
      }
    ],
    'SIN': [
      {
        name: 'Marina Bay Sands',
        rating: 5,
        description: 'Iconic hotel with infinity pool and stunning city views',
        distanceFromAirport: 20,
        distanceFromCity: 2
      },
      {
        name: 'Raffles Singapore',
        rating: 5,
        description: 'Historic luxury hotel with colonial elegance',
        distanceFromAirport: 18,
        distanceFromCity: 3
      },
      {
        name: 'The Ritz-Carlton Millenia Singapore',
        rating: 5,
        description: 'Luxury hotel with panoramic harbor views',
        distanceFromAirport: 22,
        distanceFromCity: 4
      },
      {
        name: 'Crowne Plaza Changi Airport',
        rating: 4.5,
        description: 'Premium airport hotel connected to Terminal 3',
        distanceFromAirport: 0,
        distanceFromCity: 25
      }
    ]
  };

  const baseHotels = cityHotels[cityCode] || [
    {
      name: 'Grand Plaza Hotel',
      rating: 4,
      description: 'Comfortable hotel with modern amenities',
      distanceFromAirport: 15,
      distanceFromCity: 5
    },
    {
      name: 'Airport Inn',
      rating: 3.5,
      description: 'Convenient airport hotel for travelers',
      distanceFromAirport: 3,
      distanceFromCity: 20
    }
  ];

  return baseHotels.map((hotel, index) => ({
    id: `hotel-${cityCode}-${index + 1}`,
    name: hotel.name!,
    address: `${hotel.name} Street, ${getCityName(cityCode)}`,
    city: getCityName(cityCode),
    rating: hotel.rating!,
    images: [
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg'
    ],
    amenities: [
      'Free WiFi', 'Swimming Pool', 'Fitness Center', 'Restaurant', 
      'Room Service', 'Concierge', 'Business Center', 'Spa'
    ],
    description: hotel.description!,
    distanceFromAirport: hotel.distanceFromAirport!,
    distanceFromCity: hotel.distanceFromCity!,
    rooms: generateRoomsForHotel(hotel.rating!),
    reviews: {
      count: Math.floor(Math.random() * 1000) + 100,
      averageRating: hotel.rating! - 0.2 + Math.random() * 0.4,
      highlights: ['Great location', 'Excellent service', 'Clean rooms', 'Good value']
    }
  }));
};

const generateRoomsForHotel = (hotelRating: number) => {
  const basePrice = hotelRating * 2000;
  
  return [
    {
      id: 'standard',
      type: 'standard' as const,
      name: 'Standard Room',
      description: 'Comfortable room with essential amenities',
      maxOccupancy: 2,
      amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Fridge'],
      images: ['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'],
      pricePerNight: Math.round(basePrice * 0.8),
      available: true,
      size: '25 sqm'
    },
    {
      id: 'deluxe',
      type: 'deluxe' as const,
      name: 'Deluxe Room',
      description: 'Spacious room with city views and premium amenities',
      maxOccupancy: 3,
      amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'City View', 'Work Desk'],
      images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'],
      pricePerNight: Math.round(basePrice * 1.2),
      available: true,
      size: '35 sqm'
    },
    {
      id: 'suite',
      type: 'suite' as const,
      name: 'Executive Suite',
      description: 'Luxurious suite with separate living area',
      maxOccupancy: 4,
      amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Living Area', 'Kitchenette', 'Balcony'],
      images: ['https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg'],
      pricePerNight: Math.round(basePrice * 1.8),
      available: Math.random() > 0.3,
      size: '55 sqm'
    },
    {
      id: 'luxury',
      type: 'luxury' as const,
      name: 'Presidential Suite',
      description: 'Ultimate luxury with panoramic views and premium services',
      maxOccupancy: 6,
      amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Full Bar', 'Living Area', 'Kitchen', 'Balcony', 'Butler Service'],
      images: ['https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg'],
      pricePerNight: Math.round(basePrice * 3),
      available: Math.random() > 0.6,
      size: '85 sqm'
    }
  ];
};

const getCityName = (code: string): string => {
  const cityNames: { [key: string]: string } = {
    'DEL': 'Delhi',
    'BOM': 'Mumbai',
    'BLR': 'Bangalore',
    'MAA': 'Chennai',
    'CCU': 'Kolkata',
    'HYD': 'Hyderabad',
    'GOI': 'Goa',
    'COK': 'Kochi',
    'DXB': 'Dubai',
    'SIN': 'Singapore',
    'LHR': 'London',
    'JFK': 'New York',
    'CDG': 'Paris',
    'FRA': 'Frankfurt'
  };
  return cityNames[code] || 'City';
};

export const cabServices: CabService[] = [
  {
    id: 'economy-sedan',
    name: 'Economy Sedan',
    type: 'economy',
    capacity: 4,
    description: 'Comfortable and affordable ride for city travel',
    features: ['Air Conditioning', 'Music System', 'Phone Charging'],
    pricePerKm: 12,
    basePrice: 100,
    image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
    rating: 4.2
  },
  {
    id: 'premium-sedan',
    name: 'Premium Sedan',
    type: 'premium',
    capacity: 4,
    description: 'Premium comfort with professional drivers',
    features: ['Air Conditioning', 'Premium Music System', 'Phone Charging', 'Bottled Water', 'Newspapers'],
    pricePerKm: 18,
    basePrice: 150,
    image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
    rating: 4.5
  },
  {
    id: 'luxury-sedan',
    name: 'Luxury Sedan',
    type: 'luxury',
    capacity: 4,
    description: 'Luxury travel experience with top-end vehicles',
    features: ['Climate Control', 'Premium Sound System', 'Phone Charging', 'Refreshments', 'WiFi', 'Leather Seats'],
    pricePerKm: 25,
    basePrice: 250,
    image: 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg',
    rating: 4.8
  },
  {
    id: 'suv',
    name: 'SUV',
    type: 'suv',
    capacity: 7,
    description: 'Spacious SUV perfect for groups and families',
    features: ['Air Conditioning', 'Music System', 'Phone Charging', 'Extra Luggage Space', 'Captain Seats'],
    pricePerKm: 22,
    basePrice: 200,
    image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg',
    rating: 4.4
  }
];

export const generateCabBookingEstimate = (
  pickupLocation: string,
  dropLocation: string,
  service: CabService
) => {
  // Simulate distance calculation based on location types
  let distance = 15; // Default 15km
  
  if (pickupLocation.includes('Airport') || dropLocation.includes('Airport')) {
    distance = Math.floor(Math.random() * 30) + 15; // 15-45km for airport transfers
  } else if (pickupLocation.includes('Hotel') || dropLocation.includes('Hotel')) {
    distance = Math.floor(Math.random() * 20) + 5; // 5-25km for hotel transfers
  }
  
  const totalAmount = service.basePrice + (distance * service.pricePerKm);
  const estimatedDuration = `${Math.ceil(distance / 30 * 60)} mins`; // Assuming 30km/h average speed
  
  return {
    distance,
    totalAmount,
    estimatedDuration
  };
};