'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import { Label } from './ui/Label'
import { Input } from './ui/Input'
import { Switch } from './ui/Switch'
import { Button } from './ui/Button'
import Separator from './ui/Separator'

export default function SettingsPage() {
  const [name, setName] = useState('Juan Dela Cruz')
  const [email, setEmail] = useState('juan@example.com')
  const [vehicleType, setVehicleType] = useState('motorcycle')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const handleSave = () => {
    console.log({ name, email, vehicleType, notificationsEnabled })
    alert('Settings saved successfully!')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
  {/* Account Info */}
  <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-md rounded-2xl">
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-gray-800">🧑 Account Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-5">
      <div>
        <Label htmlFor="name" className="text-gray-700">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="email" className="text-gray-700">Email</Label>
        <Input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1"
        />
      </div>
    </CardContent>
  </Card>

  {/* Vehicle Type */}
  <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-md rounded-2xl">
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-gray-800">🚚 Vehicle Preference</CardTitle>
    </CardHeader>
    <CardContent>
      <select
        value={vehicleType}
        onChange={(e) => setVehicleType(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:ring-2 focus:ring-blue-500"
      >
        <option value="motorcycle">🏍️ Motorcycle</option>
        <option value="car">🚗 Car</option>
        <option value="van">🚐 Van</option>
      </select>
    </CardContent>
  </Card>

  {/* Notifications */}
  <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-md rounded-2xl">
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-gray-800">🔔 Notifications</CardTitle>
    </CardHeader>
    <CardContent className="flex items-center justify-between">
      <Label className="text-gray-700">Enable push notifications</Label>
      <Switch
        checked={notificationsEnabled}
        onCheckedChange={setNotificationsEnabled}
      />
    </CardContent>
  </Card>

  {/* Actions */}
  <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-md rounded-2xl">
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-gray-800">⚙️ Actions</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
        onClick={handleSave}
      >
        Save Changes
      </Button>
      <Separator />
      <Button className="w-full bg-red-500 hover:bg-red-600 transition text-white font-semibold">
        Logout
      </Button>
    </CardContent>
  </Card>
</div>

  )
}
