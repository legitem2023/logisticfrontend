import React from 'react';

const MovingBuildingsBackground = () => {
  // Building generator with better distance parameters
  const generateBuildings = (count, layer) => {
    const layers = {
      far: {
        width: () => `${4 + Math.random() * 8}%`,
        height: () => `${30 + Math.random() * 30}%`,
        speed: 30 + Math.random() * 20,
        lightness: 20 + Math.random() * 10,
        windows: 2 + Math.floor(Math.random() * 3)
      },
      mid: {
        width: () => `${6 + Math.random() * 10}%`,
        height: () => `${50 + Math.random() * 30}%`,
        speed: 15 + Math.random() * 10,
        lightness: 30 + Math.random() * 15,
        windows: 3 + Math.floor(Math.random() * 4)
      },
      near: {
        width: () => `${8 + Math.random() * 12}%`,
        height: () => `${70 + Math.random() * 20}%`,
        speed: 8 + Math.random() * 5,
        lightness: 40 + Math.random() * 20,
        windows: 4 + Math.floor(Math.random() * 5)
      }
    };

    return Array.from({ length: count }).map((_, i) => {
      const config = layers[layer];
      return {
        id: i,
        width: config.width(),
        height: config.height(),
        speed: config.speed,
        lightness: config.lightness,
        windows: config.windows,
        position: Math.random() * 120 - 10,
        hue: 120 + Math.random() * 30,
        saturation: 50 + Math.random() * 20
      };
    });
  };

  const farBuildings = generateBuildings(6, 'far');
  const midBuildings = generateBuildings(5, 'mid');
  const nearBuildings = generateBuildings(4, 'near');

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden bg-gradient-to-b from-green-900 to-green-700">
      {/* Sky gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-900/80 to-green-700/50"></div>
      
      {/* Buildings */}
      <div className="absolute bottom-0 left-0 w-full h-full">
        {/* Far buildings */}
        {farBuildings.map((building) => (
          <div
            key={`far-${building.id}`}
            className="absolute bottom-0 bg-green-800 border-t-4 border-green-900"
            style={{
              left: `${building.position}%`,
              width: building.width,
              height: building.height,
              backgroundColor: `hsl(${building.hue}, ${building.saturation}%, ${building.lightness}%)`,
              animation: `moveRight ${building.speed}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              zIndex: 10,
              boxShadow: 'inset -5px 0 10px rgba(0,0,0,0.3)'
            }}
          >
            <div className="absolute inset-0 grid grid-cols-3 gap-1 p-1">
              {Array.from({ length: building.windows }).map((_, i) => (
                <div 
                  key={`window-far-${i}`}
                  className={`h-2 ${Math.random() > 0.7 ? 'bg-amber-200' : 'bg-green-900/50'}`}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Mid-distance buildings */}
        {midBuildings.map((building) => (
          <div
            key={`mid-${building.id}`}
            className="absolute bottom-0 bg-green-700 border-t-4 border-green-800"
            style={{
              left: `${building.position}%`,
              width: building.width,
              height: building.height,
              backgroundColor: `hsl(${building.hue}, ${building.saturation}%, ${building.lightness}%)`,
              animation: `moveRight ${building.speed}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              zIndex: 20,
              boxShadow: 'inset -8px 0 15px rgba(0,0,0,0.3)'
            }}
          >
            <div className="absolute inset-0 grid grid-cols-4 gap-1 p-2">
              {Array.from({ length: building.windows }).map((_, i) => (
                <div 
                  key={`window-mid-${i}`}
                  className={`h-3 ${Math.random() > 0.7 ? 'bg-amber-200' : 'bg-green-900/50'}`}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Near buildings */}
        {nearBuildings.map((building) => (
          <div
            key={`near-${building.id}`}
            className="absolute bottom-0 bg-green-600 border-t-4 border-green-700"
            style={{
              left: `${building.position}%`,
              width: building.width,
              height: building.height,
              backgroundColor: `hsl(${building.hue}, ${building.saturation}%, ${building.lightness}%)`,
              animation: `moveRight ${building.speed}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              zIndex: 30,
              boxShadow: 'inset -10px 0 20px rgba(0,0,0,0.3)'
            }}
          >
            <div className="absolute inset-0 grid grid-cols-5 gap-2 p-2">
              {Array.from({ length: building.windows }).map((_, i) => (
                <div 
                  key={`window-near-${i}`}
                  className={`h-4 ${Math.random() > 0.7 ? 'bg-amber-200' : 'bg-green-900/50'}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ground plane */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-green-900 to-green-800 z-40"></div>

      {/* Road markings */}
      <div className="absolute bottom-12 left-0 w-full h-1 bg-yellow-400 animate-road-line z-40"></div>
      <div className="absolute bottom-10 left-0 w-full h-1 bg-yellow-400 animate-road-line z-40" style={{ animationDelay: '0.3s' }}></div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes moveRight {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-30vw); }
        }
        @keyframes road-line {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-road-line {
          animation: road-line 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MovingBuildingsBackground;
