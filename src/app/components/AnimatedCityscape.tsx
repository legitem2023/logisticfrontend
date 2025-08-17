"use client";

import React from "react";
import clsx from "clsx";

/**
 * AnimatedCityScape
 *
 * Tailwind-only (no external animation libs) parallax cityscape.
 * - Three skyline layers moving at different speeds for depth.
 * - Seamless, infinite horizontal scroll using CSS keyframes.
 * - Drop this anywhere; use as a background wrapper and put your header inside as children.
 *
 * Usage:
 * <AnimatedCityScape className="h-[380px]">
 *   <YourHeader />
 * </AnimatedCityScape>
 */
export default function AnimatedCityscape({
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
        // Sky background
        "bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100",
        // Optional height; override via className
        "h-[320px] md:h-[420px]",
        className
      )}
    >
      {/* Sun / glow */}
      <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-yellow-300/70 blur-2xl" />

      {/* FAR skyline (light, slow) */}
      <ParallaxStrip
        className="bottom-24 opacity-60 [filter:drop-shadow(0_4px_0_rgb(0_0_0_/_0.08))]"
        speedClass="animate-[scrollX_60s_linear_infinite]"
        buildingTone="from-slate-300 to-slate-400"
        heights={[60, 72, 64, 80, 68, 76, 70, 86, 62, 74, 66, 78]}
      />

      {/* MID skyline (darker, medium speed) */}
      <ParallaxStrip
        className="bottom-16 opacity-80 [filter:drop-shadow(0_6px_0_rgb(0_0_0_/_0.12))]"
        speedClass="animate-[scrollX_40s_linear_infinite]"
        buildingTone="from-slate-500 to-slate-600"
        heights={[92, 110, 104, 120, 96, 108, 112, 124, 100, 118, 106, 116]}
      />

      {/* NEAR skyline (darkest, fastest) */}
      <ParallaxStrip
        className="bottom-10 opacity-100 [filter:drop-shadow(0_8px_0_rgb(0_0_0_/_0.18))]"
        speedClass="animate-[scrollX_22s_linear_infinite]"
        buildingTone="from-slate-700 to-slate-800"
        heights={[140, 168, 156, 176, 148, 172, 160, 184, 152, 170, 158, 180]}
        hasAntennas
      />

      {/* Ground strip to anchor the scene */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-slate-700 to-slate-900" />

      {/* Content overlay (place your Premium Header here) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="pointer-events-auto rounded-2xl bg-white/10 px-6 py-3 backdrop-blur-sm">
          {children}
        </div>
      </div>

      {/* Keyframes (Tailwind arbitrary animations hook into these names) */}
      <style jsx global>{`
        @keyframes scrollX { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}

/**
 * A scrolling strip that renders two identical building rows side-by-side to create
 * a seamless loop. Width is 200% so translateX(-50%) loops perfectly.
 */
function ParallaxStrip({
  className,
  speedClass,
  buildingTone,
  heights,
  hasAntennas = false,
}: {
  className?: string;
  speedClass: string; // e.g., "animate-[scrollX_40s_linear_infinite]"
  buildingTone: string; // tailwind gradient classes, e.g., "from-slate-500 to-slate-700"
  heights: number[]; // building heights in px
  hasAntennas?: boolean;
}) {
  return (
    <div className={clsx("absolute left-0 right-0", className)}>
      <div className={clsx("flex w-[200%]", speedClass)}>
        {/* Duplicate rows for infinite loop */}
        <BuildingsRow buildingTone={buildingTone} heights={heights} hasAntennas={hasAntennas} />
        <BuildingsRow buildingTone={buildingTone} heights={heights} hasAntennas={hasAntennas} />
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
    <div className="flex w-1/2 items-end gap-2 px-2">
      {heights.map((h, i) => (
        <div key={`${h}-${i}`} className="relative flex items-end">
          {/* Building */}
          <div
            className={clsx(
              "relative w-10 rounded-t-sm bg-gradient-to-b shadow-sm",
              buildingTone
            )}
            style={{ height: `${h}px` }}
          >
            {/* Simple windows using repeating linear gradient overlay */}
            <div
              className="absolute inset-0 opacity-25 mix-blend-overlay"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 18px, rgba(255,255,255,0.9) 18px, rgba(255,255,255,0.9) 20px)",
              }}
            />

            {/* Roof variants */}
            {i % 3 === 0 && (
              <div className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t bg-slate-900/20" />
            )}
          </div>

          {/* Antennas on some buildings for silhouette interest */}
          {hasAntennas && i % 4 === 0 && (
            <div className="absolute -top-6 left-1/2 h-6 w-[2px] -translate-x-1/2 bg-slate-400/70">
              <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-slate-300/90" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
