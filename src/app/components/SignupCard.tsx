// components/DriverSignupForm.tsx
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Card, CardContent } from "./ui/Card";

const SignupCard = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    vehicleType: "",
    plateNumber: "",
    photo: null,
    license: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send form data to API
    console.log(form);
  };

  return (
    <Card className="max-w-xl mx-auto shadow-xl p-6">
      <CardContent>
        <h2 className="text-2xl font-bold mb-6 text-center">Driver Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Input id="vehicleType" name="vehicleType" value={form.vehicleType} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="plateNumber">Plate Number</Label>
            <Input id="plateNumber" name="plateNumber" value={form.plateNumber} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="photo">Profile Photo</Label>
            <Input id="photo" name="photo" type="file" accept="image/*" onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="license">Driver’s License (Upload)</Label>
            <Input id="license" name="license" type="file" accept="image/*,application/pdf" onChange={handleChange} />
          </div>
          <Button type="submit" className="w-full text-[#ffffff] shadow rounded-lg customgrad">
            Sign Up
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupCard;
