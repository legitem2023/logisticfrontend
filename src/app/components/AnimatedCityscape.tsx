'use client'

import React from 'react';

/**

AnimatedCityScape — drop-in animated background for premium headers.

Usage:

<AnimatedCityScape className="h-[320px] rounded-2xl"><div className="relative z-20 px-6 py-8 text-white"><h1 className="text-3xl md:text-5xl font-bold tracking-tight">Premium</h1>

<p className="text-sm md:text-base opacity-80">Fast lanes through the city.</p>

</div></AnimatedCityScape>
/ export type AnimatedCityScapeProps = { className?: string; /* 0.5 (slow) — 3 (fast) / speed?: number; /* Visual theme / theme?: 'day' | 'dusk' | 'night'; /* Optional overlay gradient opacity (0–1) */ overlayOpacity?: number; children?: React.ReactNode; };

const THEME = { day: { skyFrom: '#7dd3fc', // sky-300 skyTo: '#60a5fa', // blue-400 far: '#93c5fd', // blue-300 mid: '#60a5fa', // blue-400 near: '#3b82f6', // blue-500 road: '#111827', // gray-900 lane: '#e5e7eb', // gray-200 }, dusk: { skyFrom: '#fca5a5', // red-300 skyTo: '#a78bfa', // violet-400 far: '#c4b5fd', mid: '#a78bfa', near: '#7c3aed', road: '#0b1020', lane: '#fef3c7', }, night: { skyFrom: '#111827', skyTo: '#1f2937', far: '#374151', mid: '#4b5563', near: '#6b7280', road: '#0b1020', lane: '#e5e7eb', }, } as const;

export default function AnimatedCityscape({ className, speed = 1, theme = 'day', overlayOpacity = 0.35, children, }: AnimatedCityScapeProps) { const t = THEME[theme]; const s = Math.max(0.3, Math.min(3, speed));

return ( <div className={[ 'relative w-full overflow-hidden isolate rounded-2xl', 'shadow-[0_10px_40px_rgba(0,0,0,0.25)]', className, ].join(' ')} style={{ // expose CSS vars for animation timing // Smaller = slower. We invert to make higher speed faster. // base duration (seconds): 20 / speed // used by all layers at different multipliers ['--baseDur' as any]: ${20 / s}s, }} > {/* Sky gradient */} <div className="absolute inset-0 -z-10" style={{ background: linear-gradient(180deg, ${t.skyFrom}, ${t.skyTo}), }} />

{/* Far skyline (slow parallax) */}
  <ParallaxStrip
    heightPct={55}
    offsetY={22}
    fill={t.far}
    scaleY={1}
    speedFactor={0.45}
    seed={1}
  />

  {/* Mid skyline */}
  <ParallaxStrip
    heightPct={70}
    offsetY={28}
    fill={t.mid}
    scaleY={1.05}
    speedFactor={0.75}
    seed={2}
  />

  {/* Near buildings */}
  <ParallaxStrip
    heightPct={85}
    offsetY={35}
    fill={t.near}
    scaleY={1.12}
    speedFactor={1.1}
    seed={3}
  />

  {/* Road with perspective and moving lane markers */}
  <Road roadColor={t.road} laneColor={t.lane} />

  {/* Soft vignette to make text readable */}
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      background:
        'radial-gradient(120% 70% at 50% 100%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 80%)',
      opacity: overlayOpacity,
    }}
  />

  {/* Content slot */}
  <div className="relative z-20 h-full w-full">{children}</div>

  <style jsx>{`
    @keyframes slideX {
      to { transform: translateX(-50%); }
    }
    @keyframes dashFlow {
      to { background-position-y: 200%; }
    }
  `}</style>
</div>

); }

/**

A horizontally looping silhouette strip made from SVG rectangles/windows.

Duplicated to create an infinite scroll effect. */ function ParallaxStrip({ heightPct, offsetY, fill, scaleY, speedFactor, seed, }: { heightPct: number; // height relative to container offsetY: number; // push down from the top (percentage) fill: string; scaleY?: number; speedFactor?: number; // 0.3 (slow) — 2 (fast) seed?: number; // to vary window pattern }) { const h = Math.max(20, Math.min(95, heightPct)); const y = Math.max(0, Math.min(80, offsetY)); const sp = Math.max(0.2, Math.min(2, speedFactor ?? 1)); const dur = calc(var(--baseDur) / ${sp});


return ( <div className="absolute left-0 right-0 -z-10" style={{ height: ${h}%, top: ${y}%, transform: scaleY(${scaleY ?? 1}), transformOrigin: 'bottom' }} > <div className="absolute bottom-0 left-0 h-[60%] w-[200%]" style={{ animation: slideX ${dur} linear infinite }} > <SilhouetteRow fill={fill} seed={seed} /> <SilhouetteRow fill={fill} seed={(seed ?? 0) + 10} className="translate-x-1/2" /> </div> </div> ); }

function SilhouetteRow({ fill, seed = 1, className = '' }: { fill: string; seed?: number; className?: string }) { // Generate a repeatable pseudo-random skyline using inline SVG. // We avoid heavy libs and images for performance and easy theming. const buildings = makeBuildings(seed);

return ( <svg className={["absolute bottom-0 left-0 h-full w-full", className].join(' ')} viewBox="0 0 2000 400" preserveAspectRatio="none" aria-hidden > <g fill={fill}> {buildings.map((b, i) => ( <rect key={i} x={b.x} y={400 - b.h} width={b.w} height={b.h} rx={b.r} ry={b.r} /> ))} </g> {/* Windows (subtle) */} <g fill="rgba(255,255,255,0.18)"> {buildings.flatMap((b, i) => { const win: JSX.Element[] = []; const cols = Math.max(1, Math.floor(b.w / 24)); const rows = Math.max(1, Math.floor(b.h / 26)); for (let c = 0; c < cols; c++) { for (let r = 0; r < rows; r++) { const wx = b.x + 8 + c * ((b.w - 16) / Math.max(1, cols - 1)); const wy = 400 - b.h + 10 + r * ((b.h - 20) / Math.max(1, rows - 1)); if ((c + r + i) % 3 === 0) win.push(<rect key={${i}-${c}-${r}} x={wx} y={wy} width={6} height={10} rx={1} ry={1} />); } } return win; })} </g> </svg> ); }

function makeBuildings(seed = 1) { const rng = mulberry32(seed); const buildings: { x: number; w: number; h: number; r: number }[] = []; let x = 0; while (x < 2000) { const w = 60 + Math.floor(rng() * 120); // 60–180 const h = 120 + Math.floor(rng() * 260); // 120–380 const r = rng() < 0.25 ? 4 : 0; buildings.push({ x, w, h, r }); x += w + 12 + Math.floor(rng() * 18); } return buildings; }

function mulberry32(a: number) { return function () { let t = (a += 0x6d2b79f5); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

function Road({ roadColor, laneColor }: { roadColor: string; laneColor: string }) { return ( <div className="absolute inset-x-0 bottom-0 -z-10 h-2/5"> {/* Road body with perspective via clip-path */} <div className="absolute inset-0" style={{ background: roadColor, clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)', boxShadow: '0 -30px 60px rgba(0,0,0,0.35) inset', }} />

{/* Lane markings moving towards viewer */}
  <div
    className="absolute inset-0 opacity-90"
    style={{
      backgroundImage:
        `repeating-linear-gradient(to bottom, transparent 0%, transparent 6%, ${laneColor} 6%, ${laneColor} 9%, transparent 9%, transparent 18%)`,
      clipPath: 'polygon(48% 0%, 52% 0%, 60% 100%, 40% 100%)',
      backgroundSize: '100% 200%',
      animation: 'dashFlow calc(var(--baseDur) / 1.6) linear infinite',
      filter: 'drop-shadow(0 2px 0 rgba(0,0,0,0.35))',
    }}
  />

  {/* Sidewalks for speed effect */}
  <div
    className="absolute inset-0"
    style={{
      backgroundImage:
        `linear-gradient(to right, transparent 34%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.1) 65%, transparent 66%)`,
      backgroundSize: '100% 100%',
      mixBlendMode: 'overlay',
      pointerEvents: 'none',
    }}
  />
</div>

); }

