"use client";
import React from "react";
import clsx from "clsx";
import type { SVGProps } from 'react';

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

      {/* Delivery Trucks */}
      <div className="absolute bottom-4 left-0 right-0 z-10">
        <div className="absolute left-[15%] bottom-0">
          <DeliveryTruck className="h-16 w-16" />
        </div>
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-green-950 to-black" />

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
        @keyframes wheel-roll {
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

function DeliveryTruck({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={64}
        height={64}
        viewBox="0 0 64 64"
        className={clsx(className, "transform scale-x-[-1]")} // Flip horizontally
        {...props}
      >
        <path fill="#b2c1c0" d="M62 50.8c0-1-.8-1.9-1.9-1.9H3.9c-1 0-1.9.8-1.9 1.9v1.9c0 1 .8 1.9 1.9 1.9h56.2c1 0 1.9-.8 1.9-1.9z"></path>
        <g className="truck-wheel">
          <ellipse cx={12.3} cy={55.5} fill="#1a1a1a" rx={6.6} ry={6.5}></ellipse>
          <ellipse cx={12.3} cy={55.5} fill="#b2c1c0" rx={3.8} ry={3.7}></ellipse>
        </g>
        <g className="truck-wheel">
          <ellipse cx={50.8} cy={55.5} fill="#1a1a1a" rx={6.6} ry={6.5}></ellipse>
          <ellipse cx={50.8} cy={55.5} fill="#b2c1c0" rx={3.8} ry={3.7}></ellipse>
        </g>
        <path fill="#606262" d="M54.5 19H28.2c-3.1 0-5.6 2.5-5.6 5.6v24.3h37.5V24.6c0-3.1-2.5-5.6-5.6-5.6"></path>
        <path fill="#e3e3e3" d="M15.1 26.5c-4.5 0-5.6 0-5.6 7.5c0 5.6-5.6 5.6-5.6 11.2v3.7h18.8V26.5z"></path>
        <path fill="#ffce31" d="M5.8 43.3h1.9V47H5.8z"></path>
        <path fill="#cbc9c9" d="M12.8 39.6c-1.1 0-1.7.8-1.3 1.8l1.6 4c.4 1 1.6 1.7 2.7 1.7h3c1.1 0 2-.8 2-1.9v-3.7c0-1-.9-1.9-2-1.9z"></path>
        <g fill="#1a1a1a">
          <path d="M20.8 28.3h-7.5s-1.9.2-1.9 2.8v4.5s0 2.1 1.9 2.1h7.5z"></path>
          <circle cx={12.3} cy={51.7} r={0.9}></circle>
          <circle cx={9.1} cy={53.6} r={0.9}></circle>
          <path d="M8.6 56.5c.4-.3 1-.1 1.3.3s.1 1-.3 1.3s-1 .1-1.3-.3c-.3-.5-.2-1 .3-1.3"></path>
          <circle cx={12.3} cy={59.2} r={0.9}></circle>
          <circle cx={15.6} cy={57.3} r={0.9}></circle>
          <circle cx={15.6} cy={53.6} r={0.9}></circle>
        </g>
        <circle cx={12.3} cy={55.5} r={1.9} fill="#606262"></circle>
        <g fill="#1a1a1a">
          <circle cx={50.8} cy={51.7} r={0.9}></circle>
          <circle cx={47.5} cy={53.6} r={0.9}></circle>
          <path d="M47 56.5c.4-.3 1-.1 1.3.3s.1 1-.3 1.3s-1 .1-1.3-.3c-.3-.5-.1-1 .3-1.3"></path>
          <circle cx={50.8} cy={59.2} r={0.9}></circle>
          <circle cx={54} cy={57.3} r={0.9}></circle>
          <circle cx={54} cy={53.6} r={0.9}></circle>
        </g>
        <circle cx={50.8} cy={55.5} r={1.9} fill="#606262"></circle>
        <path fill="#fff" d="M28.4 32.7c-.5-.4-1.2-.6-2.2-.6c-.6 0-1.2 0-1.6.1v5.4c.3 0 .8.1 1.4.1c1.1 0 1.9-.3 2.5-.8c.5-.5.9-1.2.9-2.2c-.2-.9-.5-1.5-1-2m-2.3 4.2h-.6V33c.1 0 .4-.1.7-.1c1.3 0 2 .7 2 1.9c0 1.4-.8 2.1-2.1 2.1m7.1-1.7h-2.1v1.6h2.3v.8h-3.3v-5.5h3.2v.9h-2.2v1.4h2.1zm2.1 1.6v-4.7h-1v5.5h3.3v-.8zm3-4.7h1v5.5h-1zm5.4 0l-.8 2.5c-.2.7-.4 1.3-.6 2c-.1-.7-.3-1.3-.5-2l-.8-2.5h-1l1.8 5.5H43l1.9-5.5zm2.7 4.7v-1.6h2.1v-.8h-2.1V33h2.2v-.9h-3.2v5.5h3.3v-.8zm6.7-.7c-.1-.5-.4-.9-.8-1.1c.5-.2 1-.7 1-1.4c0-.5-.2-.8-.5-1.1c-.4-.3-.9-.4-1.7-.4c-.6 0-1.1 0-1.5.1v5.4h1v-2.3h.5c.6 0 .8.2 1 1c.2.7.3 1.1.4 1.3h1c-.1-.2-.2-.8-.4-1.5m-1.9-1.5h-.6v-1.7h.6c.7 0 1.1.3 1.1.9c0 .5-.4.8-1.1.8m5.9-2.5l-.7 1.4c-.2.4-.3.7-.5 1.1c-.1-.4-.3-.7-.5-1.1l-.7-1.4h-1.1l1.7 3.2v2.3h1v-2.3l1.8-3.2z"></path>
        <path fill="#1a1a1a" d="M27.3 30.2v-5.6c0-.5.4-.9.9-.9h26.2c.5 0 .9.4.9.9v5.6h1.9v-5.6c0-1.5-1.3-2.8-2.8-2.8H28.2c-1.6 0-2.8 1.3-2.8 2.8v5.6zm28.1 9.4v3.7c0 .5-.4.9-.9.9H28.2c-.5 0-.9-.4-.9-.9v-3.7h-1.9v3.7c0 1.5 1.3 2.8 2.8 2.8h26.2c1.6 0 2.8-1.3 2.8-2.8v-3.7z"></path>
        <g fill="#b2c1c0">
          <circle cx={29.2} cy={25.5} r={0.9}></circle>
          <circle cx={53.6} cy={25.5} r={0.9}></circle>
          <circle cx={29.2} cy={42.4} r={0.9}></circle>
          <circle cx={53.6} cy={42.4} r={0.9}></circle>
        </g>
        <path fill="#606262" d="M37.6 55.5c0 1-.8 1.9-1.9 1.9h-7.5c-1 0-1.9-.8-1.9-1.9v-1.9c0-1 .8-1.9 1.9-1.9h7.5c1 0 1.9.8 1.9 1.9z"></path>
        <path fill="#b2c1c0" d="M28.5 52.7c-.6 0-1.2.4-1.2.9s.5.9 1.2.9h7c.6 0 1.2-.4 1.2-.9s-.5-.9-1.2-.9z"></path>
      </svg>
      <style jsx>{`
        .truck-wheel {
          animation: wheel-roll 1.5s linear infinite;
          transform-origin: center;
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
