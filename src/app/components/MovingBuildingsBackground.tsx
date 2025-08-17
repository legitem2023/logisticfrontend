import React from 'react';

const MovingBuildingsBackground = () => {
  // Generate building data with premium color scheme
  const generateBuildings = (count, sizeRange, speedRange, heightRange, distance) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      width: `${sizeRange.min + Math.random() * sizeRange.range}%`,
      height: `${heightRange.min + Math.random() * heightRange.range}%`,
      speed: speedRange.min + Math.random() * speedRange.range,
      delay: Math.random() * 10,
      color: `hsl(${120 + Math.random() * 30}, ${60 + Math.random() * 20}%, ${15 + Math.random() * 10}%)`,
      windowColor: Math.random() > 0.7 ? 'bg-amber-200' : 'bg-green-900/50',
      windows: Math.floor(3 + Math.random() * 5),
      distance: distance,
      startPos: Math.random() * 100
    }));
  };

  // Three layers of buildings with distance-based properties
  const fastBuildings = generateBuildings(12, {min: 3, range: 5}, {min: 2, range: 3}, {min: 30, range: 50}, 'close');
  const mediumBuildings = generateBuildings(10, {min: 5, range: 8}, {min: 1, range: 1.5}, {min: 40, range: 60}, 'medium');
  const slowBuildings = generateBuildings(6, {min: 8, range: 12}, {min: 0.5, range: 0.7}, {min: 50, range: 70}, 'far');

  return (
    <div className="absolute top-0 left-0 w-full h-64 overflow-hidden bg-gradient-to-b from-green-900 to-green-700 perspective-1000">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 via-green-800/10 to-green-900/30 animate-pulse-slow"></div>
      
      {/* Buildings container */}
      <div className="absolute bottom-0 left-0 w-full h-full">
        {/* Fast buildings (closest) */}
        <div className="absolute bottom-0 left-0 w-full h-full">
          {fastBuildings.map((building) => (
            <div
              key={`fast-${building.id}`}
              className="absolute bottom-0 h-full origin-bottom"
              style={{
                left: `${building.startPos}%`,
                width: building.width,
                transform: `translateX(${building.startPos}%) scale(${building.distance === 'close' ? 1 : building.distance === 'medium' ? 0.8 : 0.6})`,
                animation: `moveBuilding ${building.speed}s linear infinite`,
                animationDelay: `${building.delay}s`,
                zIndex: building.distance === 'close' ? 30 : building.distance === 'medium' ? 20 : 10
              }}
            >
              <div
                className="w-full h-full relative"
                style={{
                  height: building.height,
                  backgroundColor: building.color,
                  boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.3)',
                  transform: `scaleX(${Math.random() > 0.5 ? 1 : -1})` // Random mirroring for variety
                }}
              >
                <div className="absolute inset-0 grid grid-cols-3 gap-1 p-1">
                  {Array.from({ length: building.windows * 8 }).map((_, i) => (
                    <div
                      key={`window-fast-${building.id}-${i}`}
                      className={`h-2 ${building.windowColor}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Medium buildings */}
        <div className="absolute bottom-0 left-0 w-full h-full">
          {mediumBuildings.map((building) => (
            <div
              key={`medium-${building.id}`}
              className="absolute bottom-0 h-full origin-bottom"
              style={{
                left: `${building.startPos}%`,
                width: building.width,
                transform: `translateX(${building.startPos}%) scale(${building.distance === 'close' ? 1 : building.distance === 'medium' ? 0.8 : 0.6})`,
                animation: `moveBuilding ${building.speed}s linear infinite`,
                animationDelay: `${building.delay}s`,
                zIndex: building.distance === 'close' ? 30 : building.distance === 'medium' ? 20 : 10
              }}
            >
              <div
                className="w-full h-full relative"
                style={{
                  height: building.height,
                  backgroundColor: building.color,
                  boxShadow: 'inset 0 -10px 15px rgba(0,0,0,0.3)',
                  transform: `scaleX(${Math.random() > 0.5 ? 1 : -1})`
                }}
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-1 p-2">
                  {Array.from({ length: building.windows * 12 }).map((_, i) => (
                    <div
                      key={`window-medium-${building.id}-${i}`}
                      className={`h-3 ${building.windowColor}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slow buildings (farthest) */}
        <div className="absolute bottom-0 left-0 w-full h-full">
          {slowBuildings.map((building) => (
            <div
              key={`slow-${building.id}`}
              className="absolute bottom-0 h-full origin-bottom"
              style={{
                left: `${building.startPos}%`,
                width: building.width,
                transform: `translateX(${building.startPos}%) scale(${building.distance === 'close' ? 1 : building.distance === 'medium' ? 0.8 : 0.6})`,
                animation: `moveBuilding ${building.speed}s linear infinite`,
                animationDelay: `${building.delay}s`,
                zIndex: building.distance === 'close' ? 30 : building.distance === 'medium' ? 20 : 10
              }}
            >
              <div
                className="w-full h-full relative"
                style={{
                  height: building.height,
                  backgroundColor: building.color,
                  boxShadow: 'inset 0 -15px 20px rgba(0,0,0,0.3)',
                  transform: `scaleX(${Math.random() > 0.5 ? 1 : -1})`
                }}
              >
                <div className="absolute inset-0 grid grid-cols-5 gap-2 p-3">
                  {Array.from({ length: building.windows * 15 }).map((_, i) => (
                    <div
                      key={`window-slow-${building.id}-${i}`}
                      className={`h-4 ${building.windowColor}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Road lines for better motion perception */}
      <div className="absolute bottom-0 left-0 w-full h-4 flex items-center">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-300 animate-road-line"></div>
      </div>

      {/* Glowing elements for premium feel */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`glow-${i}`}
            className="absolute rounded-full bg-amber-200/20 blur-md"
            style={{
              width: `${20 + Math.random() * 50}px`,
              height: `${20 + Math.random() * 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `pulse ${5 + Math.random() * 10}s infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes moveBuilding {
          0% {
            transform: translateX(100vw) scale(var(--building-scale, 1));
          }
          100% {
            transform: translateX(-30vw) scale(var(--building-scale, 1));
          }
        }
        
        @keyframes road-line {
          0% {
            transform: translateX(0) scaleX(0.5);
          }
          100% {
            transform: translateX(-100%) scaleX(0.5);
          }
        }
        
        .animate-road-line {
          animation: road-line 0.5s linear infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.3;
          }
        }
        
        @keyframes pulse {
          0% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          100% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default MovingBuildingsBackground;
