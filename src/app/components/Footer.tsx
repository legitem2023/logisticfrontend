'use client';

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="customgrad text-gray-300 py-14 mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-700 pb-10">
          <div>
            <h3 className="text-lg font-semibold text-white tracking-wide mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/policy" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="/faq" className="hover:text-white transition">FAQs</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white tracking-wide mb-4">Payments</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              We support GCash, PayPal, and secure bank transfers. All transactions are encrypted and protected.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white tracking-wide mb-4">Connect</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">123 Luxury Ave, Metro City</p>
              <p className="text-gray-400">+63 912 345 6789</p>
              <p className="text-gray-400">support@logisticpro.com</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white tracking-wide mb-4">Newsletter</h3>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-md bg-[#f1f1f1] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffffff]"
              />
              <button
                type="submit"
                className="bg-[#ffffff] text-black px-5 py-2 rounded-md font-semibold hover:customgrad transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 tracking-wide">
          © {currentYear} <span className="text-[#f5c75f] font-semibold">LogisticPro</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
