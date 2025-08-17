'use client';

import { useEffect, useRef } from 'react';

const AnimatedCityscape = ({ theme = 'night', speed = 1 }: { theme?: 'night' | 'day'; speed?: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const carsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize carsRef with null values
  useEffect(() => {
    carsRef.current = carsRef.current.slice(0, 8).map((_, i) => carsRef.current[i] || null);
  }, []);

  // Set up animations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Window twinkling effect
    const buildings = containerRef.current?.querySelectorAll('.building');
    buildings?.forEach(building => {
      const windows = building.querySelectorAll('.window');
      windows.forEach(window => {
        const brightness = theme === 'night' 
          ? Math.random() * 0.7 + 0.3 
          : Math.random() * 0.3 + 0.7;
        (window as HTMLElement).style.opacity = brightness.toString();
        
        if (theme === 'night') {
          const flicker = setInterval(() => {
            const variation = Math.random() * 0.3;
            (window as HTMLElement).style.opacity = Math.max(0.1, brightness - variation).toString();
          }, Math.random() * 3000 + 1000);
          
          return () => clearInterval(flicker);
        }
      });
    });

    // Car animation
    carsRef.current.forEach(car => {
      if (car) {
        const duration = Math.random() * 20000 + 10000;
        car.style.animation = `carMove ${duration / speed}ms linear infinite`;
      }
    });

    // Star twinkling (only for night theme)
    if (theme === 'night' && starsRef.current) {
      const stars = starsRef.current.querySelectorAll('.star');
      stars.forEach(star => {
        const delay = Math.random() * 3000;
        const duration = Math.random() * 2000 + 1000;
        (star as HTMLElement).style.animation = `twinkle ${duration}ms ease-in-out ${delay}ms infinite alternate`;
      });
    }
  }, [theme, speed]);

  // Generate random buildings
  const generateBuildings = () => {
    const buildingCount = 15;
    const buildings = [];
    
    for (let i = 0; i < buildingCount; i++) {
      const width = Math.random() * 80 + 40;
      const height = Math.random() * 200 + 150;
      const windowsPerRow = Math.floor(width / 15);
      const windowRows = Math.floor(height / 20);
      
      const windows = [];
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowsPerRow; col++) {
          if (Math.random() > 0.2) {
            windows.push(
              <div 
                key={`window-${row}-${col}`} 
                className="window absolute bg-yellow-500 rounded-sm"
                style={{
                  left: `${(col / windowsPerRow) * 100}%`,
                  top: `${(row / windowRows) * 100}%`,
                  width: `${80 / windowsPerRow}%`,
                  height: `${80 / windowRows}%`,
                }}
              />
            );
          }
        }
      }
      
      buildings.push(
        <div 
          key={`building-${i}`}
          className="building relative mr-1"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            left: `${(i / buildingCount) * 100}%`,
            backgroundColor: theme === 'night' 
              ? `hsl(220, 30%, ${10 + Math.random() * 10}%)` 
              : `hsl(220, 20%, ${70 + Math.random() * 20}%)`,
          }}
        >
          {windows}
        </div>
      );
    }
    
    return buildings;
  };

  // Generate stars for night theme
  const generateStars = () => {
    if (theme !== 'night') return null;
    
    const starCount = 50;
    const stars = [];
    
    for (let i = 0; i < starCount; i++) {
      stars.push(
        <div
          key={`star-${i}`}
          className="star absolute bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 30}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
        />
      );
    }
    
    return <div ref={starsRef} className="stars absolute top-0 left-0 w-full h-[30%]">{stars}</div>;
  };

  // Generate moving cars
  const generateCars = () => {
    if (theme !== 'night') return null;
    
    const carCount = 8;
    const cars = [];
    
    for (let i = 0; i < carCount; i++) {
      const size = Math.random() * 20 + 10;
      const color = `hsl(${Math.random() * 60}, 80%, 50%)`;
      
      cars.push(
        <div
          key={`car-${i}`}
          ref={(el) => {
            if (el) {
              carsRef.current[i] = el;
            }
          }}
          className="car absolute rounded z-20"
          style={{
            bottom: `${Math.random() * 30 + 10}px`,
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size / 2}px`,
            backgroundColor: color,
            animationDelay: `${Math.random() * 5000}ms`,
          }}
        >
          <div 
            className="carLight absolute top-0 -right-[5px] w-[10px] h-[3px] rounded-l-full" 
            style={{ 
              backgroundColor: color,
              filter: 'blur(1px)',
            }} 
          />
        </div>
      );
    }
    
    return cars;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-[400px] overflow-hidden ${
        theme === 'night' 
          ? 'bg-gradient-to-b from-[#000428] to-[#004e92]' 
          : 'bg-gradient-to-b from-[#87CEEB] to-[#E0F7FA]'
      }`}
      style={{ '--speed': speed } as React.CSSProperties}
    >
      {generateStars()}
      <div className="skyline absolute bottom-20 left-0 w-full h-[calc(100%-80px)] flex items-end">
        {generateBuildings()}
      </div>
      <div className="road absolute bottom-0 left-0 w-full h-[60px] bg-gray-800">
        {generateCars()}
        <div className="roadLine absolute left-0 w-full h-1 bg-yellow-500 top-[15px]" />
        <div className="roadLine absolute left-0 w-full h-1 bg-yellow-500 top-[30px]" />
        <div className="roadLine absolute left-0 w-full h-1 bg-yellow-500 top-[45px]" />
      </div>

      {/* Define animations in style tag */}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
        @keyframes carMove {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedCityscape;
