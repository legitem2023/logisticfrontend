// components/DriverSignupForm.tsx
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Select } from "./ui/Select";
import { useMutation, useQuery } from "@apollo/client";
import { VEHICLEQUERY } from "../../../graphql/query";
import AnimatedCityscape from './AnimatedCityscape';
import { CREATERIDER } from "../../../graphql/mutation";
import { showToast } from "../../../utils/toastify";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiTruck,
  FiCreditCard,
  FiCamera,
  FiFileText,
} from "react-icons/fi";

// Helper function to convert file to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // includes mime type in result
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const SignupCard = () => {
  const { loading:vehicloading, error, data } = useQuery(VEHICLEQUERY);
  const [createRider] = useMutation(CREATERIDER, {
    onCompleted: (data) => {
      showToast("Your account has been created successfully!", "success");
      setloading(false);
      console.log("Driver created:", data);
    },
    onError: (err) => {
      console.log("Signup failed Please Try again:", err.message);
    },
  });

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    vehicleType: "",
    plateNumber: "",
    photo: "",
    license: "",
  });
 const [loading,setloading] = useState(false);
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files && files[0]) {
      // Convert file to Base64 immediately
      const base64 = await fileToBase64(files[0]);
      setForm((prev) => ({ ...prev, [name]: base64 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setloading(true);
    const input = {
      email: form.email,
      licensePlate: form.plateNumber,
      name: form.fullName,
      password: form.password,
      phoneNumber: form.phone,
      vehicleTypeId: form.vehicleType,
      photo: form.photo, // already Base64
      license: form.license, // already Base64
    };
    createRider({ variables: { input } });
  };

  if (vehicloading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-gradient-to-r from-green-600 to-green-400 rounded-full mb-4"></div>
          <p className="text-green-700 font-medium">
            Loading driver registration...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-xl mx-auto p-6 bg-red-100 border-l-4 border-red-500 text-red-700">
        <p>Error: {error.message}</p>
      </div>
    );

  return (
    <div className="flex items-center justify-center p-1">
      <div className="max-w-2xl w-full mx-auto transform transition-all duration-300">
        <Card className="shadow-xl border border-green-100 overflow-hidden relative group bg-white">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-green-800 to-green-600 p-0 relative overflow-hidden">
            <AnimatedCityscape>
            <h2 className="text-2xl font-bold text-white text-center relative z-10">
              Professional Driver Registration
            </h2>
            <p className="text-green-100 text-center mt-2 relative z-10">
              Join our network of trusted drivers
            </p>
              </AnimatedCityscape>
          </CardHeader>

          <CardContent className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-800 border-b border-green-100 pb-2 flex items-center">
                    <FiUser className="mr-2 text-green-600" /> Personal
                    Information
                  </h3>

                  <div className="relative">
                    <Label htmlFor="fullName" className="text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      className="pl-2 border-gray-300 focus:border-green-500 focus:ring-green-400"
                    />
                  </div>

                  <div className="relative">
                    <Label htmlFor="email" className="text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="pl-2 border-gray-300 focus:border-green-500 focus:ring-green-400"
                    />
                  </div>

                  <div className="relative">
                    <Label htmlFor="phone" className="text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="pl-2 border-gray-300 focus:border-green-500 focus:ring-green-400"
                    />
                  </div>

                  <div className="relative">
                    <Label htmlFor="password" className="text-gray-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="pl-2 border-gray-300 focus:border-green-500 focus:ring-green-400"
                    />
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-800 border-b border-green-100 pb-2 flex items-center">
                    <FiTruck className="mr-2 text-green-600" /> Vehicle
                    Information
                  </h3>

                  <div className="relative">
                    <Label htmlFor="vehicleType" className="text-gray-700">
                      Vehicle Type
                    </Label>
                    <Select
                      id="vehicleType"
                      name="vehicleType"
                      value={form.vehicleType}
                      onChange={handleChange}
                      required
                      className="pl-2 border-gray-300 focus:border-green-500 focus:ring-green-400"
                    >
                      <option value="">Select a vehicle type</option>
                      {data.getVehicleTypes.map((vehicle: any) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.name}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="relative">
                    <Label htmlFor="plateNumber" className="text-gray-700">
                      Plate Number
                    </Label>
                    <Input
                      id="plateNumber"
                      name="plateNumber"
                      value={form.plateNumber}
                      onChange={handleChange}
                      required
                      className="pl-2 border-gray-300 focus:border-green-500 focus:ring-green-400"
                    />
                  </div>

                  <div className="relative">
                    <Label htmlFor="photo" className="text-gray-700">
                      Profile Photo
                    </Label>
                    <Input
                      id="photo"
                      name="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="relative">
                    <Label htmlFor="license" className="text-gray-700">
                      Drivers License
                    </Label>
                    <Input
                      id="license"
                      name="license"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  className="w-full py-3 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl relative overflow-hidden group"
                  disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                    5.291A7.962 7.962 0 014 12H0c0 
                    3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Loading...
              </span>
            ) : 'Complete Registration'}
          </Button>
              </div>

              <p className="text-center text-gray-500 text-sm">
                By registering, you agree to our{" "}
                <a href="/Terms" className="text-green-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/Privacy" className="text-green-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupCard;
