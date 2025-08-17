"use client";

import { useEffect, useRef } from 'react';

interface Building {
  x: number;
  width: number;
  height: number;
  speed: number; // Movement speed (farther buildings move slower)
  windows: { x: number; y: number }[];
  color: string;
}

export default function MovingBuildingsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 300; // Adjust height as needed
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create buildings with different layers for parallax effect
    const createBuildings = (): Building[] => {
      const buildings: Building[] = [];
      const layers = 3; // Number of depth layers
      const buildingsPerLayer = 8;

      for (let layer = 0; layer < layers; layer++) {
        const layerScale = 0.5 + (layer * 0.2); // Farther buildings are smaller
        const layerSpeed = 0.2 + (layer * 0.1); // Farther buildings move slower
        
        for (let i = 0; i < buildingsPerLayer; i++) {
          const width = (80 + Math.random() * 120) * layerScale;
          const height = (150 + Math.random() * 200) * layerScale;
          const x = (canvas.width / buildingsPerLayer) * i + Math.random() * 100;

          // Create windows
          const windowRows = Math.floor(height / 25);
          const windowCols = Math.floor(width / 15);
          const windows = [];

          for (let row = 0; row < windowRows; row++) {
            for (let col = 0; col < windowCols; col++) {
              if (Math.random() > 0.7) { // 30% chance of window
                windows.push({
                  x: col * 15 + 8,
                  y: row * 25 + 10
                });
              }
            }
          }

          buildings.push({
            x,
            width,
            height,
            speed: layerSpeed,
            windows,
            color: `hsl(210, 60%, ${20 + layer * 10}%)` // Darker for farther buildings
          });
        }
      }

      return buildings;
    };

    let buildings = createBuildings();
    let animationId: number;
    let lastTime = 0;

    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient sky
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, '#00111c');
      skyGradient.addColorStop(1, '#00334d');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update buildings
      buildings.forEach(building => {
        // Move building
        building.x -= building.speed * (deltaTime / 16);
        
        // If building moved off screen, recycle it to the right
        if (building.x + building.width < 0) {
          building.x = canvas.width + Math.random() * 200;
        }

        // Draw building
        ctx.fillStyle = building.color;
        ctx.fillRect(building.x, canvas.height - building.height, building.width, building.height);

        // Draw windows
        building.windows.forEach(window => {
          const isLightOn = Math.random() > 0.2; // 80% chance of light being on
          if (isLightOn) {
            ctx.fillStyle = `hsla(45, 100%, 70%, ${0.6 + Math.random() * 0.4})`;
            ctx.fillRect(
              building.x + window.x - 4,
              canvas.height - building.height + window.y - 4,
              8,
              8
            );
          }
        });
      });

      // Draw distant fog effect
      const fogGradient = ctx.createLinearGradient(0, canvas.height * 0.7, 0, canvas.height);
      fogGradient.addColorStop(0, 'rgba(0, 20, 40, 0)');
      fogGradient.addColorStop(1, 'rgba(0, 20, 40, 0.7)');
      ctx.fillStyle = fogGradient;
      ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-[300px] pointer-events-none"
      aria-label="Moving cityscape background"
    />
  );
          }
