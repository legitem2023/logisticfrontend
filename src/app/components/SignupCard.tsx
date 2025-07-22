// components/DriverSignupForm.tsx
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Card, CardContent } from "./ui/Card";
import { Select } from "./ui/Select"; // ✅ Added Select import
import { useMutation, useQuery } from "@apollo/client";
import { VEHICLEQUERY } from "../../../graphql/query";
import { CREATERIDER } from "../../../graphql/mutation";
import { showToast } from "../../../utils/toastify";

const SignupCard = () => {
  const { loading, error, data } = useQuery(VEHICLEQUERY);
  const [createRider] = useMutation(CREATERIDER, {
    onCompleted: (data) => {
      showToast(data, "success");
      console.log("Driver created:", data);
    },
    onError: (err) => {
      console.log("Driver creation failed:", err.message);
    },
  });
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    vehicleType: "",
    plateNumber: "",
    photo: null as File | null,
    license: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);


    const input =  {
        email: form.email,
        licensePlate: form.plateNumber,
        name: form.fullName,
        password: form.password,
        phoneNumber: form.phone,
        vehicleTypeId: form.vehicleType,
      };
   console.log(input) 
     createRider({
       variables: {
          input: input
       },
     });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
            <Select
              id="vehicleType"
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
              required
            >
              <option value="">Select a vehicle type</option>
              {data.getVehicleTypes.map((vehicle: any, idx: number) => (
                <option key={idx} value={vehicle.id}>
                  {vehicle.name}
                </option>
              ))}
            </Select>
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
          <Button type="submit" className="w-full text-white shadow rounded-lg customgrad">
            Sign Up
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupCard;
