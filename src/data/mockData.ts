import { Airport, Flight, Seat } from '../types';

export const airports: Airport[] = [
  // Major Indian Domestic Airports
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India' },
  { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India' },
  { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India' },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'India' },
  { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India' },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', country: 'India' },
  { code: 'PNQ', name: 'Pune Airport', city: 'Pune', country: 'India' },
  { code: 'GOI', name: 'Goa International Airport', city: 'Goa', country: 'India' },
  { code: 'COK', name: 'Cochin International Airport', city: 'Kochi', country: 'India' },
  { code: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', country: 'India' },
  { code: 'LKO', name: 'Chaudhary Charan Singh International Airport', city: 'Lucknow', country: 'India' },
  { code: 'IXC', name: 'Chandigarh Airport', city: 'Chandigarh', country: 'India' },
  { code: 'IXB', name: 'Bagdogra Airport', city: 'Bagdogra', country: 'India' },
  { code: 'GAU', name: 'Lokpriya Gopinath Bordoloi International Airport', city: 'Guwahati', country: 'India' },
  
  // International Destinations from India
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
  { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'UK' },
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia' },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong' },
];

// Airlines for different route types
const domesticAirlines = ['Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia India'];
const internationalAirlines = ['Air India', 'Emirates', 'Singapore Airlines', 'British Airways', 'Lufthansa', 'Qatar Airways', 'Thai Airways', 'Malaysia Airlines', 'Korean Air', 'Cathay Pacific'];
const aircraftTypes = ['Airbus A320', 'Boeing 737', 'Airbus A321', 'Boeing 777', 'Airbus A350', 'Boeing 787', 'Airbus A330'];

// Function to generate flights for ANY route
export const generateFlightsForRoute = (
  originCode: string,
  destinationCode: string,
  searchDate: string
): Flight[] => {
  console.log('🔍 GENERATING FLIGHTS FOR:', { originCode, destinationCode, searchDate });
  
  const origin = airports.find(a => a.code === originCode);
  const destination = airports.find(a => a.code === destinationCode);
  
  if (!origin || !destination) {
    console.log('❌ Airport not found:', { originCode, destinationCode, origin: !!origin, destination: !!destination });
    return [];
  }

  console.log('✅ Airports found:', {
    origin: `${origin.city} (${origin.code}) - ${origin.country}`,
    destination: `${destination.city} (${destination.code}) - ${destination.country}`
  });

  const flights: Flight[] = [];
  const isInternational = origin.country !== destination.country;
  
  console.log('🌍 Route type:', isInternational ? 'INTERNATIONAL' : 'DOMESTIC');
  
  const airlines = isInternational ? internationalAirlines : domesticAirlines;
  
  // Enhanced base prices with better international coverage
  const getBasePrices = () => {
    if (isInternational) {
      console.log('💰 Calculating international prices...');
      
      // Specific route pricing
      const routeKey = `${originCode}-${destinationCode}`;
      const reverseRouteKey = `${destinationCode}-${originCode}`;
      
      const specificPrices: { [key: string]: any } = {
        // India to UAE
        'DEL-DXB': { economy: 18500, premium: 32500, business: 58500, first: 95000 },
        'BOM-DXB': { economy: 16800, premium: 29800, business: 52800, first: 88000 },
        'BLR-DXB': { economy: 19200, premium: 33500, business: 59800, first: 96500 },
        
        // India to Singapore
        'DEL-SIN': { economy: 28500, premium: 48500, business: 85500, first: 145000 },
        'BOM-SIN': { economy: 26500, premium: 45500, business: 82500, first: 140000 },
        'BLR-SIN': { economy: 24500, premium: 42500, business: 78500, first: 135000 },
        
        // India to UK
        'DEL-LHR': { economy: 45500, premium: 78500, business: 135500, first: 225000 },
        'BOM-LHR': { economy: 47000, premium: 80000, business: 138000, first: 228000 },
        
        // India to USA
        'DEL-JFK': { economy: 65000, premium: 110000, business: 185000, first: 295000 },
        'BOM-JFK': { economy: 67000, premium: 112000, business: 187000, first: 297000 },
        
        // India to Europe
        'DEL-CDG': { economy: 42000, premium: 72000, business: 125000, first: 205000 },
        'DEL-FRA': { economy: 43000, premium: 73000, business: 126000, first: 206000 },
        
        // India to Asia
        'DEL-NRT': { economy: 35000, premium: 60000, business: 105000, first: 175000 },
        'DEL-BKK': { economy: 22000, premium: 38000, business: 68000, first: 115000 },
        'DEL-KUL': { economy: 24000, premium: 41000, business: 72000, first: 125000 },
        'DEL-ICN': { economy: 32000, premium: 55000, business: 95000, first: 160000 },
        'DEL-HKG': { economy: 30000, premium: 52000, business: 90000, first: 155000 },
        
        // India to Australia
        'DEL-SYD': { economy: 55000, premium: 95000, business: 165000, first: 275000 },
        'BOM-SYD': { economy: 57000, premium: 97000, business: 167000, first: 277000 },
      };
      
      // Check for specific route pricing
      if (specificPrices[routeKey]) {
        console.log('📊 Using specific pricing for route:', routeKey);
        return specificPrices[routeKey];
      }
      
      // Check reverse route pricing
      if (specificPrices[reverseRouteKey]) {
        console.log('📊 Using reverse route pricing for:', reverseRouteKey);
        const reversePrice = specificPrices[reverseRouteKey];
        return {
          economy: reversePrice.economy + 500,
          premium: reversePrice.premium + 1000,
          business: reversePrice.business + 2000,
          first: reversePrice.first + 3000
        };
      }
      
      // Default international pricing based on destination region
      if (destinationCode === 'DXB' || originCode === 'DXB') {
        console.log('📊 Using UAE default pricing');
        return { economy: 18000, premium: 32000, business: 58000, first: 95000 };
      } else if (['SIN', 'BKK', 'KUL', 'HKG'].includes(destinationCode) || ['SIN', 'BKK', 'KUL', 'HKG'].includes(originCode)) {
        console.log('📊 Using Southeast Asia default pricing');
        return { economy: 25000, premium: 43000, business: 78000, first: 135000 };
      } else if (['LHR', 'CDG', 'FRA'].includes(destinationCode) || ['LHR', 'CDG', 'FRA'].includes(originCode)) {
        console.log('📊 Using Europe default pricing');
        return { economy: 44000, premium: 75000, business: 130000, first: 215000 };
      } else if (['JFK'].includes(destinationCode) || ['JFK'].includes(originCode)) {
        console.log('📊 Using USA default pricing');
        return { economy: 65000, premium: 110000, business: 185000, first: 295000 };
      } else {
        console.log('📊 Using general international default pricing');
        return { economy: 30000, premium: 50000, business: 85000, first: 150000 };
      }
    } else {
      console.log('💰 Calculating domestic prices...');
      
      // Domestic route pricing
      const routeKey = `${originCode}-${destinationCode}`;
      const specificDomesticPrices: { [key: string]: any } = {
        'DEL-BOM': { economy: 4500, premium: 7500, business: 12500, first: 18500 },
        'BOM-DEL': { economy: 4800, premium: 7800, business: 12800, first: 18800 },
        'DEL-BLR': { economy: 5200, premium: 8200, business: 13800, first: 19800 },
        'BLR-DEL': { economy: 5400, premium: 8400, business: 14000, first: 20000 },
        'BOM-GOI': { economy: 3200, premium: 5500, business: 9200, first: 14200 },
        'GOI-BOM': { economy: 3400, premium: 5700, business: 9400, first: 14400 },
      };
      
      if (specificDomesticPrices[routeKey]) {
        console.log('📊 Using specific domestic pricing for:', routeKey);
        return specificDomesticPrices[routeKey];
      }
      
      console.log('📊 Using default domestic pricing');
      return { economy: 4000, premium: 6500, business: 11000, first: 16500 };
    }
  };

  const basePrices = getBasePrices();
  console.log('💰 Base prices calculated:', basePrices);
  
  // Generate 8-12 flights per route per day
  const flightCount = 8 + Math.floor(Math.random() * 5); // 8-12 flights
  console.log(`✈️ Generating ${flightCount} flights...`);
  
  for (let i = 0; i < flightCount; i++) {
    const airline = airlines[i % airlines.length];
    const aircraft = aircraftTypes[i % aircraftTypes.length];
    
    // Generate realistic flight numbers
    const airlineCode = airline === 'Air India' ? 'AI' : 
                       airline === 'IndiGo' ? '6E' :
                       airline === 'SpiceJet' ? 'SG' :
                       airline === 'Vistara' ? 'UK' :
                       airline === 'GoAir' ? 'G8' :
                       airline === 'AirAsia India' ? 'I5' :
                       airline === 'Emirates' ? 'EK' :
                       airline === 'Singapore Airlines' ? 'SQ' :
                       airline === 'British Airways' ? 'BA' :
                       airline === 'Lufthansa' ? 'LH' :
                       airline === 'Qatar Airways' ? 'QR' :
                       airline === 'Thai Airways' ? 'TG' :
                       airline === 'Malaysia Airlines' ? 'MH' :
                       airline === 'Korean Air' ? 'KE' :
                       airline === 'Cathay Pacific' ? 'CX' :
                       airline.substring(0, 2).toUpperCase();
    
    const flightNumber = `${airlineCode}${(100 + i + Math.floor(Math.random() * 800)).toString()}`;
    
    // Generate departure times throughout the day (5 AM to 11 PM)
    const baseHour = 5 + (i * 2) % 18; // Spread flights throughout the day
    const minute = Math.floor(Math.random() * 60);
    
    // Calculate realistic flight duration
    const baseDuration = isInternational ? 
      (Math.random() * 6 + 3) : // 3-9 hours for international
      (Math.random() * 2.5 + 1.5); // 1.5-4 hours for domestic
    
    const durationHours = Math.floor(baseDuration);
    const durationMinutes = Math.round((baseDuration - durationHours) * 60);
    
    // Create departure and arrival times
    const departureDate = new Date(searchDate);
    departureDate.setHours(baseHour, minute, 0, 0);
    
    const arrivalDate = new Date(departureDate);
    arrivalDate.setHours(arrivalDate.getHours() + durationHours, arrivalDate.getMinutes() + durationMinutes);
    
    // Price variation (80% to 130% of base price)
    const priceMultiplier = 0.8 + (Math.random() * 0.5);
    
    // Determine stops (international flights more likely to have stops)
    const stops = isInternational ? 
      (Math.random() < 0.6 ? 0 : Math.random() < 0.9 ? 1 : 2) : // International: 60% non-stop, 30% 1-stop, 10% 2-stop
      (Math.random() < 0.8 ? 0 : 1); // Domestic: 80% non-stop, 20% 1-stop
    
    const flight: Flight = {
      id: `${originCode}-${destinationCode}-${searchDate}-${i + 1}`,
      flightNumber,
      airline,
      origin,
      destination,
      departureTime: departureDate.toISOString(),
      arrivalTime: arrivalDate.toISOString(),
      duration: `${durationHours}h ${durationMinutes}m`,
      price: {
        economy: Math.round(basePrices.economy * priceMultiplier),
        premium: Math.round(basePrices.premium * priceMultiplier),
        business: Math.round(basePrices.business * priceMultiplier),
        first: Math.round(basePrices.first * priceMultiplier)
      },
      aircraft,
      stops,
      availableSeats: {
        economy: Math.floor(Math.random() * 50) + 80, // 80-130 seats
        premium: Math.floor(Math.random() * 15) + 15, // 15-30 seats
        business: Math.floor(Math.random() * 10) + 10, // 10-20 seats
        first: Math.floor(Math.random() * 6) + 4 // 4-10 seats
      }
    };
    
    flights.push(flight);
    
    console.log(`✅ Flight ${i + 1}/${flightCount} generated:`, {
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      price: flight.price.economy,
      duration: flight.duration,
      stops: flight.stops
    });
  }
  
  console.log(`🎯 SUCCESSFULLY GENERATED ${flights.length} flights for ${origin.city} → ${destination.city} (${isInternational ? 'International' : 'Domestic'})`);
  return flights;
};

// Pre-generated popular routes (for faster loading)
export const mockFlights: Flight[] = [];

// Generate some popular routes on app load
const popularRoutes = [
  ['DEL', 'BOM'], ['BOM', 'DEL'], ['DEL', 'BLR'], ['BLR', 'DEL'],
  ['BOM', 'BLR'], ['BLR', 'BOM'], ['BOM', 'GOI'], ['GOI', 'BOM'],
  ['DEL', 'DXB'], ['DXB', 'DEL'], ['DEL', 'SIN'], ['SIN', 'DEL']
];

// Generate flights for popular routes for today
const today = new Date().toISOString().split('T')[0];
popularRoutes.forEach(([origin, destination]) => {
  const flights = generateFlightsForRoute(origin, destination, today);
  mockFlights.push(...flights);
});

console.log(`🚀 Pre-loaded ${mockFlights.length} flights for popular routes`);

export const generateSeats = (flightId: string): Seat[] => {
  const seats: Seat[] = [];
  const rows = 35; // Increased rows for more seats
  const seatsPerRow = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  for (let row = 1; row <= rows; row++) {
    for (const letter of seatsPerRow) {
      const seatNumber = `${row}${letter}`;
      const seatClass = row <= 4 ? 'first' : row <= 12 ? 'business' : row <= 20 ? 'premium' : 'economy';
      const basePrice = seatClass === 'first' ? 2500 : seatClass === 'business' ? 1500 : seatClass === 'premium' ? 800 : 0;
      
      seats.push({
        id: `${flightId}-${seatNumber}`,
        seatNumber,
        class: seatClass,
        isAvailable: Math.random() > 0.25, // 75% availability
        isSelected: false,
        price: basePrice + Math.floor(Math.random() * 500) // Add some price variation
      });
    }
  }
  
  return seats;
};