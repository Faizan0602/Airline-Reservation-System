import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateSeats } from '../data/mockData';
import { Seat } from '../types';

export default function SeatSelection() {
  const { state, dispatch } = useApp();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  useEffect(() => {
    if (state.selectedFlight) {
      const flightSeats = generateSeats(state.selectedFlight.id);
      setSeats(flightSeats);
    }
  }, [state.selectedFlight]);

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'results' });
  };

  const handleSeatClick = (clickedSeat: Seat) => {
    if (!clickedSeat.isAvailable) return;

    const isAlreadySelected = selectedSeats.some(seat => seat.id === clickedSeat.id);
    
    if (isAlreadySelected) {
      setSelectedSeats(prev => prev.filter(seat => seat.id !== clickedSeat.id));
    } else if (selectedSeats.length < state.searchFilters.passengers) {
      setSelectedSeats(prev => [...prev, clickedSeat]);
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === state.searchFilters.passengers) {
      dispatch({ type: 'SET_SELECTED_SEATS', payload: selectedSeats });
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'booking' });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getSeatClassName = (seat: Seat) => {
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    const baseClass = "w-8 h-8 rounded-t-lg border-2 cursor-pointer transition-all duration-300 flex items-center justify-center text-xs font-medium ";
    
    if (!seat.isAvailable) {
      return baseClass + "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed";
    }
    
    if (isSelected) {
      return baseClass + "bg-blue-600 border-blue-700 text-white transform scale-110 shadow-lg";
    }
    
    const classColors = {
      first: "bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200 hover:border-purple-400 hover:shadow-md hover:scale-105",
      business: "bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200 hover:border-blue-400 hover:shadow-md hover:scale-105",
      premium: "bg-green-100 border-green-300 text-green-800 hover:bg-green-200 hover:border-green-400 hover:shadow-md hover:scale-105",
      economy: "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 hover:border-gray-400 hover:shadow-md hover:scale-105"
    };
    
    return baseClass + classColors[seat.class];
  };

  const getTotalPrice = () => {
    const flightPrice = state.selectedFlight?.price[state.searchFilters.travelClass] || 0;
    const seatPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);
    return (flightPrice * state.searchFilters.passengers) + seatPrice;
  };

  const groupSeatsByRow = () => {
    const grouped: { [key: number]: Seat[] } = {};
    seats.forEach(seat => {
      const row = parseInt(seat.seatNumber.slice(0, -1));
      if (!grouped[row]) grouped[row] = [];
      grouped[row].push(seat);
    });
    return grouped;
  };

  const seatsByRow = groupSeatsByRow();
  const rows = Object.keys(seatsByRow).map(Number).sort((a, b) => a - b);

  if (!state.selectedFlight) {
    return <div>No flight selected</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Results</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Select Your Seats</h1>
            <p className="text-gray-600">
              {state.selectedFlight.flightNumber} - {state.selectedFlight.origin.code} → {state.selectedFlight.destination.code}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Seat Map */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aircraft Layout</h3>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-6 text-sm">
                <div className="flex items-center space-x-2 hover:bg-purple-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded-t"></div>
                  <span>First Class</span>
                </div>
                <div className="flex items-center space-x-2 hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded-t"></div>
                  <span>Business</span>
                </div>
                <div className="flex items-center space-x-2 hover:bg-green-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded-t"></div>
                  <span>Premium Economy</span>
                </div>
                <div className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded-t"></div>
                  <span>Economy</span>
                </div>
                <div className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-4 h-4 bg-gray-300 border border-gray-400 rounded-t"></div>
                  <span>Occupied</span>
                </div>
                <div className="flex items-center space-x-2 hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-4 h-4 bg-blue-600 border border-blue-700 rounded-t"></div>
                  <span>Selected</span>
                </div>
              </div>
            </div>

            {/* Seat Grid */}
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {rows.map(rowNum => (
                  <div key={rowNum} className="flex items-center mb-2 hover:bg-gray-50 p-1 rounded transition-colors duration-200">
                    <div className="w-8 text-center text-sm font-medium text-gray-600 mr-4">
                      {rowNum}
                    </div>
                    <div className="flex space-x-1">
                      {seatsByRow[rowNum]
                        .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
                        .map((seat, index) => (
                          <React.Fragment key={seat.id}>
                            <button
                              onClick={() => handleSeatClick(seat)}
                              className={getSeatClassName(seat)}
                              disabled={!seat.isAvailable}
                              title={`${seat.seatNumber} - ${seat.class} ${seat.price > 0 ? `(+${formatPrice(seat.price)})` : ''}`}
                            >
                              {selectedSeats.some(s => s.id === seat.id) ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                seat.seatNumber.slice(-1)
                              )}
                            </button>
                            {/* Add aisle spacing */}
                            {index === 2 && <div className="w-8"></div>}
                          </React.Fragment>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selection Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="text-sm hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                <span className="text-gray-600">Flight:</span>
                <span className="font-medium ml-2">{state.selectedFlight.flightNumber}</span>
              </div>
              <div className="text-sm hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                <span className="text-gray-600">Passengers:</span>
                <span className="font-medium ml-2">{state.searchFilters.passengers}</span>
              </div>
              <div className="text-sm hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                <span className="text-gray-600">Class:</span>
                <span className="font-medium ml-2 capitalize">{state.searchFilters.travelClass}</span>
              </div>
            </div>

            {/* Selected Seats */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Selected Seats</h4>
              {selectedSeats.length === 0 ? (
                <p className="text-sm text-gray-500">No seats selected</p>
              ) : (
                <div className="space-y-2">
                  {selectedSeats.map(seat => (
                    <div key={seat.id} className="flex justify-between items-center text-sm p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors duration-200">
                      <span className="font-medium">{seat.seatNumber}</span>
                      <span className="text-gray-600">
                        {seat.price > 0 && `+${formatPrice(seat.price)}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                  <span>Base fare ({state.searchFilters.passengers}x)</span>
                  <span>{formatPrice(state.selectedFlight.price[state.searchFilters.travelClass] * state.searchFilters.passengers)}</span>
                </div>
                {selectedSeats.reduce((total, seat) => total + seat.price, 0) > 0 && (
                  <div className="flex justify-between hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                    <span>Seat fees</span>
                    <span>+{formatPrice(selectedSeats.reduce((total, seat) => total + seat.price, 0))}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg border-t pt-2 hover:bg-blue-50 p-2 rounded transition-colors duration-200">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(getTotalPrice())}</span>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={selectedSeats.length !== state.searchFilters.passengers}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {selectedSeats.length === state.searchFilters.passengers 
                ? 'Continue to Booking' 
                : `Select ${state.searchFilters.passengers - selectedSeats.length} more seat${state.searchFilters.passengers - selectedSeats.length > 1 ? 's' : ''}`
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}