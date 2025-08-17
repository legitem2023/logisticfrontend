"use client";

import React from "react";
import clsx from "clsx";

export default function AnimatedCityScape({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "relative w-full overflow-hidden",
        "bg-gradient-to-b from-green-950 via-green-900 to-green-800",
        "h-[320px] md:h-[420px]",
        className
      )}
    >
      {/* STAR FIELD */}
      <div className="absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: "2px",
              height: "2px",
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${2 + Math.random() * 3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* FAR skyline */}
      <ParallaxStrip
        className="bottom-28 opacity-40"
        speedClass="animate-[scrollX_70s_linear_infinite]"
        buildingTone="from-green-800 to-green-700"
        heights={[70, 90, 80, 100]}
      />

      {/* MID skyline */}
      <ParallaxStrip
        className="bottom-16 opacity-70"
        speedClass="animate-[scrollX_45s_linear_infinite]"
        buildingTone="from-green-900 to-green-800"
        heights={[110, 130, 120, 140]}
      />

      {/* NEAR skyline */}
      <ParallaxStrip
        className="bottom-6 opacity-100"
        speedClass="animate-[scrollX_25s_linear_infinite]"
        buildingTone="from-green-950 to-green-900"
        heights={[160, 190, 170, 200]}
        hasAntennas
      />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-green-950 to-black" />

      {/* Content overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="pointer-events-auto rounded-2xl bg-white/10 px-6 py-3 backdrop-blur-sm text-white">
          {children}
        </div>
      </div>

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes scrollX {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
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
      `}</style>
    </div>
  );
}

function ParallaxStrip({
  className,
  speedClass,
  buildingTone,
  heights,
  hasAntennas = false,
}: {
  className?: string;
  speedClass: string;
  buildingTone: string;
  heights: number[];
  hasAntennas?: boolean;
}) {
  return (
    <div className={clsx("absolute left-0 right-0", className)}>
      <div className={clsx("flex w-[200%] gap-8", speedClass)}>
        <BuildingsRow
          buildingTone={buildingTone}
          heights={heights}
          hasAntennas={hasAntennas}
        />
        <BuildingsRow
          buildingTone={buildingTone}
          heights={heights}
          hasAntennas={hasAntennas}
        />
      </div>
    </div>
  );
}

function BuildingsRow({
  buildingTone,
  heights,
  hasAntennas,
}: {
  buildingTone: string;
  heights: number[];
  hasAntennas?: boolean;
}) {
  return (
    <div className="flex w-1/2 items-end gap-8 px-6">
      {heights.map((h, i) => (
        <div key={`${h}-${i}`} className="relative flex items-end">
          {/* Building */}
          <div
            className={clsx(
              "relative w-14 rounded-t-sm bg-gradient-to-b shadow-md",
              buildingTone
            )}
            style={{ height: `${h}px` }}
          >
            {/* Windows */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 18px, rgba(255,255,200,0.8) 18px, rgba(255,255,200,0.8) 20px)",
                backgroundSize: "100% 20px",
                opacity: 0.2,
              }}
            />
          </div>

          {/* Antennas */}
          {hasAntennas && i % 2 === 0 && (
            <div className="absolute -top-6 left-1/2 h-6 w-[2px] -translate-x-1/2 bg-green-300/70">
              <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-green-200/90" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
