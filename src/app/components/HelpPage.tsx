'use client'
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import Separator from './ui/Separator'

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 bg-gradient-to-b from-slate-50 via-white to-slate-100 rounded-3xl shadow-inner">
      
      {/* Intro */}
      <Card className="bg-white/60 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl transition">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            📦 Logistics Help Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-gray-700 leading-relaxed">
          <p>
            Welcome to the Logistics App! This system helps you manage and track deliveries in real time. 
            Whether youre a sender, receiver, or rider, heres how everything works.
          </p>
        </CardContent>
      </Card>

      {/* Roles */}
      <Card className="bg-white/60 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl transition">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900">🧭 Roles Explained</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 text-base leading-relaxed">
          <ul className="list-disc list-inside">
            <li><strong>Sender (Nagpadala):</strong> Creates and pays for the delivery.</li>
            <li><strong>Receiver (Dadalhan):</strong> Receives the package.</li>
            <li><strong>Rider (Magdadala):</strong> Picks up and delivers items.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Delivery Flow */}
      <Card className="bg-white/60 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl transition">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900">🚚 Delivery Flow</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 text-base leading-relaxed space-y-3">
          <ol className="list-decimal list-inside space-y-1">
            <li>Sender books a delivery with pickup/drop-off details.</li>
            <li>System assigns the best rider based on location and capacity.</li>
            <li>Rider accepts and picks up the package.</li>
            <li>Real-time tracking begins — visible to both sender and receiver.</li>
            <li>Rider delivers; receiver confirms receipt.</li>
          </ol>
        </CardContent>
      </Card>

      {/* Tracking */}
      <Card className="bg-white/60 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl transition">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900">📍 Real-Time Tracking</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 text-base leading-relaxed">
          <p>
            Our system updates the riders GPS location live on the map. 
            You can track your delivery progress in your dashboard or delivery details page.
          </p>
        </CardContent>
      </Card>

      {/* Vehicle Types */}
      <Card className="bg-white/60 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl transition">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900">🚗 Vehicle Types</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 text-base leading-relaxed">
          <p>We support multiple vehicle types:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>🏍️ <strong>Motorcycle</strong> — fast, best for small items</li>
            <li>🚗 <strong>Car</strong> — ideal for medium parcels</li>
            <li>🚐 <strong>Van</strong> — for bulk or large deliveries</li>
          </ul>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="bg-white/60 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl transition">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900">❓ Need More Help?</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 text-base leading-relaxed">
          <p>
            Contact support via chat or email at{' '}
            <a
              className="text-blue-600 underline hover:text-blue-800 transition"
              href="mailto:support@yourapp.com"
            >
              Motogo.inc@gmail.com
            </a>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
