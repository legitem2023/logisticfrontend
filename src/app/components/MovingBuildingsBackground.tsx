"use client";

import { useEffect, useRef } from 'react';

interface Building {
  x: number;
  width: number;
  height: number;
  windows: { x: number; y: number }[];
  color: string;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
}

export default function MovingBuildingsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 250; // Header height
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // City generation
    const createBuildings = (): Building[] => {
      const buildings: Building[] = [];
      const buildingCount = 15 + Math.floor(Math.random() * 10);
      let currentX = 0;

      for (let i = 0; i < buildingCount; i++) {
        const width = 50 + Math.random() * 120;
        const height = 100 + Math.random() * 150;
        const windowRows = Math.floor(height / 30);
        const windowCols = Math.floor(width / 20);
        const windows = [];

        for (let row = 0; row < windowRows; row++) {
          for (let col = 0; col < windowCols; col++) {
            if (Math.random() > 0.7) { // 30% chance of window
              windows.push({
                x: col * 20 + 10,
                y: row * 30 + 15
              });
            }
          }
        }

        buildings.push({
          x: currentX,
          width,
          height,
          windows,
          color: `hsl(${200 + Math.random() * 40}, 70%, ${20 + Math.random() * 15}%)`
        });

        currentX += width + (Math.random() * 30);
      }

      return buildings;
    };

    const createStars = (): Star[] => {
      const stars: Star[] = [];
      for (let i = 0; i < 100; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.4),
          radius: Math.random() * 1.5,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.02
        });
      }
      return stars;
    };

    // Drawing functions
    const drawSky = (time: number) => {
      const dawnProgress = (Math.sin(time * 0.3) + 1) / 2; // 0-1 loop
      
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, `hsl(240, 70%, ${10 + dawnProgress * 10}%)`);
      gradient.addColorStop(1, `hsl(${300 + dawnProgress * 60}, 80%, ${20 + dawnProgress * 30}%)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawBuildings = (buildings: Building[]) => {
      buildings.forEach(building => {
        ctx.fillStyle = building.color;
        ctx.fillRect(building.x, canvas.height - building.height, building.width, building.height);
      });
    };

    const drawWindows = (buildings: Building[], time: number) => {
      buildings.forEach(building => {
        building.windows.forEach(window => {
          // Random flicker effect
          const isLightOn = Math.random() > 0.1 || Math.sin(time * 2 + window.x) > 0.7;
          
          if (isLightOn) {
            ctx.fillStyle = `hsla(60, 100%, 80%, ${0.7 + Math.sin(time * 5 + window.x) * 0.3})`;
            ctx.fillRect(
              building.x + window.x - 3,
              canvas.height - building.height + window.y - 3,
              6,
              6
            );
          }
        });
      });
    };

    const drawStars = (stars: Star[], time: number) => {
      ctx.fillStyle = 'white';
      stars.forEach(star => {
        const twinkle = Math.sin(time * star.speed) * 0.5 + 0.5;
        ctx.globalAlpha = star.opacity * twinkle;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const drawLightRays = (time: number) => {
      const dawnProgress = (Math.sin(time * 0.3) + 1) / 2;
      if (dawnProgress > 0.5) {
        const gradient = ctx.createLinearGradient(
          canvas.width * 0.7, 0,
          canvas.width * 0.7 + 200, 0
        );
        gradient.addColorStop(0, `hsla(40, 100%, 70%, ${(dawnProgress - 0.5) * 0.4})`);
        gradient.addColorStop(1, 'hsla(40, 100%, 70%, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(canvas.width * 0.7, 0, 200, canvas.height * 0.3);
      }
    };

    // Initialize elements
    const buildings = createBuildings();
    const stars = createStars();
    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = (timestamp - startTime) / 1000; // Convert to seconds

      drawSky(elapsedTime);
      drawStars(stars, elapsedTime);
      drawBuildings(buildings);
      drawWindows(buildings, elapsedTime);
      drawLightRays(elapsedTime);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-[250px] bg-black"
      aria-label="Animated cityscape header"
    />
  );
          }
