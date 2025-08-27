// components/Loading.tsx
"use client";

export default function Loading() {
  
  return (
<div className="min-h-screen fixed top-0 bottom-0 left-0 m-auto flex flex-col items-center justify-center p-0 z-50 h-screen w-full">
  <div className="customgrad w-full h-20 p-4"></div>

  {/* Middle takes all remaining height */}
  <div className="flex-1 w-full bg-green-200"></div>

  <div className="customgrad w-full h-20 p-4"></div>
</div>
  );
}
