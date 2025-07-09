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
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🧑 Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🚚 Vehicle Preference</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="motorcycle">🏍️ Motorcycle</option>
            <option value="car">🚗 Car</option>
            <option value="van">🚐 Van</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🔔 Notifications</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label>Enable push notifications</Label>
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">⚙️ Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full" onClick={handleSave}>
            Save Changes
          </Button>
          <Separator />
          <Button className="w-full">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
