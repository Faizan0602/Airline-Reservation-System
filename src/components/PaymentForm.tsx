import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Shield, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PaymentForm() {
  const { state, dispatch } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'booking' });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.currentBooking) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const confirmedBooking = {
        ...state.currentBooking,
        status: 'confirmed' as const
      };
      
      dispatch({ type: 'ADD_BOOKING', payload: confirmedBooking });
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'confirmation' });
      setIsProcessing(false);
    }, 3000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (!state.currentBooking) {
    return <div>No booking in progress</div>;
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
          <span>Back to Booking</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
          <p className="text-gray-600">Secure payment for your booking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 text-blue-600"
                  />
                  <CreditCard className="h-5 w-5 mr-3 text-gray-600" />
                  <span className="font-medium">Credit/Debit Card</span>
                </label>
                
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 text-blue-600"
                  />
                  <div className="w-5 h-5 mr-3 bg-orange-600 rounded"></div>
                  <span className="font-medium">UPI</span>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 text-blue-600"
                  />
                  <div className="w-5 h-5 mr-3 bg-green-600 rounded"></div>
                  <span className="font-medium">Net Banking</span>
                </label>
              </div>
            </div>

            {/* Card Details */}
            {paymentMethod === 'card' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* UPI Details */}
            {paymentMethod === 'upi' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">UPI Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="yourname@paytm"
                    required
                  />
                </div>
              </div>
            )}

            {/* Net Banking */}
            {paymentMethod === 'netbanking' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Bank</h3>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                  <option value="">Select Bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                  <option value="kotak">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Billing Address */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={billingAddress.address}
                    onChange={(e) => setBillingAddress(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                    <input
                      type="text"
                      value={billingAddress.zipCode}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    value={billingAddress.country}
                    onChange={(e) => setBillingAddress(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select State</option>
                    <option value="AN">Andaman and Nicobar Islands</option>
                    <option value="AP">Andhra Pradesh</option>
                    <option value="AR">Arunachal Pradesh</option>
                    <option value="AS">Assam</option>
                    <option value="BR">Bihar</option>
                    <option value="CH">Chandigarh</option>
                    <option value="CT">Chhattisgarh</option>
                    <option value="DN">Dadra and Nagar Haveli</option>
                    <option value="DD">Daman and Diu</option>
                    <option value="DL">Delhi</option>
                    <option value="GA">Goa</option>
                    <option value="GJ">Gujarat</option>
                    <option value="HR">Haryana</option>
                    <option value="HP">Himachal Pradesh</option>
                    <option value="JK">Jammu and Kashmir</option>
                    <option value="JH">Jharkhand</option>
                    <option value="KA">Karnataka</option>
                    <option value="KL">Kerala</option>
                    <option value="LD">Lakshadweep</option>
                    <option value="MP">Madhya Pradesh</option>
                    <option value="MH">Maharashtra</option>
                    <option value="MN">Manipur</option>
                    <option value="ML">Meghalaya</option>
                    <option value="MZ">Mizoram</option>
                    <option value="NL">Nagaland</option>
                    <option value="OR">Odisha</option>
                    <option value="PY">Puducherry</option>
                    <option value="PB">Punjab</option>
                    <option value="RJ">Rajasthan</option>
                    <option value="SK">Sikkim</option>
                    <option value="TN">Tamil Nadu</option>
                    <option value="TG">Telangana</option>
                    <option value="TR">Tripura</option>
                    <option value="UP">Uttar Pradesh</option>
                    <option value="UT">Uttarakhand</option>
                    <option value="WB">West Bengal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Secure Payment</p>
                  <p className="text-xs text-green-700">Your payment information is encrypted and secure</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing Payment...</span>
                </div>
              ) : (
                `Pay ${formatPrice(state.currentBooking.totalAmount)}`
              )}
            </button>
          </form>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Booking Reference</span>
                <span className="font-medium">{state.currentBooking.bookingReference}</span>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-600">Flight:</span>
                <span className="font-medium ml-2">{state.currentBooking.flight.flightNumber}</span>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-600">Route:</span>
                <span className="font-medium ml-2">
                  {state.currentBooking.flight.origin.code} → {state.currentBooking.flight.destination.code}
                </span>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-600">Passengers:</span>
                <span className="font-medium ml-2">{state.currentBooking.passengers.length}</span>
              </div>
              
              {state.currentBooking.seats.length > 0 && (
                <div className="text-sm">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-medium ml-2">
                    {state.currentBooking.seats.map(seat => seat.seatNumber).join(', ')}
                  </span>
                </div>
              )}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(state.currentBooking.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}