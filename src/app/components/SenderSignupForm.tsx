// components/SenderSignupForm.tsx
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { useMutation } from "@apollo/client";
import AnimatedCityscape from './AnimatedCityscape';

import { CREATESENDER } from "../../../graphql/mutation";
import { showToast } from "../../../utils/toastify";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiMapPin,
  FiHome,
  FiBriefcase,
} from "react-icons/fi";

const SenderSignupForm = () => {
  const [createSender] = useMutation(CREATESENDER, {
    onCompleted: (data) => {
      showToast("Your account has been created successfully!", "success");
      setloading(false);
      console.log("Sender created:", data);
    },
    onError: (err) => {
      console.log("Signup failed Please Try Again:", err.message);
    },
  });

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    pickupAddress: ""
  });
 const [loading,setloading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setloading(true);
    createSender({
      variables: {
        input: {
          name: form.fullName,
          email: form.email,
          phoneNumber: form.phone,
          password: form.password,
          address: form.pickupAddress
        },
      },
    });
  };

  return (
    <div className="flex items-center p-1">
      <div className="max-w-2xl w-full mx-auto transform transition-all duration-300">
        <Card className="shadow-xl border border-green-100 overflow-hidden relative group bg-white">
        
          
          <CardHeader className="bg-gradient-to-r from-green-800 to-green-600 p-0 relative overflow-hidden">
           <AnimatedCityscape>
            <h2 className="text-2xl font-bold text-white text-center relative z-10">
              Sender Registration
            </h2>
            <p className="text-green-100 text-center mt-2 relative z-10">
              Start shipping with ease
            </p>
             </AnimatedCityscape>
          </CardHeader>

          <CardContent className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" />
                      <Input
                        id="fullName"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700">Email</Label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone"  className="text-gray-700">Phone Number</Label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="password" className="text-gray-700">Password</Label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pickupAddress"  className="text-gray-700">Pickup Address</Label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" />
                      <Input
                        id="pickupAddress"
                        name="pickupAddress"
                        value={form.pickupAddress}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl relative overflow-hidden group"
                disabled={loading}
              >
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
            ) : 'Create Account'}
              </Button>

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

export default SenderSignupForm;
