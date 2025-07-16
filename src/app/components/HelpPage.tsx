'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import Separator from './ui/Separator'

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6 bg-gradient-to-b from-white via-slate-50 to-gray-100 rounded-xl">
      {/* Intro */}
      <Card className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl transition">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            📦 Logistics Help Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-base text-gray-700 leading-relaxed">
          <p>
            Welcome to the Logistics App! This system helps you manage and track deliveries in real time. Whether youre a sender, receiver, or rider, heres how everything works.
          </p>
        </CardContent>
      </Card>

      {/* Roles */}
      <Card className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl transition">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">🧭 Roles Explained</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 text-sm leading-relaxed">
          <ul className="list-disc list-inside">
            <li><strong>Sender (Nagpadala):</strong> The person who creates and pays for the delivery.</li>
            <li><strong>Receiver (Dadalhan):</strong> The person who will receive the package.</li>
            <li><strong>Rider (Magdadala):</strong> The delivery partner who picks up and drops off items.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Delivery Flow */}
      <Card className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl transition">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">🚚 Delivery Flow</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 text-sm leading-relaxed space-y-3">
          <ol className="list-decimal list-inside space-y-1">
            <li>Sender books a delivery and provides pickup/drop-off details.</li>
            <li>System matches the best rider based on location and capacity.</li>
            <li>Rider accepts and picks up the package.</li>
            <li>Real-time tracking begins — visible to both sender and receiver.</li>
            <li>Rider delivers to the drop-off point; receiver confirms receipt.</li>
          </ol>
        </CardContent>
      </Card>

      {/* Tracking */}
      <Card className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl transition">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">📍 Real-Time Tracking</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 text-sm leading-relaxed">
          <p>
            Our system updates the rider’s GPS location live on the map. You can track your delivery progress under your dashboard or delivery detail page.
          </p>
        </CardContent>
      </Card>

      {/* Vehicle Types */}
      <Card className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl transition">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">🚗 Vehicle Types</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 text-sm leading-relaxed">
          <p>We support multiple vehicle types for delivery:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>🏍️ <strong>Motorcycle</strong> — fast, best for small items</li>
            <li>🚗 <strong>Car</strong> — ideal for medium parcels</li>
            <li>🚐 <strong>Van</strong> — for bulk or large item deliveries</li>
          </ul>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl transition">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">❓ Need More Help?</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 text-sm leading-relaxed">
          <p>
            Contact support via chat or email at{' '}
            <a
              className="text-blue-600 underline hover:text-blue-800 transition"
              href="mailto:support@yourapp.com"
            >
              support@yourapp.com
            </a>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
