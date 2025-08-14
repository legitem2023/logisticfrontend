// components/DriverSignupForm.tsx
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Select } from "./ui/Select";
import { useMutation, useQuery } from "@apollo/client";
import { VEHICLEQUERY } from "../../../graphql/query";
import { CREATERIDER } from "../../../graphql/mutation";
import { showToast } from "../../../utils/toastify";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiLock, FiCar, FiCreditCard, FiCamera, FiFileText } from "react-icons/fi";

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
    const input = {
      email: form.email,
      licensePlate: form.plateNumber,
      name: form.fullName,
      password: form.password,
      phoneNumber: form.phone,
      vehicleTypeId: form.vehicleType,
    };
    
    createRider({
      variables: {
        input: input
      },
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-16 w-16 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full mb-4"></div>
        <p className="text-amber-600 font-medium">Loading luxury experience...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-xl mx-auto p-6 bg-rose-100 border-l-4 border-rose-500 text-rose-700">
      <p>Error: {error.message}</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
    >
      <Card className="max-w-2xl w-full mx-auto shadow-2xl border border-gray-200 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-600 to-amber-400 p-6">
          <h2 className="text-3xl font-bold text-white text-center">Premium Driver Registration</h2>
          <p className="text-amber-100 text-center mt-2">Join our exclusive network of professional drivers</p>
        </CardHeader>
        
        <CardContent className="p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-amber-700 border-b border-amber-100 pb-2">Personal Information</h3>
                
                <div className="relative">
                  <Label htmlFor="fullName" className="text-gray-600">Full Name</Label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiUser className="text-amber-500" />
                  </div>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    value={form.fullName} 
                    onChange={handleChange} 
                    required 
                    className="pl-10 border-gray-300 focus:border-amber-400 focus:ring-amber-300"
                  />
                </div>
                
                <div className="relative">
                  <Label htmlFor="email" className="text-gray-600">Email</Label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiMail className="text-amber-500" />
                  </div>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    required 
                    className="pl-10 border-gray-300 focus:border-amber-400 focus:ring-amber-300"
                  />
                </div>
                
                <div className="relative">
                  <Label htmlFor="phone" className="text-gray-600">Phone Number</Label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiPhone className="text-amber-500" />
                  </div>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    value={form.phone} 
                    onChange={handleChange} 
                    required 
                    className="pl-10 border-gray-300 focus:border-amber-400 focus:ring-amber-300"
                  />
                </div>
                
                <div className="relative">
                  <Label htmlFor="password" className="text-gray-600">Password</Label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiLock className="text-amber-500" />
                  </div>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    required 
                    className="pl-10 border-gray-300 focus:border-amber-400 focus:ring-amber-300"
                  />
                </div>
              </motion.div>
              
              {/* Vehicle Information */}
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-amber-700 border-b border-amber-100 pb-2">Vehicle Information</h3>
                
                <div className="relative">
                  <Label htmlFor="vehicleType" className="text-gray-600">Vehicle Type</Label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiCar className="text-amber-500" />
                  </div>
                  <Select
                    id="vehicleType"
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={handleChange}
                    required
                    className="pl-10 border-gray-300 focus:border-amber-400 focus:ring-amber-300 appearance-none"
                  >
                    <option value="">Select a vehicle type</option>
                    {data.getVehicleTypes.map((vehicle: any, idx: number) => (
                      <option key={idx} value={vehicle.id}>
                        {vehicle.name}
                      </option>
                    ))}
                  </Select>
                </div>
                
                <div className="relative">
                  <Label htmlFor="plateNumber" className="text-gray-600">Plate Number</Label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiCreditCard className="text-amber-500" />
                  </div>
                  <Input 
                    id="plateNumber" 
                    name="plateNumber" 
                    value={form.plateNumber} 
                    onChange={handleChange} 
                    required 
                    className="pl-10 border-gray-300 focus:border-amber-400 focus:ring-amber-300"
                  />
                </div>
                
                <div className="relative">
                  <Label htmlFor="photo" className="text-gray-600">Profile Photo</Label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiCamera className="text-amber-500" />
                  </div>
                  <Input 
                    id="photo" 
                    name="photo" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleChange} 
                    className="pl-10 py-2 border-gray-300 focus:border-amber-400 focus:ring-amber-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                </div>
                
                <div className="relative">
                  <Label htmlFor="license" className="text-gray-600">Drivers License</Label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiFileText className="text-amber-500" />
                  </div>
                  <Input 
                    id="license" 
                    name="license" 
                    type="file" 
                    accept="image/*,application/pdf" 
                    onChange={handleChange} 
                    className="pl-10 py-2 border-gray-300 focus:border-amber-400 focus:ring-amber-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                </div>
              </motion.div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="pt-4"
            >
              <Button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:shadow-xl"
              >
                Join Premium Network
              </Button>
            </motion.div>
            
            <p className="text-center text-gray-500 text-sm">
              By registering, you agree to our <a href="#" className="text-amber-600 hover:underline">Terms of Service</a> and <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SignupCard;
