import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowRightLeft, Calendar, Users, Plane, MapPin, X, Baby } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { airports, generateFlightsForRoute } from '../data/mockData';
import { SearchFilters, Airport } from '../types';

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  airports: Airport[];
}

function SearchableSelect({ value, onChange, placeholder, label, airports }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const airport = airports.find(a => a.code === value);
      setDisplayValue(airport ? `${airport.city} (${airport.code})` : '');
    } else {
      setDisplayValue('');
    }
  }, [value, airports]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAirports = airports.filter(airport =>
    airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setDisplayValue(inputValue);
    setIsOpen(true);
    
    // Clear selection if user is typing
    if (inputValue !== displayValue) {
      onChange('');
    }
  };

  const handleSelectAirport = (airport: Airport) => {
    onChange(airport.code);
    setDisplayValue(`${airport.city} (${airport.code})`);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setDisplayValue('');
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm(displayValue);
  };

  return (
    <div className="relative group" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-700 transition-colors duration-200">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-all duration-200 hover:shadow-md"
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {displayValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {filteredAirports.length > 0 ? (
            filteredAirports.map((airport) => (
              <button
                key={airport.code}
                type="button"
                onClick={() => handleSelectAirport(airport)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{airport.city} ({airport.code})</div>
                    <div className="text-sm text-gray-600">{airport.name}</div>
                  </div>
                  <div className="text-xs text-gray-500">{airport.country}</div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-center">
              No airports found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchForm() {
  const { state, dispatch } = useApp();
  const [filters, setFilters] = useState<SearchFilters>({
    ...state.searchFilters,
    infants: state.searchFilters.infants || 0
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is signed in
    if (!state.user) {
      alert('Please sign in to search and book flights.');
      return;
    }
    
    if (!filters.origin || !filters.destination) {
      alert('Please select both origin and destination airports.');
      return;
    }

    if (filters.origin === filters.destination) {
      alert('Origin and destination cannot be the same.');
      return;
    }

    if (filters.passengers === 0) {
      alert('At least one adult passenger is required.');
      return;
    }

    if (filters.infants > filters.passengers) {
      alert('Number of infants cannot exceed number of adult passengers.');
      return;
    }
    
    console.log('🔍 FLIGHT SEARCH STARTED');
    console.log('Search filters:', filters);
    
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_SEARCH_FILTERS', payload: filters });

    // Generate flights for the selected route
    setTimeout(() => {
      console.log('⏰ Generating flights for route:', filters.origin, '→', filters.destination);
      
      // Use the search date or default to today
      const searchDate = filters.departureDate || new Date().toISOString().split('T')[0];
      
      // Generate flights for this specific route
      const results = generateFlightsForRoute(filters.origin, filters.destination, searchDate);
      
      console.log('✅ FLIGHTS GENERATED:', results.length, 'flights found');
      console.log('First flight sample:', results[0] ? {
        flightNumber: results[0].flightNumber,
        airline: results[0].airline,
        route: `${results[0].origin.code} → ${results[0].destination.code}`,
        price: results[0].price.economy
      } : 'No flights');
      
      if (results.length > 0) {
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'results' });
        console.log('🎯 SUCCESS: Redirecting to results page');
      } else {
        console.log('❌ ERROR: No flights generated');
        alert('No flights found for this route. Please try a different route or date.');
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 1000);
  };

  const swapOriginDestination = () => {
    setFilters(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  const handleQuickRoute = (from: string, to: string) => {
    setFilters(prev => ({ 
      ...prev, 
      origin: from, 
      destination: to,
      departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 -mt-8 relative z-10 mx-4 lg:mx-0 hover:shadow-2xl transition-shadow duration-300">
      {!state.user && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-center">
            <strong>Please sign in</strong> to search and book flights. Click the "Sign In" button in the top right corner.
          </p>
        </div>
      )}
      
      {/* 1. Top bar: white background, flex, justify-between, items-center, px-4, pt-4 */}
      {/*    - Left: 'My Tickets' in bold, black text */}
      {/*    - Center: Airplane SVG and dotted route (inline SVG) */}
      {/*    - Right: User avatar in a circle, and balance in a pill */}
      <div className="w-full bg-white flex justify-between items-center px-4 pt-4 pb-2">
        {/* Left: My Tickets */}
        <div className="font-bold text-xl text-black">My Tickets</div>
        {/* Center: Airplane SVG and dotted route */}
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M2.5 19.5l19-7-19-7v5l15 2-15 2v5z" />
            </svg>
            <svg width="80" height="16" viewBox="0 0 80 16" fill="none" className="ml-2">
              <circle cx="8" cy="8" r="2" fill="#000" />
              <circle cx="72" cy="8" r="2" fill="#000" />
              <line x1="10" y1="8" x2="70" y2="8" stroke="#000" strokeDasharray="4 4" />
            </svg>
          </div>
        </div>
        {/* Right: User avatar and balance pill */}
        <div className="flex items-center space-x-2">
          <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center overflow-hidden">
            {/* Placeholder avatar, replace src as needed */}
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-10 h-10 object-cover" />
          </div>
          <div className="bg-gray-100 rounded-full px-4 py-1 text-xs font-semibold text-black">$728.01</div>
        </div>
      </div>

      {/* After the top bar, add the following tabs section: */}
      <div className="flex justify-center mt-2 mb-6">
        <div className="bg-gray-100 rounded-full flex p-1 w-72">
          <button
            type="button"
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${filters.tripType === 'one-way' ? 'bg-white text-black shadow' : 'text-gray-500'}`}
            onClick={() => setFilters({ ...filters, tripType: 'one-way' })}
          >
            One Way
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${filters.tripType === 'round-trip' ? 'bg-white text-black shadow' : 'text-gray-500'}`}
            onClick={() => setFilters({ ...filters, tripType: 'round-trip' })}
          >
            Round Trip
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-6">
        {/* Origin and Destination with Searchable Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative">
          <SearchableSelect
            value={filters.origin}
            onChange={(value) => setFilters({ ...filters, origin: value })}
            placeholder="Type city name or airport code..."
            label="From"
            airports={airports}
          />

          <button
            type="button"
            onClick={swapOriginDestination}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 hover:scale-110 transition-all duration-300 z-10 lg:block hidden shadow-lg hover:shadow-xl"
            title="Swap origin and destination"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>

          <SearchableSelect
            value={filters.destination}
            onChange={(value) => setFilters({ ...filters, destination: value })}
            placeholder="Type city name or airport code..."
            label="To"
            airports={airports}
          />
        </div>

        {/* Mobile Swap Button */}
        <div className="lg:hidden flex justify-center">
          <button
            type="button"
            onClick={swapOriginDestination}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span>Swap Cities</span>
          </button>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-700 transition-colors duration-200">Departure Date</label>
            <input
              type="date"
              value={filters.departureDate}
              onChange={(e) => setFilters({ ...filters, departureDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-all duration-200 hover:shadow-md"
              required
            />
          </div>
          {filters.tripType === 'round-trip' && (
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-700 transition-colors duration-200">Return Date</label>
              <input
                type="date"
                value={filters.returnDate || ''}
                onChange={(e) => setFilters({ ...filters, returnDate: e.target.value })}
                min={filters.departureDate || new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-all duration-200 hover:shadow-md"
              />
            </div>
          )}
        </div>

        {/* Passengers, Infants and Class */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-700 transition-colors duration-200 flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Adult Passengers</span>
            </label>
            <select
              value={filters.passengers}
              onChange={(e) => setFilters({ ...filters, passengers: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-all duration-200 hover:shadow-md"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <option key={num} value={num}>{num} Adult{num === 1 ? '' : 's'}</option>
              ))}
            </select>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-700 transition-colors duration-200 flex items-center space-x-2">
              <Baby className="h-4 w-4" />
              <span>Infants (Under 2)</span>
            </label>
            <select
              value={filters.infants}
              onChange={(e) => setFilters({ ...filters, infants: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-all duration-200 hover:shadow-md"
            >
              {Array.from({ length: Math.min(filters.passengers + 1, 5) }, (_, i) => (
                <option key={i} value={i}>{i} Infant{i === 1 ? '' : 's'}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Infants travel on parent's lap</p>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-700 transition-colors duration-200">Travel Class</label>
            <select
              value={filters.travelClass}
              onChange={(e) => setFilters({ ...filters, travelClass: e.target.value as any })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-all duration-200 hover:shadow-md"
            >
              <option value="economy">Economy</option>
              <option value="premium">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>

        {/* Passenger Summary */}
        {(filters.passengers > 0 || filters.infants > 0) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              <strong>Total Travelers:</strong> {filters.passengers} Adult{filters.passengers !== 1 ? 's' : ''}
              {filters.infants > 0 && `, ${filters.infants} Infant${filters.infants !== 1 ? 's' : ''}`}
              {filters.infants > 0 && (
                <span className="block text-xs text-blue-600 mt-1">
                  Note: Infants under 2 years travel on parent's lap and may have reduced fares
                </span>
              )}
            </p>
          </div>
        )}

        {/* Search Button */}
        <button
          type="submit"
          disabled={state.isLoading || !state.user || !filters.origin || !filters.destination || filters.passengers === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:hover:scale-100"
        >
          {state.isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Searching Flights...</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>
                {!state.user 
                  ? 'Sign In to Search' 
                  : !filters.origin || !filters.destination 
                  ? 'Select Origin & Destination' 
                  : filters.passengers === 0
                  ? 'Select At Least 1 Adult'
                  : 'Search Flights'
                }
              </span>
            </>
          )}
        </button>
      </form>

      {/* Quick Search Suggestions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Routes</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { from: 'DEL', to: 'BOM', label: 'Delhi → Mumbai' },
            { from: 'DEL', to: 'BLR', label: 'Delhi → Bangalore' },
            { from: 'BOM', to: 'GOI', label: 'Mumbai → Goa' },
            { from: 'DEL', to: 'DXB', label: 'Delhi → Dubai' },
            { from: 'BLR', to: 'COK', label: 'Bangalore → Kochi' },
            { from: 'DEL', to: 'SIN', label: 'Delhi → Singapore' },
            { from: 'DEL', to: 'CDG', label: 'Delhi → Paris' },
            { from: 'BOM', to: 'LHR', label: 'Mumbai → London' }
          ].map((route, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleQuickRoute(route.from, route.to)}
              className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 hover:text-blue-800 hover:shadow-md transform hover:scale-105 transition-all duration-200"
            >
              {route.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}