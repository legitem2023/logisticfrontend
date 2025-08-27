// components/Loading.tsx
"use client";

export default function Loading() {
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-0">
       <div className="customgrad w-full h-[8vh]"></div>
       <div className="h-[84vh]"></div>
       <div className="customgrad w-full h-[8vh]"></div>
    </div>
  );
}
