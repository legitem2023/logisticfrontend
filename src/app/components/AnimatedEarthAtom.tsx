// components/AnimatedCityScape.jsx
import { useEffect, useRef } from 'react';

const AnimatedEarthAtom = () => {
  const roadRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (roadRef.current) {
        const scrollY = window.scrollY;
        roadRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to generate random buildings
  const generateBuildings = (count, side) => {
    return Array.from({ length: count }).map((_, i) => {
      const height = Math.floor(Math.random() * 150) + 100;
      const width = Math.floor(Math.random() * 60) + 40;
      const delay = Math.random() * 5;
      
      return (
        <div
          key={`${side}-${i}`}
          className={`absolute ${side === 'left' ? 'left-0' : 'right-0'} bg-gray-800`}
          style={{
            height: `${height}px`,
            width: `${width}px`,
            bottom: '0',
            transform: `perspective(500px) rotateY(${side === 'left' ? '5' : '-5'}deg) translateZ(${i * 20}px)`,
            animation: `flicker 10s infinite ${delay}s`,
          }}
        >
          {/* Windows */}
          {Array.from({ length: Math.floor(height / 30) }).map((_, j) => (
            <div key={j} className="flex justify-around mb-2">
              {Array.from({ length: 2 }).map((_, k) => (
                <div
                  key={k}
                  className="w-4 h-4 bg-yellow-300 rounded-sm"
                  style={{
                    animation: `glow ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`,
                    opacity: Math.random() > 0.3 ? 1 : 0.2
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      );
    });
  };

  // Function to generate trees
  const generateTrees = (count, side) => {
    return Array.from({ length: count }).map((_, i) => {
      const height = Math.floor(Math.random() * 80) + 60;
      const delay = Math.random() * 3;
      
      return (
        <div
          key={`${side}-tree-${i}`}
          className={`absolute ${side === 'left' ? 'left-10' : 'right-10'}`}
          style={{
            height: `${height}px`,
            width: `${height * 0.6}px`,
            bottom: '0',
            transform: `translateX(${i % 2 === 0 ? i * 40 : i * 30}px) translateZ(${i * 25}px)`,
            animation: `sway 7s ease-in-out infinite ${delay}s`,
          }}
        >
          {/* Tree trunk */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-8 bg-yellow-900 z-10"></div>
          {/* Tree foliage */}
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-600 rounded-full"></div>
        </div>
      );
    });
  };

  // Function to generate road lines
  const generateRoadLines = (count) => {
    return Array.from({ length: count }).map((_, i) => (
      <div
        key={`line-${i}`}
        className="absolute left-1/2 transform -translate-x-1/2 w-4 h-1 bg-yellow-400"
        style={{
          bottom: `${i * 60}px`,
          animation: `moveLine 1.5s infinite linear`,
          animationDelay: `${i * 0.2}s`,
          transform: `perspective(300px) rotateX(60deg) translateZ(${i * 20}px)`,
        }}
      ></div>
    ));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-blue-900">
      {/* Moon */}
      <div className="absolute top-10 right-20 w-20 h-20 bg-yellow-200 rounded-full shadow-[0_0_50px_10px_yellow]"></div>
      
      {/* Stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            animation: `twinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`,
          }}
        ></div>
      ))}
      
      {/* Road */}
      <div 
        ref={roadRef}
        className="absolute left-1/2 transform -translate-x-1/2 w-1/3 h-full bg-gray-700"
        style={{
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center bottom',
        }}
      >
        {/* Road lines */}
        {generateRoadLines(20)}
      </div>
      
      {/* Left side buildings */}
      <div className="absolute left-0 bottom-0 h-2/3 w-1/2 overflow-hidden">
        {generateBuildings(15, 'left')}
      </div>
      
      {/* Right side buildings */}
      <div className="absolute right-0 bottom-0 h-2/3 w-1/2 overflow-hidden">
        {generateBuildings(15, 'right')}
      </div>
      
      {/* Left side trees */}
      <div className="absolute left-0 bottom-0 h-1/3 w-1/2 overflow-hidden">
        {generateTrees(8, 'left')}
      </div>
      
      {/* Right side trees */}
      <div className="absolute right-0 bottom-0 h-1/3 w-1/2 overflow-hidden">
        {generateTrees(8, 'right')}
      </div>
      
      {/* Tall towers */}
      <div className="absolute left-1/4 bottom-0 h-3/4 w-10 bg-gray-900 transform perspective(500px) rotateY(5deg) translateZ(50px)">
        <div className="absolute top-0 w-full h-6 bg-red-600"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`tower-window-${i}`} className="flex justify-around mb-4">
            <div className="w-3 h-3 bg-yellow-300 rounded-sm" style={{ animation: `glow 5s infinite ${i * 0.5}s` }}></div>
          </div>
        ))}
      </div>
      
      <div className="absolute right-1/4 bottom-0 h-4/5 w-12 bg-gray-900 transform perspective(500px) rotateY(-5deg) translateZ(50px)">
        <div className="absolute top-0 w-full h-8 bg-blue-600"></div>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={`tower2-window-${i}`} className="flex justify-around mb-3">
            <div className="w-3 h-3 bg-yellow-300 rounded-sm" style={{ animation: `glow 4s infinite ${i * 0.3}s` }}></div>
            <div className="w-3 h-3 bg-yellow-300 rounded-sm" style={{ animation: `glow 4s infinite ${i * 0.3 + 0.5}s` }}></div>
          </div>
        ))}
      </div>
      
      {/* Style tag for animations */}
      <style jsx>{`
        @keyframes moveLine {
          0% { transform: perspective(300px) rotateX(60deg) translateY(0) translateZ(0); }
          100% { transform: perspective(300px) rotateX(60deg) translateY(-60px) translateZ(0); }
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes sway {
          0%, 100% { transform: translateX(0) translateZ(0) rotate(0deg); }
          50% { transform: translateX(5px) translateZ(0) rotate(2deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default AnimatedEarthAtom;
