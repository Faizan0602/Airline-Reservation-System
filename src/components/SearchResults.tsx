import React, { useState } from 'react';
import { Filter, SortAsc, SortDesc, ArrowLeft, Plane } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FlightCard from './FlightCard';
import { Flight } from '../types';

export default function SearchResults() {
  const { state, dispatch } = useApp();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [priceRange, setPriceRange] = useState([0, 300000]); // Increased for international flights
  const [maxStops, setMaxStops] = useState(2);
  const [airlines, setAirlines] = useState<string[]>([]);
  const [classFilter, setClassFilter] = useState<string>('all'); // New class filter

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'search' });
  };

  console.log('SearchResults - Current state:', {
    searchResults: state.searchResults,
    searchResultsLength: state.searchResults.length,
    currentView: state.currentView,
    searchFilters: state.searchFilters
  });

  const sortFlights = (flights: Flight[]) => {
    return [...flights].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          // Sort by the lowest price across all classes
          aValue = Math.min(a.price.economy, a.price.premium, a.price.business, a.price.first);
          bValue = Math.min(b.price.economy, b.price.premium, b.price.business, b.price.first);
          break;
        case 'duration':
          aValue = parseInt(a.duration.replace(/[^\d]/g, ''));
          bValue = parseInt(b.duration.replace(/[^\d]/g, ''));
          break;
        case 'departure':
          aValue = new Date(a.departureTime).getTime();
          bValue = new Date(b.departureTime).getTime();
          break;
        default:
          return 0;
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  const filterFlights = (flights: Flight[]) => {
    return flights.filter(flight => {
      // Get the minimum price across all classes for filtering
      const minPrice = Math.min(flight.price.economy, flight.price.premium, flight.price.business, flight.price.first);
      const maxPrice = Math.max(flight.price.economy, flight.price.premium, flight.price.business, flight.price.first);
      
      const stopsMatch = flight.stops <= maxStops;
      const priceMatch = minPrice >= priceRange[0] && maxPrice <= priceRange[1];
      const airlineMatch = airlines.length === 0 || airlines.includes(flight.airline);
      
      // Class availability filter
      let classMatch = true;
      if (classFilter !== 'all') {
        const classKey = classFilter as keyof typeof flight.availableSeats;
        classMatch = flight.availableSeats[classKey] > 0;
      }
      
      return stopsMatch && priceMatch && airlineMatch && classMatch;
    });
  };

  const filteredAndSortedFlights = sortFlights(filterFlights(state.searchResults));
  const uniqueAirlines = [...new Set(state.searchResults.map(f => f.airline))];

  console.log('SearchResults - Filtered flights:', {
    originalCount: state.searchResults.length,
    filteredCount: filteredAndSortedFlights.length,
    priceRange,
    maxStops,
    airlines,
    classFilter
  });

  const toggleAirline = (airline: string) => {
    setAirlines(prev => 
      prev.includes(airline) 
        ? prev.filter(a => a !== airline)
        : [...prev, airline]
    );
  };

  // Get airport names for display
  const getAirportName = (code: string) => {
    const airportNames: { [key: string]: string } = {
      'DEL': 'Delhi', 'BOM': 'Mumbai', 'BLR': 'Bangalore', 'MAA': 'Chennai',
      'CCU': 'Kolkata', 'HYD': 'Hyderabad', 'GOI': 'Goa', 'COK': 'Kochi',
      'DXB': 'Dubai', 'SIN': 'Singapore', 'LHR': 'London', 'JFK': 'New York',
      'CDG': 'Paris', 'FRA': 'Frankfurt', 'NRT': 'Tokyo', 'SYD': 'Sydney',
      'BKK': 'Bangkok', 'KUL': 'Kuala Lumpur', 'ICN': 'Seoul', 'HKG': 'Hong Kong'
    };
    return airportNames[code] || code;
  };

  // Show no results message if no flights found
  if (state.searchResults.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Search</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
              <p className="text-gray-600">
                {state.searchFilters.origin && state.searchFilters.destination 
                  ? `${getAirportName(state.searchFilters.origin)} → ${getAirportName(state.searchFilters.destination)}`
                  : 'Flight Search Results'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-4 rounded-full">
              <Plane className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Flights Found</h2>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            We couldn't find any flights for the route{' '}
            <strong>
              {getAirportName(state.searchFilters.origin)} → {getAirportName(state.searchFilters.destination)}
            </strong>
            {' '}on your selected date.
          </p>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Suggestions:</h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• Try different dates - flights may be available on other days</li>
                <li>• Check if you've selected the correct airports</li>
                <li>• Consider nearby airports or connecting flights</li>
                <li>• Try popular routes like Delhi → Mumbai or Mumbai → Goa</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Modify Search
              </button>
              
              <button
                onClick={() => {
                  dispatch({ 
                    type: 'SET_SEARCH_FILTERS', 
                    payload: { 
                      ...state.searchFilters, 
                      origin: 'DEL', 
                      destination: 'BOM' 
                    } 
                  });
                  dispatch({ type: 'SET_CURRENT_VIEW', payload: 'search' });
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Try Delhi → Mumbai
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Search</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {state.searchFilters.origin && state.searchFilters.destination 
                ? `${getAirportName(state.searchFilters.origin)} → ${getAirportName(state.searchFilters.destination)}`
                : 'Flight Search Results'
              }
            </h1>
            <p className="text-gray-600">
              {filteredAndSortedFlights.length} flights found for {state.searchFilters.passengers} passenger{state.searchFilters.passengers > 1 ? 's' : ''} • All classes available
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="price">Sort by Price</option>
              <option value="duration">Sort by Duration</option>
              <option value="departure">Sort by Departure</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 bg-white rounded-xl shadow-lg p-6 h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            
            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="300000"
                step="5000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>

            {/* Class Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Travel Class</label>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Classes</option>
                <option value="economy">Economy Available</option>
                <option value="premium">Premium Available</option>
                <option value="business">Business Available</option>
                <option value="first">First Class Available</option>
              </select>
            </div>

            {/* Max Stops */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Stops</label>
              <select
                value={maxStops}
                onChange={(e) => setMaxStops(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="0">Non-stop only</option>
                <option value="1">Up to 1 stop</option>
                <option value="2">Up to 2 stops</option>
              </select>
            </div>

            {/* Airlines */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Airlines</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {uniqueAirlines.map(airline => (
                  <label key={airline} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={airlines.includes(airline)}
                      onChange={() => toggleAirline(airline)}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{airline}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setPriceRange([0, 300000]);
                setMaxStops(2);
                setAirlines([]);
                setClassFilter('all');
              }}
              className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Flight Results */}
        <div className="flex-1">
          {filteredAndSortedFlights.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No flights match your filters</h3>
              <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
              <button
                onClick={() => {
                  setPriceRange([0, 300000]);
                  setMaxStops(2);
                  setAirlines([]);
                  setClassFilter('all');
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedFlights.map(flight => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}