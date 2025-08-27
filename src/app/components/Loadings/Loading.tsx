// components/Loading.tsx
"use client";

export default function Loading() {
  
  return (
    <div className="min-h-screen absolute t-0 l-0 m-[auto] flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-0 z-90 h-[100vh]">
       <div className="customgrad w-full h-[8vh]"></div>
       <div className="h-[84vh]"></div>
       <div className="customgrad w-full h-[8vh]"></div>
    </div>
  );
}
