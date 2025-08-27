// components/Loading.tsx
"use client";

import Shimmer from '../ui/Shimmer';

export default function Loading() {
  return (
    <div className="min-h-screen fixed top-0 bottom-0 left-0 m-auto flex flex-col items-center justify-center p-0 z-50 h-screen w-full">
      {/* Top bar shimmer */}
      <div className="customgrad w-full h-[88px] p-4">
        <Shimmer className="h-full w-full rounded-lg" />
      </div>

      {/* Middle shimmer content */}
      <div className="flex-1 w-full flex flex-col items-center justify-center space-y-4 p-6">
        <Shimmer className="h-10 w-3/4 rounded-lg" />
        <Shimmer className="h-10 w-2/3 rounded-lg" />
        <Shimmer className="h-64 w-11/12 rounded-xl" />
      </div>

      {/* Bottom bar shimmer */}
      <div className="customgrad w-full h-[88px] p-4">
        <Shimmer className="h-full w-full rounded-lg" />
      </div>
    </div>
  );
}
