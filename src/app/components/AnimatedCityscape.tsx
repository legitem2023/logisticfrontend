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
        "backdrop-blur relative w-[100%] overflow-hidden aspect-[3/1]",
        "bg-gradient-to-b from-emerald-950 via-emerald-800 to-emerald-700",
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
              width: "1px",
              height: "1px",
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${2 + Math.random() * 3}s infinite alternate`,
            }}
          />
        ))}
      </div>


    {/* GLOWING MOON - Added this section */}
      <div className="absolute top-6 right-6 w-12 h-12">
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-zinc-100 to-zinc-300"></div>
        <div className="absolute inset-0 rounded-full bg-zinc-200/30 animate-ping" style={{ animationDuration: '5s' }}></div>
        <div className="absolute inset-0 rounded-full shadow-[0_0_25px_10px_rgba(255,255,200,0.4)]"></div>
      </div>


      
      {/* FAR skyline */}
      <ParallaxStrip
        className="bottom-2 opacity-100"
        speedClass="animate-[scrollX_70s_linear_infinite]"
        buildingTone="from-green-800 to-green-700"
        heights={[30, 40, 35, 45]} // shrunk
        detailLevel="far"
      />

      {/* MID skyline */}
      <ParallaxStrip
        className="bottom-2 opacity-100"
        speedClass="animate-[scrollX_45s_linear_infinite]"
        buildingTone="from-green-900 to-green-800"
        heights={[50, 60, 55, 65]} // shrunk
        detailLevel="mid"
      />

      {/* NEAR skyline */}
      <ParallaxStrip
        className="bottom-2 opacity-100"
        speedClass="animate-[scrollX_25s_linear_infinite]"
        buildingTone="from-green-950 to-green-900"
        heights={[60, 75, 65, 90]} // shrunk
        hasAntennas
        detailLevel="near"
      />

      {/* Moving Trees - both sides */}
      <div className="absolute bottom-4 left-0 right-0 h-8">
        {/* Left side trees - 30% faster than near buildings (25s * 0.7 = 17.5s) */}
        <div className={clsx("absolute left-0 top-0 w-full", "animate-[scrollX_5s_linear_infinite]")}>
          <div className="flex w-[200%]">
            <TreeRow side="left" />
            <TreeRow side="left" />
          </div>
        </div>
        
        {/* Right side trees - same speed as left */}
        <div className={clsx("absolute left-0 top-0 w-full", "animate-[scrollX_5s_linear_infinite]")}>
          <div className="flex w-[200%]">
            <TreeRow side="right" />
            <TreeRow side="right" />
          </div>
        </div>
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-green-950 to-black" />

      {/* Content overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="pointer-events-auto px-6 py-3 text-white">
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
      <div className={clsx("flex w-[200%] gap-6", speedClass)}>
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
    <div className="flex w-1/2 items-end gap-6 px-4">
      {heights.map((h, i) => (
        <div key={`${h}-${i}`} className="relative flex items-end">
          {/* Building */}
          <div
            className={clsx(
              "relative w-10 rounded-t-sm bg-gradient-to-b shadow-md overflow-hidden", // narrower
              buildingTone
            )}
            style={{ height: `${h}px` }}
          >
            {/* Windows - all layers use individual windows with weaker light */}
            <div className="absolute inset-0 grid grid-cols-3 gap-0.8 p-1">
              {Array.from({ length: Math.floor(h / 12) * 3 }).map((_, w) => (
                <div
                  key={w}
                  className={clsx(
                    "h-2 w-2",
                    // Weaker light for all windows
                    Math.random() > 0.6
                      ? "bg-yellow-500 opacity-100 shadow-[0_0_2px_rgba(255,255,200,0.9)]"
                      : "bg-emerald-900"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Antennas */}
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

// Tree component with dark green colors
function Tree() {
  return (
    <div className="relative w-1 h-6">
      <div className="absolute bottom-0 left-1 w-0.5 h-1.5 bg-lime-950"></div>
      <div className="absolute bottom-1.5 left-0 w-3 h-3 rounded-full bg-lime-950"></div>
    </div>
  );
}

// Tree row component
function TreeRow({ side }: { side: "left" | "right" }) {
  return (
    <div className={clsx(
      "w-1/2 flex items-end",
      side === "left" ? "justify-start pl-4" : "justify-end pr-4"
    )}>
      <div className="flex space-x-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Tree key={i} />
        ))}
      </div>
    </div>
  );
                      }
