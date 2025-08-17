import React from 'react';

const MovingBuildingsBackground = () => {
  // Generate building data with adjusted color scheme
  const generateBuildings = (count, sizeRange, speedRange, heightRange, distance) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      width: `${sizeRange.min + Math.random() * sizeRange.range}%`,
      height: `${heightRange.min + Math.random() * heightRange.range}%`,
      speed: speedRange.min + Math.random() * speedRange.range,
      delay: Math.random() * 10,
      // Lighter color scheme based on distance
      color: `hsl(${120 + Math.random() * 30}, ${50 + Math.random() * 20}%, ${
        distance === 'close' ? 40 + Math.random() * 20 : 
        distance === 'medium' ? 30 + Math.random() * 15 : 
        20 + Math.random() * 10}%)`,
      windowColor: Math.random() > 0.7 ? 'bg-amber-200' : 'bg-green-900/50',
      windows: Math.floor(3 + Math.random() * 5),
      distance: distance,
      startPos: Math.random() * 120 - 20 // Some buildings start partially offscreen
    }));
  };

  // Three layers of buildings with adjusted parameters
  const fastBuildings = generateBuildings(8, {min: 5, range: 8}, {min: 3, range: 2}, {min: 60, range: 15}, 'close');
  const mediumBuildings = generateBuildings(6, {min: 7, range: 10}, {min: 5, range: 3}, {min: 50, range: 20}, 'medium');
  const slowBuildings = generateBuildings(4, {min: 10, range: 15}, {min: 8, range: 4}, {min: 40, range: 25}, 'far');

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden bg-gradient-to-b from-green-900 to-green-700">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 via-green-800/10 to-green-900/30 animate-pulse-slow"></div>
      
      {/* Buildings container */}
      <div className="absolute bottom-0 left-0 w-full h-full">
        {/* Slow buildings (farthest) */}
        <div className="absolute bottom-0 left-0 w-full h-full">
          {slowBuildings.map((building) => (
            <div
              key={`slow-${building.id}`}
              className="absolute bottom-0 h-full origin-bottom"
              style={{
                left: `${building.startPos}%`,
                width: building.width,
                animation: `moveBuilding ${building.speed}s linear infinite`,
                animationDelay: `${building.delay}s`,
                zIndex: 10,
                height: `${building.height}%`
              }}
            >
              <div
                className="w-full h-full relative"
                style={{
                  height: '100%',
                  backgroundColor: building.color,
                  boxShadow: 'inset 0 -15px 20px rgba(0,0,0,0.3)',
                  transform: `scaleX(${Math.random() > 0.5 ? 1 : -1})`
                }}
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-1 p-2">
                  {Array.from({ length: building.windows * 8 }).map((_, i) => (
                    <div
                      key={`window-slow-${building.id}-${i}`}
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
                animation: `moveBuilding ${building.speed}s linear infinite`,
                animationDelay: `${building.delay}s`,
                zIndex: 20,
                height: `${building.height}%`
              }}
            >
              <div
                className="w-full h-full relative"
                style={{
                  height: '100%',
                  backgroundColor: building.color,
                  boxShadow: 'inset 0 -10px 15px rgba(0,0,0,0.3)',
                  transform: `scaleX(${Math.random() > 0.5 ? 1 : -1})`
                }}
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-1 p-2">
                  {Array.from({ length: building.windows * 10 }).map((_, i) => (
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

        {/* Fast buildings (closest) - now 3/4 of screen height */}
        <div className="absolute bottom-0 left-0 w-full h-full">
          {fastBuildings.map((building) => (
            <div
              key={`fast-${building.id}`}
              className="absolute bottom-0 h-full origin-bottom"
              style={{
                left: `${building.startPos}%`,
                width: building.width,
                animation: `moveBuilding ${building.speed}s linear infinite`,
                animationDelay: `${building.delay}s`,
                zIndex: 30,
                height: `${building.height}%`
              }}
            >
              <div
                className="w-full h-full relative"
                style={{
                  height: '75%', // 3/4 of screen height
                  backgroundColor: building.color,
                  boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.3)',
                  transform: `scaleX(${Math.random() > 0.5 ? 1 : -1})`
                }}
              >
                <div className="absolute inset-0 grid grid-cols-5 gap-1 p-2">
                  {Array.from({ length: building.windows * 12 }).map((_, i) => (
                    <div
                      key={`window-fast-${building.id}-${i}`}
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
      <div className="absolute bottom-0 left-0 w-full h-6 flex items-center">
        <div className="absolute bottom-1 left-0 w-full h-1 bg-yellow-300 animate-road-line"></div>
        <div className="absolute bottom-3 left-0 w-full h-1 bg-yellow-300 animate-road-line" style={{ animationDelay: '0.25s' }}></div>
      </div>

      {/* Glowing elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
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
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-30vw);
          }
        }
        
        @keyframes road-line {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-road-line {
          animation: road-line 0.8s linear infinite;
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
      `}</style>
    </div>
  );
};

export default MovingBuildingsBackground;
