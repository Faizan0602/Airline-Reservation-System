import React, { useState, useEffect } from 'react';
import { Filter, SortAsc, SortDesc, ArrowLeft, Plane } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FlightCard from './FlightCard';
import { Flight } from '../types';
import axios from 'axios';

export default function SearchResults() {
  const { state, dispatch } = useApp();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [priceRange, setPriceRange] = useState([0, 300000]); // Increased for international flights
  const [maxStops, setMaxStops] = useState(2);
  const [airlines, setAirlines] = useState<string[]>([]);
  const [classFilter, setClassFilter] = useState<string>('all'); // New class filter
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.get('/api/flights')
      .then(res => {
        setFlights(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch flights.');
        setLoading(false);
      });
  }, []);

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

  const filteredAndSortedFlights = sortFlights(filterFlights(flights));
  const uniqueAirlines = [...new Set(flights.map(f => f.airline))];

  console.log('SearchResults - Filtered flights:', {
    originalCount: flights.length,
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

  if (loading) return <div className="text-center py-12 text-lg">Loading flights...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
  if (!flights.length) return <div className="text-center py-12 text-lg">No flights found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Add a large airplane illustration at the top, as in the image. */}
      <div className="relative bg-gradient-to-b from-blue-900 to-blue-700 h-44 rounded-b-3xl flex flex-col items-center justify-center mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* You can use a world map SVG or a background image here */}
          {/* Example: <img src="/assets/world-map.svg" alt="World Map" className="w-full h-full object-cover" /> */}
        </div>
        <div className="z-10 flex flex-col items-center">
          <div className="flex items-center space-x-4 mb-2">
            <span className="text-white text-2xl font-bold tracking-wide">{getAirportName(state.searchFilters.origin)}</span>
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="white" className="mx-2 animate-bounce">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.5 19.5l19-7-19-7v5l15 2-15 2v5z" />
            </svg>
            <span className="text-white text-2xl font-bold tracking-wide">{getAirportName(state.searchFilters.destination)}</span>
          </div>
          <span className="text-blue-200 text-sm font-medium">Select Flight</span>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex items-center bg-white rounded-full shadow px-4 py-2 space-x-4">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2 text-blue-700 font-semibold focus:outline-none">
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-gray-700 font-medium">Sort by:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent focus:outline-none font-semibold text-blue-700">
            <option value="price">Price</option>
            <option value="duration">Duration</option>
            <option value="departure">Departure</option>
          </select>
          <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="text-blue-700 focus:outline-none">
            {sortOrder === 'asc' ? <SortAsc className="h-5 w-5" /> : <SortDesc className="h-5 w-5" />}
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
            <div className="space-y-6">
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