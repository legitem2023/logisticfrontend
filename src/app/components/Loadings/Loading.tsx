// components/Loading.tsx
"use client";

import Shimmer from '../ui/Shimmer';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col justify-center p-0 z-50 w-full">
      {/* Top bar shimmer with 88px height */}
      <div className="customgrad w-full h-[88px] p-4">
        <Shimmer className="h-full w-full rounded-lg" />
      </div>    
      
      <div className="relative flex-1 flex flex-col justify-center p-0 z-50 w-full">  
        <div className="w-full max-w-6xl mx-auto shadow-lg overflow-hidden">
          {/* Header Shimmer with 1px padding on parent */}
          <div className="bg-gradient-to-r relative p-[3px]">
            <div className="customgrad w-[100%] aspect-[3/1]">
              <div className="animate-pulse h-full w-full flex flex-col items-center justify-center">
                <div className="h-7 bg-green-700 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-green-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          {/* Main Content */}  
          <div className="p-6 bg-white">  
            {/* Status Cards Shimmer */}  
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">  
              {Array(4).fill(0).map((_, index) => (
                <div key={index} className="rounded-2xl p-5 shadow-sm animate-pulse">  
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="ml-auto mt-4 w-10 h-10 bg-gray-300 rounded-full"></div>
                </div>
              ))}  
            </div>  

            {/* Month Tabs Shimmer */}  
            <div className="mb-6">  
              <div className="flex justify-between items-center mb-3">  
                <div className="h-5 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/5 animate-pulse"></div>
              </div>  
              <div className="overflow-x-auto border-b border-gray-200">  
                <div className="flex space-x-2 whitespace-nowrap px-1 pb-1">  
                  {Array(5).fill(0).map((_, index) => (
                    <div key={index} className="py-2 px-4 h-10 bg-gray-200 rounded-md w-24 animate-pulse"></div>
                  ))}  
                </div>  
              </div>  
            </div>  

            {/* Chart Area Shimmer */}  
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">  
              <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                <div className="text-gray-400">Loading delivery data...</div>
              </div>  
            </div>  
          </div>  
        </div>
      </div>

      {/* Bottom bar shimmer with 88px height */}
      <div className="customgrad w-full h-[88px] p-4">
        <Shimmer className="h-full w-full rounded-lg" />
      </div>
    </div>
  );  
}
