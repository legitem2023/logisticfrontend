'use client';

import React, { useEffect, useRef } from 'react';

const AnimatedEarthAtom = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX = (e.clientX - centerX) / window.innerWidth;
      mouseY = (e.clientY - centerY) / window.innerHeight;
    };

    const animate = () => {
      // Smoothly follow the mouse
      targetRotationX = mouseY * 30;
      targetRotationY = mouseX * 30;
      
      currentRotationX += (targetRotationX - currentRotationX) * 0.1;
      currentRotationY += (targetRotationY - currentRotationY) * 0.1;
      
      container.style.transform = `
        perspective(1000px)
        rotateX(${currentRotationX}deg)
        rotateY(${currentRotationY}deg)
      `;
      
      requestRef.current = requestAnimationFrame(animate);
    };

    container.addEventListener('mousemove', handleMouseMove as EventListener);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove as EventListener);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-4 overflow-hidden">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
        Scientific 3D Atomic Model
      </h1>
      <p className="text-blue-300 mb-8 text-center max-w-lg">
        A scientifically-inspired representation of an atom with Earth as nucleus and probabilistic electron orbitals
      </p>
      
      <div className="relative w-96 h-96 flex items-center justify-center" ref={containerRef}>
        {/* Earth nucleus with realistic texture */}
        <div className="absolute w-40 h-40 rounded-full overflow-hidden shadow-2xl shadow-blue-500/30 z-10 transform-style-3d">
          <div className="w-full h-full bg-gradient-to-tr from-blue-700 via-green-600 to-brown-600 relative overflow-hidden transform-style-3d">
            {/* Continent details */}
            <div className="absolute top-12 left-10 w-14 h-8 bg-green-800/60 rounded-full"></div>
            <div className="absolute bottom-20 right-14 w-16 h-10 bg-brown-700/60 rounded-full"></div>
            <div className="absolute top-24 left-24 w-12 h-6 bg-green-700/50 rounded-full"></div>
            <div className="absolute bottom-12 left-16 w-10 h-5 bg-green-800/50 rounded-full"></div>
            {/* Cloud details */}
            <div className="absolute top-8 left-12 w-10 h-3 bg-white/80 rounded-full blur-sm"></div>
            <div className="absolute top-16 right-10 w-12 h-4 bg-white/80 rounded-full blur-sm"></div>
            <div className="absolute bottom-14 left-8 w-14 h-4 bg-white/80 rounded-full blur-sm"></div>
            {/* Atmosphere glow */}
            <div className="absolute inset-0 border-2 border-blue-400/30 rounded-full blur-sm"></div>
          </div>
        </div>
        
        {/* Quantum orbital clouds (faint probability regions) */}
        <div className="absolute w-80 h-80 rounded-full bg-purple-500/5 blur-xl transform rotate-x-70 transform-style-3d"></div>
        <div className="absolute w-72 h-72 rounded-full bg-cyan-500/5 blur-xl transform rotate-y-70 rotate-x-20 transform-style-3d"></div>
        <div className="absolute w-88 h-88 rounded-full bg-green-500/5 blur-xl transform rotate-y-40 rotate-x-60 transform-style-3d"></div>
        
        {/* Electron orbitals with crossing paths */}
        <div className="absolute w-80 h-64 animate-orbit-slow transform-style-3d">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-purple-500 rounded-full shadow-lg shadow-purple-500/80 electron-glow"></div>
            <div className="absolute -inset-1 bg-purple-500/20 rounded-full blur-md electron-trail"></div>
          </div>
        </div>
        
        <div className="absolute w-72 h-72 animate-orbit-medium transform-style-3d">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/80 electron-glow"></div>
            <div className="absolute -inset-1 bg-cyan-400/20 rounded-full blur-md electron-trail"></div>
          </div>
        </div>
        
        <div className="absolute w-64 h-80 animate-orbit-fast transform-style-3d">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/80 electron-glow"></div>
            <div className="absolute -inset-1 bg-green-400/20 rounded-full blur-md electron-trail"></div>
          </div>
        </div>
        
        {/* Additional electrons for more realism */}
        <div className="absolute w-76 h-76 animate-orbit-slower transform-style-3d">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/70 electron-glow"></div>
          </div>
        </div>
        
        {/* Subtle orbital rings */}
        <div className="absolute w-80 h-64 border border-purple-500/10 rounded-full transform rotate-x-70 transform-style-3d"></div>
        <div className="absolute w-72 h-72 border border-cyan-500/10 rounded-full transform rotate-y-70 rotate-x-20 transform-style-3d"></div>
        <div className="absolute w-64 h-80 border border-green-500/10 rounded-full transform rotate-y-40 rotate-x-60 transform-style-3d"></div>
        
        {/* Energy glow effects */}
        <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-2xl animate-pulse-slow"></div>
      </div>
      
      <div className="mt-10 text-white/60 text-sm text-center max-w-md">
        <p>This model represents electron orbitals in different energy levels with probabilistic regions</p>
        <p className="mt-2">Move your cursor to rotate the model in 3D space</p>
      </div>

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
        @keyframes orbit-slower {
          0% {
            transform: rotateZ(0deg) rotateY(45deg) rotateX(50deg);
          }
          100% {
            transform: rotateZ(360deg) rotateY(45deg) rotateX(50deg);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.1;
          }
        }
        .animate-orbit-slow {
          animation: orbit-slow 20s linear infinite;
        }
        .animate-orbit-medium {
          animation: orbit-medium 15s linear infinite;
        }
        .animate-orbit-fast {
          animation: orbit-fast 12s linear infinite;
        }
        .animate-orbit-slower {
          animation: orbit-slower 25s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .electron-glow {
          filter: drop-shadow(0 0 6px currentColor);
        }
        .electron-trail {
          filter: blur(8px);
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default AnimatedEarthAtom;
