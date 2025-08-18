"use client";
import React from "react";
import clsx from "clsx";

const AnimatedCityScape = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "relative w-[100%] overflow-hidden aspect-[3/1]",
        "bg-gradient-to-b from-green-950 via-green-800 to-green-700",
        className
      )}
    >
      {/* Blur overlay (only visible on xs) */}
      <div className="absolute inset-0 backdrop-blur-sm xs:block hidden bg-black/10 z-10 pointer-events-none"></div>

      {/* STAR FIELD */}
      <div className="absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: "1px",
              height: "1px",
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${2 + Math.random() * 3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* GLOWING MOON */}
      <div className="absolute top-6 right-6 w-12 h-12">
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-zinc-100 to-zinc-300"></div>
        <div
          className="absolute inset-0 rounded-full bg-zinc-200/30 animate-ping"
          style={{ animationDuration: "5s" }}
        ></div>
        <div className="absolute inset-0 rounded-full shadow-[0_0_25px_10px_rgba(255,255,200,0.4)]"></div>
      </div>

      {/* FAR skyline - 3 copies for seamless looping */}
      <ParallaxStrip
        className="bottom-2 opacity-100"
        speedClass="animate-[scrollX_70s_linear_infinite] will-change-transform transform-gpu"
        buildingTone="from-emerald-800 to-emerald-700"
        heights={[30, 40, 35, 45]}
        detailLevel="far"
      />

      {/* MID skyline - 3 copies for seamless looping */}
      <ParallaxStrip
        className="bottom-2 opacity-100"
        speedClass="animate-[scrollX_45s_linear_infinite] will-change-transform transform-gpu"
        buildingTone="from-emerald-900 to-emerald-800"
        heights={[50, 60, 55, 65]}
        detailLevel="mid"
      />

      {/* NEAR skyline - 3 copies for seamless looping */}
      <ParallaxStrip
        className="bottom-2 opacity-100"
        speedClass="animate-[scrollX_25s_linear_infinite] will-change-transform transform-gpu"
        buildingTone="from-emerald-950 to-emerald-900"
        heights={[60, 75, 65, 90]}
        hasAntennas
        detailLevel="near"
      />

      {/* Moving Trees - 3 copies for seamless looping */}
      <div className="absolute bottom-4 left-0 right-0 h-8">
        {/* Left trees */}
        <div
          className={clsx(
            "absolute left-0 top-0 w-full",
            "animate-[scrollX_5s_linear_infinite] will-change-transform transform-gpu"
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex w-[300%]">
            <TreeRow side="left" />
            <TreeRow side="left" />
            <TreeRow side="left" />
          </div>
        </div>
        {/* Right trees */}
        <div
          className={clsx(
            "absolute left-0 top-0 w-full",
            "animate-[scrollX_5s_linear_infinite] will-change-transform transform-gpu"
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex w-[300%]">
            <TreeRow side="right" />
            <TreeRow side="right" />
            <TreeRow side="right" />
          </div>
        </div>
      </div>

      {/* L300 Vans with rolling wheels */}
      <div className="absolute bottom-4 left-0 right-0 z-10"> 
        <div className="absolute right-[70%] bottom-1">
          <L300Van color="white" />
        </div>
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-green-950 to-black z-0" />

      {/* Content overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20">
        <div className="pointer-events-auto px-6 py-3 text-white">
          {children}
        </div>
      </div>

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes scrollX {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-66.666%);
          }
        }
        @keyframes twinkle {
          from {
            opacity: 0.2;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes roll {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

function L300Van({ color = "white" }: { color?: string }) {
  const colorMap = {
    white: "bg-gray-100",
    blue: "bg-blue-600",
    red: "bg-red-600",
    green: "bg-green-600",
    yellow: "bg-yellow-400",
  };
  
  return (
    <div className="relative w-24 h-12 transform">
      {/* Main van body */}
      <div className={`absolute top-0 w-full h-10 rounded-sm ${colorMap[color as keyof typeof colorMap]}`}>
        {/* Front section with windshield */}
        <div className="absolute top-0 left-0 w-6 h-8">
          {/* Windshield */}
          <div className="absolute top-0 left-0 w-6 h-4 bg-gradient-to-b from-blue-300 to-blue-400 rounded-t-sm"></div>
          {/* Front grille */}
          <div className="absolute bottom-0 left-0 w-6 h-2 bg-gray-800 rounded-b-sm"></div>
        </div>
        
        {/* Side body */}
        <div className="absolute top-0 left-6 w-18 h-10">
          {/* Side window */}
          <div className="absolute top-1 left-1 w-10 h-3 bg-gradient-to-b from-blue-300 to-blue-400 rounded-sm"></div>
          {/* Rear window */}
          <div className="absolute top-1 right-1 w-5 h-3 bg-gradient-to-b from-blue-300 to-blue-400 rounded-sm"></div>
          {/* Side stripe */}
          <div className="absolute bottom-1 left-1 w-16 h-1 bg-gray-800 rounded-sm"></div>
        </div>
      </div>
      
      {/* Front wheel */}
      <div className="absolute bottom-0 left-4 w-5 h-5 rounded-full bg-black flex items-center justify-center">
        <div 
          className="w-1.5 h-1.5 rounded-full bg-gray-300"
          style={{ animation: "roll 1.5s linear infinite" }}
        ></div>
      </div>
      
      {/* Rear wheel */}
      <div className="absolute bottom-0 right-4 w-5 h-5 rounded-full bg-black flex items-center justify-center">
        <div 
          className="w-1.5 h-1.5 rounded-full bg-gray-300"
          style={{ animation: "roll 1.5s linear infinite" }}
        ></div>
      </div>
    </div>
  );
}

function ParallaxStrip({
  className,
  speedClass,
  buildingTone,
  heights,
  hasAntennas = false,
  detailLevel,
}: {
  className?: string;
  speedClass: string;
  buildingTone: string;
  heights: number[];
  hasAntennas?: boolean;
  detailLevel: "far" | "mid" | "near";
}) {
  return (
    <div className={clsx("absolute left-0 right-0", className)}>
      <div className={clsx("flex w-[300%]", speedClass)}>
        <BuildingsRow
          buildingTone={buildingTone}
          heights={heights}
          hasAntennas={hasAntennas}
          detailLevel={detailLevel}
        />
        <BuildingsRow
          buildingTone={buildingTone}
          heights={heights}
          hasAntennas={hasAntennas}
          detailLevel={detailLevel}
        />
        <BuildingsRow
          buildingTone={buildingTone}
          heights={heights}
          hasAntennas={hasAntennas}
          detailLevel={detailLevel}
        />
      </div>
    </div>
  );
}

function BuildingsRow({
  buildingTone,
  heights,
  hasAntennas,
  detailLevel,
}: {
  buildingTone: string;
  heights: number[];
  hasAntennas?: boolean;
  detailLevel: "far" | "mid" | "near";
}) {
  return (
    <div className="flex w-1/3 items-end gap-6 px-4">
      {heights.map((h, i) => (
        <div key={`${h}-${i}`} className="relative flex items-end">
          <div
            className={clsx(
              "relative w-10 rounded-t-sm bg-gradient-to-b shadow-md overflow-hidden",
              buildingTone
            )}
            style={{ height: `${h}px` }}
          >
            <div className="absolute inset-0 grid grid-cols-3 gap-1 p-1">
              {Array.from({ length: Math.floor(h / 12) * 3 }).map((_, w) => (
                <div
                  key={w}
                  className={clsx(
                    "h-1.5 w-1.5",
                    Math.random() > 0.6
                      ? "bg-yellow-500 opacity-100 shadow-[0_0_2px_rgba(255,255,200,0.9)]"
                      : "bg-emerald-900"
                  )}
                />
              ))}
            </div>
          </div>

          {hasAntennas && i % 2 === 0 && (
            <div className="absolute -top-4 left-1/2 h-4 w-[2px] -translate-x-1/2 bg-green-300/70">
              <div className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-green-200/90" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Tree() {
  return (
    <div className="relative w-1 h-6">
      <div className="absolute bottom-0 left-1 w-0.5 h-1.5 bg-lime-950"></div>
      <div className="absolute bottom-1.5 left-0 w-3 h-3 rounded-full bg-lime-950"></div>
    </div>
  );
}

function TreeRow({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={clsx(
        "w-1/3 flex items-end",
        side === "left" ? "justify-start pl-4" : "justify-end pr-4"
      )}
    >
      <div className="flex space-x-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Tree key={i} />
        ))}
      </div>
    </div>
  );
}

export default React.memo(AnimatedCityScape);
