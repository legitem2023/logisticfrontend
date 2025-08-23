'use client';

import React, { useEffect, useRef } from 'react';

const AnimatedEarthAtom = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const container = containerRef.current;
      if (!container) return;
      
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      container.style.transform = `
        perspective(1000px)
        rotateX(${-y * 10}deg)
        rotateY(${x * 10}deg)
      `;
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-4 overflow-hidden">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
        3D Atom with Earth Nucleus
      </h1>
      
      <div className="relative w-96 h-96 flex items-center justify-center" ref={containerRef}>
        {/* Earth nucleus with realistic texture */}
        <div className="absolute w-40 h-40 rounded-full overflow-hidden shadow-2xl shadow-blue-500/30 z-10 transform-style-3d animate-float">
          <div className="w-full h-full bg-gradient-to-tr from-blue-700 via-green-600 to-brown-600 relative overflow-hidden transform-style-3d">
            {/* Cloud details */}
            <div className="absolute top-8 left-10 w-12 h-4 bg-white/70 rounded-full blur-sm"></div>
            <div className="absolute top-14 right-12 w-10 h-3 bg-white/70 rounded-full blur-sm"></div>
            <div className="absolute bottom-16 left-14 w-14 h-4 bg-white/70 rounded-full blur-sm"></div>
            <div className="absolute bottom-8 right-10 w-12 h-3 bg-white/70 rounded-full blur-sm"></div>
            {/* Continent-like shapes */}
            <div className="absolute top-20 left-20 w-16 h-10 bg-green-800/50 rounded-full"></div>
            <div className="absolute bottom-20 right-16 w-20 h-12 bg-brown-700/50 rounded-full"></div>
            <div className="absolute top-10 left-5 w-10 h-6 bg-green-700/40 rounded-full"></div>
            {/* Highlight for 3D effect */}
            <div className="absolute top-6 right-6 w-8 h-8 bg-white/20 rounded-full"></div>
          </div>
        </div>
        
        {/* Orbital paths - 3D ellipses */}
        <div className="absolute w-80 h-64 border border-white/5 rounded-full transform rotate-x-70 transform-style-3d"></div>
        <div className="absolute w-72 h-72 border border-white/5 rounded-full transform rotate-y-70 rotate-x-20 transform-style-3d"></div>
        <div className="absolute w-64 h-80 border border-white/5 rounded-full transform rotate-y-40 rotate-x-60 transform-style-3d"></div>
        
        {/* Electrons with trail effects */}
        <div className="absolute w-80 h-64 animate-orbit-slow transform-style-3d">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-5 h-5 bg-purple-500 rounded-full shadow-lg shadow-purple-500/70 electron-glow"></div>
            <div className="absolute -inset-1 bg-purple-500/30 rounded-full blur-md"></div>
          </div>
        </div>
        
        <div className="absolute w-72 h-72 animate-orbit-medium transform-style-3d">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/70 electron-glow"></div>
            <div className="absolute -inset-1 bg-cyan-400/30 rounded-full blur-md"></div>
          </div>
        </div>
        
        <div className="absolute w-64 h-80 animate-orbit-fast transform-style-3d">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-green-400 rounded-full shadow-lg shadow-green-400/70 electron-glow"></div>
            <div className="absolute -inset-1 bg-green-400/30 rounded-full blur-md"></div>
          </div>
        </div>
        
        {/* Ambient glow */}
        <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl animate-pulse"></div>
      </div>
      
      <p className="text-white/70 mt-8 text-center max-w-md">
        Move your cursor around to rotate the atom in 3D space. Electrons orbit in different planes, creating the illusion of crossing paths.
      </p>

      <style jsx>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .rotate-x-70 {
          transform: rotateX(70deg);
        }
        .rotate-y-70 {
          transform: rotateY(70deg);
        }
        .rotate-x-20 {
          transform: rotateX(20deg);
        }
        .rotate-y-40 {
          transform: rotateY(40deg);
        }
        .rotate-x-60 {
          transform: rotateX(60deg);
        }
        @keyframes orbit-slow {
          0% {
            transform: rotateZ(0deg) rotateY(60deg);
          }
          100% {
            transform: rotateZ(360deg) rotateY(60deg);
          }
        }
        @keyframes orbit-medium {
          0% {
            transform: rotateZ(0deg) rotateX(70deg);
          }
          100% {
            transform: rotateZ(360deg) rotateX(70deg);
          }
        }
        @keyframes orbit-fast {
          0% {
            transform: rotateZ(0deg) rotateY(30deg) rotateX(40deg);
          }
          100% {
            transform: rotateZ(360deg) rotateY(30deg) rotateX(40deg);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(2deg);
          }
        }
        .animate-orbit-slow {
          animation: orbit-slow 16s linear infinite;
        }
        .animate-orbit-medium {
          animation: orbit-medium 12s linear infinite;
        }
        .animate-orbit-fast {
          animation: orbit-fast 8s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .electron-glow {
          filter: drop-shadow(0 0 8px currentColor);
        }
      `}</style>
    </div>
  );
};

export default AnimatedEarthAtom;
