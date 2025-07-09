'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import Separator  from './ui/Separator'

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">📦 Logistics Help Center</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>
            Welcome to the Logistics App! This system helps you manage and track deliveries in real time. Whether youre a sender, receiver, or rider, heres how everything works.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🧭 Roles Explained</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc list-inside">
            <li><strong>Sender (Nagpadala):</strong> The person who creates and pays for the delivery.</li>
            <li><strong>Receiver (Dadalhan):</strong> The person who will receive the package.</li>
            <li><strong>Rider (Magdadala):</strong> The delivery partner who picks up and drops off items.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🚚 Delivery Flow</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <ol className="list-decimal list-inside">
            <li>Sender books a delivery and provides pickup/drop-off details.</li>
            <li>System matches the best rider based on location and capacity.</li>
            <li>Rider accepts and picks up the package.</li>
            <li>Real-time tracking begins — visible to both sender and receiver.</li>
            <li>Rider delivers to the drop-off point; receiver confirms receipt.</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📍 Real-Time Tracking</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            Our system updates the riders GPS location live on the map. You can track your delivery progress under your dashboard or delivery detail page.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📦 Vehicle Types</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            We support multiple vehicle types for delivery:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>🏍️ Motorcycle — fast, best for small items</li>
            <li>🚗 Car — ideal for medium parcels</li>
            <li>🚐 Van — for bulk or large item deliveries</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>❓ Need More Help?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            Contact support via chat or email at <a className="text-blue-600 underline" href="mailto:support@yourapp.com">support@yourapp.com</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
