'use client';

import React from 'react';

const AnimatedEarthAtom = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
        Animated Atom with Earth Nucleus
      </h1>
      
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Earth nucleus */}
        <div className="absolute w-32 h-32 rounded-full overflow-hidden shadow-2xl shadow-blue-500/50 z-10">
          <div className="w-full h-full bg-blue-500 animate-pulse"></div>
        </div>
        
        {/* Orbit paths */}
        <div className="absolute w-64 h-64 border border-white/10 rounded-full"></div>
        <div className="absolute w-56 h-56 border border-white/10 rounded-full"></div>
        <div className="absolute w-48 h-48 border border-white/10 rounded-full"></div>
        
        {/* Electrons */}
        <div className="absolute w-64 h-64 animate-spin-slow">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
        </div>
        
        <div className="absolute w-56 h-56 animate-spin-medium" style={{ animationDirection: 'reverse' }}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
        </div>
        
        <div className="absolute w-48 h-48 animate-spin-fast">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></div>
        </div>
      </div>
      
      <p className="text-white/70 mt-8 text-center max-w-md">
        This animated atom features Earth as its nucleus with electrons orbiting around it at different speeds.
      </p>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-medium {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .animate-spin-medium {
          animation: spin-medium 10s linear infinite;
        }
        .animate-spin-fast {
          animation: spin-fast 7s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AnimatedEarthAtom;
