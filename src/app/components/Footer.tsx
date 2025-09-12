'use client';

import React from 'react';
import Link from 'next/link';
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="customgrad relative text-gray-300 py-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-700 pb-10">
          <div>
            <h3 className="text-lg font-semibold text-white tracking-wide mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/Privacy" prefetch className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/FAQ" prefetch className="hover:text-white transition">FAQs</Link></li>
              <li><Link href="/Contact" prefetch className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/Terms" prefetch className="hover:text-white transition">Terms of Service</Link></li>
           
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white tracking-wide mb-4">Payments</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              We support GCash, PayPal, and secure bank transfers. All transactions are encrypted and protected.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 tracking-wide">
          © {currentYear} <span className="text-[#ffffff] font-semibold">Motogo</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
