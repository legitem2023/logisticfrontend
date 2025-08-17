"use client";
import React from "react";
import clsx from "clsx";

export default function AnimatedCityscape() {
  return (
    <div className="relative w-full aspect-[3/1] overflow-hidden bg-gradient-to-b from-[#001a00] via-[#003300] to-[#004d00]">
      {/* Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      {/* City Layers */}
      <CityLayer speed={10} buildingTone="from-green-900 to-green-800" heights={[50, 60, 55, 70, 65, 75]} />
      <CityLayer speed={20} buildingTone="from-green-700 to-green-600" heights={[80, 100, 90, 110, 95, 105]} />
      <CityLayer speed={35} buildingTone="from-green-500 to-green-400" heights={[160, 200, 180, 220, 190, 210]} near />
    </div>
  );
}

function CityLayer({
  speed,
  buildingTone,
  heights,
  near,
}: {
  speed: number;
  buildingTone: string;
  heights: number[];
  near?: boolean;
}) {
  return (
    <div
      className="absolute bottom-0 flex animate-cityscape"
      style={{
        animationDuration: `${speed}s`,
      }}
    >
      <BuildingsRow buildingTone={buildingTone} heights={heights} near={near} />
      <BuildingsRow buildingTone={buildingTone} heights={heights} near={near} />
    </div>
  );
}

function BuildingsRow({
  buildingTone,
  heights,
  near,
}: {
  buildingTone: string;
  heights: number[];
  near?: boolean;
}) {
  return (
    <div className="flex w-screen items-end gap-10 px-8">
      {heights.map((h, i) => (
        <div key={`${h}-${i}`} className="relative flex items-end">
          {/* Building */}
          <div
            className={clsx(
              "relative w-16 rounded-t-sm bg-gradient-to-b shadow-md overflow-hidden",
              buildingTone
            )}
            style={{ height: `${h}px` }}
          >
            {/* Windows */}
            {near ? (
              <div className="absolute inset-0 grid grid-cols-3 gap-1 p-1">
                {Array.from({ length: Math.floor(h / 12) * 3 }).map((_, w) => (
                  <div
                    key={w}
                    className={clsx(
                      "h-2 w-4 rounded-sm",
                      Math.random() > 0.6
                        ? "bg-yellow-300 shadow-[0_0_6px_rgba(255,255,200,0.8)] animate-flicker"
                        : "bg-transparent"
                    )}
                  />
                ))}
              </div>
            ) : (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(transparent, transparent 18px, rgba(255,255,200,0.3) 18px, rgba(255,255,200,0.3) 20px)",
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
                      }
