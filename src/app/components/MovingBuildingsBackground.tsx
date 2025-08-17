import React from 'react';

const MovingBuildingsBackground = () => {
  // Generate building data
  const generateBuildings = (count, sizeRange, speedRange, heightRange) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      width: `${sizeRange.min + Math.random() * sizeRange.range}%`,
      height: `${heightRange.min + Math.random() * heightRange.range}%`,
      speed: `${speedRange.min + Math.random() * speedRange.range}s`,
      delay: `${Math.random() * 10}s`,
      color: `hsl(${100 + Math.random() * 40}, 70%, ${20 + Math.random() * 15}%)`,
      windows: Math.floor(3 + Math.random() * 5) // columns of windows
    }));
  };

  // Three layers of buildings for parallax effect
  const fastBuildings = generateBuildings(15, {min: 3, range: 5}, {min: 15, range: 10}, {min: 30, range: 60});
  const mediumBuildings = generateBuildings(12, {min: 5, range: 8}, {min: 25, range: 15}, {min: 40, range: 50});
  const slowBuildings = generateBuildings(8, {min: 8, range: 12}, {min: 40, range: 20}, {min: 50, range: 40});

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 to-green-800/40"></div>
      
      {/* Buildings container */}
      <div className="absolute bottom-0 left-0 w-full h-3/4">
        {/* Fast buildings layer */}
        <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
          {fastBuildings.map((building) => (
            <div
              key={`fast-${building.id}`}
              className="absolute bottom-0 h-full flex items-end"
              style={{
                left: `${Math.random() * 100}%`,
                width: building.width,
                animation: `moveBuilding ${building.speed} linear infinite`,
                animationDelay: building.delay,
              }}
            >
              <div
                className="w-full relative"
                style={{
                  height: building.height,
                  backgroundColor: building.color,
                }}
              >
                {/* Windows */}
                <div className="absolute inset-0 grid grid-cols-3 gap-1 p-1">
                  {Array.from({ length: building.windows * 10 }).map((_, i) => (
                    <div
                      key={`window-fast-${building.id}-${i}`}
                      className={`h-2 ${Math.random() > 0.7 ? 'bg-green-100' : 'bg-green-900'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Medium buildings layer */}
        <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
          {mediumBuildings.map((building) => (
            <div
              key={`medium-${building.id}`}
              className="absolute bottom-0 h-full flex items-end"
              style={{
                left: `${Math.random() * 100}%`,
                width: building.width,
                animation: `moveBuilding ${building.speed} linear infinite`,
                animationDelay: building.delay,
              }}
            >
              <div
                className="w-full relative"
                style={{
                  height: building.height,
                  backgroundColor: building.color,
                }}
              >
                {/* Windows */}
                <div className="absolute inset-0 grid grid-cols-4 gap-1 p-2">
                  {Array.from({ length: building.windows * 15 }).map((_, i) => (
                    <div
                      key={`window-medium-${building.id}-${i}`}
                      className={`h-3 ${Math.random() > 0.7 ? 'bg-green-200' : 'bg-green-800'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slow buildings layer */}
        <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
          {slowBuildings.map((building) => (
            <div
              key={`slow-${building.id}`}
              className="absolute bottom-0 h-full flex items-end"
              style={{
                left: `${Math.random() * 100}%`,
                width: building.width,
                animation: `moveBuilding ${building.speed} linear infinite`,
                animationDelay: building.delay,
              }}
            >
              <div
                className="w-full relative"
                style={{
                  height: building.height,
                  backgroundColor: building.color,
                }}
              >
                {/* Windows */}
                <div className="absolute inset-0 grid grid-cols-5 gap-2 p-3">
                  {Array.from({ length: building.windows * 20 }).map((_, i) => (
                    <div
                      key={`window-slow-${building.id}-${i}`}
                      className={`h-4 ${Math.random() > 0.7 ? 'bg-green-300' : 'bg-green-700'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full bg-green-100"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random(),
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
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default MovingBuildingsBackground;
