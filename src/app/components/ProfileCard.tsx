'use client';
import Image from 'next/image';

import { Mail, Phone, MapPin, User } from 'lucide-react';

type ProfileCardProps = {
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  avatarUrl?: string;
};

export default function ProfileCard({
  name,
  email,
  contactNumber,
  address,
  avatarUrl,
}: ProfileCardProps) {
  return (
    <div className="max-w-md w-full p-6 rounded-2xl bg-white/20 backdrop-blur-md shadow-md border border-white/30 text-gray-900 dark:text-white">
      <div className="flex items-center gap-4 mb-6">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Profile"
            width={200}
            height={200}
            priority
            className="w-16 h-16 rounded-full object-cover border border-white/40 shadow"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-gray-700">
            <User size={28} />
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">User Profile</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <Mail size={16} className="mt-0.5" />
          <span>{email}</span>
        </div>
        <div className="flex items-start gap-2">
          <Phone size={16} className="mt-0.5" />
          <span>{contactNumber}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={16} className="mt-0.5" />
          <span>{address}</span>
        </div>
      </div>
    </div>
  );
}
