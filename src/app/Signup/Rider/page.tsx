'use client';
import Image from 'next/image';
import SignupCard from "../../components/SignupCard";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="h-[75px] w-full flex items-center justify-center customgrad border-b-4 border-green-500 px-4">
        <Image
          src="/Motogo.svg"
          className="h-[90%] md:h-[90%] w-auto"
          alt="Logo"
          width={100}
          height={100}
          priority
        />
      </div>
      
      {/* Sidebar with tab content */}
      <SignupCard />
    </div>
  );
}
