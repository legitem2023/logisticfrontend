'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import { Label } from './ui/Label'
import { Input } from './ui/Input'
import { Switch } from './ui/Switch'
import { Button } from './ui/Button'
import Separator from './ui/Separator'
import SubscriptionsToggle from './commands/SubscriptionsToggle'
import { decryptToken } from '../../../utils/decryptToken'
import Cookies from 'js-cookie';

export default function SettingsPage() {
  const [name, setName] = useState('Juan Dela Cruz')
  const [email, setEmail] = useState('juan@example.com')
  const [vehicleType, setVehicleType] = useState('motorcycle')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [useID, setID] = useState('');

 useEffect(() => {
    const getRole = async () => {
      try {
        const token = Cookies.get('token');
        const secret = process.env.NEXT_PUBLIC_JWT_SECRET as string;
        if (token && secret) {
          const payload = await decryptToken(token, secret);
          setID(payload.userId);
        }
      } catch (err) {
        console.error('Error getting role:', err);
        
      }
    };
    getRole();
  });



  const handleSave = () => {
    console.log({ name, email, vehicleType, notificationsEnabled })
    alert('Settings saved successfully!')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 bg-gradient-to-br from-white via-slate-100 to-gray-50 rounded-xl shadow-inner">
      {/* Account Info */}
      <Card className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl transition hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">🧑 Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label htmlFor="name" className="text-gray-600">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-600">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Type */}
      <Card className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl transition hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">🚚 Vehicle Preference</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="motorcycle">🏍️ Motorcycle</option>
            <option value="car">🚗 Car</option>
            <option value="van">🚐 Van</option>
          </select>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl transition hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">🔔 Notifications</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label className="text-gray-700">Enable push notifications</Label>
          {/* <Switch
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          /> */}
          <SubscriptionsToggle userId={useID}/>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl transition hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">⚙️ Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition text-white font-semibold rounded-xl shadow-md"
            onClick={handleSave}
          >
            💾 Save Changes
          </Button>
          <Separator />
          <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-md transition">
            🚪 Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
