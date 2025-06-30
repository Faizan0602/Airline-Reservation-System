import React from 'react';
import { Plane, Globe, Shield, Clock } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 hover:text-blue-200 transition-colors duration-300">
            Your Journey Begins Here
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto hover:text-blue-100 transition-colors duration-300">
            Book flights to destinations worldwide with SkyWays. Experience premium service, 
            competitive prices, and seamless travel planning.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div className="bg-blue-800 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-700 group-hover:shadow-lg transition-all duration-300">
              <Globe className="h-8 w-8 group-hover:text-blue-200 transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-200 transition-colors duration-300">Global Network</h3>
            <p className="text-blue-200 text-sm group-hover:text-blue-100 transition-colors duration-300">
              Connect to over 1000 destinations worldwide
            </p>
          </div>

          <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div className="bg-blue-800 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-700 group-hover:shadow-lg transition-all duration-300">
              <Shield className="h-8 w-8 group-hover:text-blue-200 transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-200 transition-colors duration-300">Secure Booking</h3>
            <p className="text-blue-200 text-sm group-hover:text-blue-100 transition-colors duration-300">
              Your data and payments are always protected
            </p>
          </div>

          <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div className="bg-blue-800 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-700 group-hover:shadow-lg transition-all duration-300">
              <Clock className="h-8 w-8 group-hover:text-blue-200 transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-200 transition-colors duration-300">24/7 Support</h3>
            <p className="text-blue-200 text-sm group-hover:text-blue-100 transition-colors duration-300">
              Round-the-clock customer service assistance
            </p>
          </div>

          <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div className="bg-blue-800 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-700 group-hover:shadow-lg transition-all duration-300">
              <Plane className="h-8 w-8 group-hover:text-blue-200 transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-200 transition-colors duration-300">Premium Fleet</h3>
            <p className="text-blue-200 text-sm group-hover:text-blue-100 transition-colors duration-300">
              Modern aircraft with comfort and safety
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}