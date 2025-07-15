'use client';
import { useEffect, useRef } from 'react';

interface ShimmerProps {
  width?: string;
  height?: string;
  rounded?: boolean;
  className?: string;
}

const Shimmer = ({
  width = '100%',
  height = '100%',
  rounded = false,
  className = '',
}: ShimmerProps) => {
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shimmerRef.current) return;

    // Create gradient animation
    const keyframes = `
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;

    // Check if animation already exists
    if (!document.getElementById('shimmer-animation')) {
      const style = document.createElement('style');
      style.id = 'shimmer-animation';
      style.textContent = keyframes;
      document.head.appendChild(style);
    }

    return () => {
      // Clean up when last shimmer unmounts
      if (document.querySelectorAll('[data-shimmer]').length === 1) {
        const style = document.getElementById('shimmer-animation');
        if (style) document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div 
      ref={shimmerRef}
      data-shimmer="true"
      className={`overflow-hidden relative ${rounded ? 'rounded-md' : ''} ${className}`}
      style={{ width, height }}
    >
      <div className="absolute inset-0 bg-gray-200" />
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, 
            rgba(255,255,255,0) 0%, 
            rgba(255,255,255,0.6) 50%, 
            rgba(255,255,255,0) 100%)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite linear'
        }}
      />
    </div>
  );
};

export default Shimmer;
