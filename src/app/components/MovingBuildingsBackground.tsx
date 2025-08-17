import React from 'react';

const MovingBuildingsBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden w-full h-full">
      {/* Animated Buildings Container */}
      <div className="absolute bottom-0 left-0 w-full h-3/4 flex items-end">
        {/* Building columns - each will move at different speeds */}
        <div className="absolute bottom-0 left-0 h-full w-full flex items-end gap-8">
          {/* Fast moving buildings (smaller) */}
          {[...Array(15)].map((_, i) => (
            <div 
              key={`fast-${i}`}
              className="relative h-full"
              style={{
                width: `${3 + Math.random() * 5}%`,
                animation: `moveBuilding ${15 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            >
              <div 
                className="absolute bottom-0 w-full"
                style={{
                  height: `${30 + Math.random() * 60}%`,
                  backgroundColor: `hsl(${100 + Math.random() * 40}, 60%, ${20 + Math.random() * 15}%)`,
                }}
              >
                {/* Windows */}
                <div className="absolute inset-0 grid grid-cols-3 gap-1 p-1">
                  {[...Array(Math.floor(3 * 10))].map((_, j) => (
                    <div 
                      key={`window-fast-${i}-${j}`}
                      className={`h-2 ${Math.random() > 0.7 ? 'bg-green-100' : 'bg-green-900'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 h-full w-full flex items-end gap-12">
          {/* Medium speed buildings */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={`medium-${i}`}
              className="relative h-full"
              style={{
                width: `${5 + Math.random() * 8}%`,
                animation: `moveBuilding ${25 + Math.random() * 15}s linear infinite`,
                animationDelay: `${Math.random() * 15}s`,
              }}
            >
              <div 
                className="absolute bottom-0 w-full"
                style={{
                  height: `${40 + Math.random() * 50}%`,
                  backgroundColor: `hsl(${100 + Math.random() * 30}, 65%, ${15 + Math.random() * 10}%)`,
                }}
              >
                {/* Windows */}
                <div className="absolute inset-0 grid grid-cols-4 gap-1 p-2">
                  {[...Array(Math.floor(4 * 15))].map((_, j) => (
                    <div 
                      key={`window-medium-${i}-${j}`}
                      className={`h-3 ${Math.random() > 0.7 ? 'bg-green-200' : 'bg-green-800'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 h-full w-full flex items-end gap-16">
          {/* Slow moving buildings (taller) */}
          {[...Array(8)].map((_, i) => (
            <div 
              key={`slow-${i}`}
              className="relative h-full"
              style={{
                width: `${8 + Math.random() * 12}%`,
                animation: `moveBuilding ${40 + Math.random() * 20}s linear infinite`,
                animationDelay: `${Math.random() * 20}s`,
              }}
            >
              <div 
                className="absolute bottom-0 w-full"
                style={{
                  height: `${50 + Math.random() * 40}%`,
                  backgroundColor: `hsl(${100 + Math.random() * 20}, 70%, ${10 + Math.random() * 10}%)`,
                }}
              >
                {/* Windows */}
                <div className="absolute inset-0 grid grid-cols-5 gap-2 p-3">
                  {[...Array(Math.floor(5 * 20))].map((_, j) => (
                    <div 
                      key={`window-slow-${i}-${j}`}
                      className={`h-4 ${Math.random() > 0.7 ? 'bg-green-300' : 'bg-green-700'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add some stars/moon for night effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
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

      {/* Add the CSS animation */}
      <style jsx>{`
        @keyframes moveBuilding {
          0% {
            transform: translateX(100%);
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
