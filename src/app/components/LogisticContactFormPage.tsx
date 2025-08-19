// components/DeluxeContactForm.jsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Select } from "./ui/Select";
import { FiUser, FiMail, FiPhone, FiHome, FiMessageSquare, FiChevronDown, FiSend } from "react-icons/fi";
import AnimatedCityscape from './AnimatedCityscape';

const LogisticContactFormPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          message: "",
        });
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-green-50 to-green-100 p-1">
      <Card className="max-w-2xl w-full shadow-xl border border-green-100 overflow-hidden relative bg-white">
        

        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-green-800 to-green-600 p-0 relative overflow-hidden">
          {/* Pattern */}
          <AnimatedCityscape>
            <CardTitle className="text-2xl font-bold text-white text-center relative z-10">Contact Our Logistics Team</CardTitle>
            <p className="text-green-100 text-center mt-2 relative z-10">We’re here to help you move forward</p>
          </AnimatedCityscape>
          </CardHeader>

        <CardContent className="p-8">
          {submitSuccess ? (
            <div className="bg-green-50 border border-green-400 rounded-xl p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
              <p className="text-green-700">Thank you for contacting us. Our logistics team will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Grid Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiUser className="text-green-600" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-400 transition-all duration-200"
                    placeholder="Full Name"
                  />
                </div>

                <div className="relative">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiMail className="text-green-600" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-400 transition-all duration-200"
                    placeholder="Email Address"
                  />
                </div>

                <div className="relative">
                  <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiPhone className="text-green-600" />
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-400 transition-all duration-200"
                    placeholder="Phone Number"
                  />
                </div>

                <div className="relative">
                  <Label htmlFor="company" className="text-gray-700">Company Name</Label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiHome className="text-green-600" />
                  </div>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-400 transition-all duration-200"
                    placeholder="Company Name"
                  />
                </div>
              </div>

              {/* Select */}
              <div className="relative">
                <Label htmlFor="service" className="text-gray-700">Service Type</Label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                  <FiChevronDown className="text-green-600" />
                </div>
                <Select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-400 transition-all duration-200"
                >
                  <option value="">Select Service Type</option>
                  <option value="air">Air Freight</option>
                  <option value="sea">Sea Freight</option>
                  <option value="ground">Ground Transport</option>
                  <option value="warehousing">Warehousing</option>
                  <option value="customs">Customs Clearance</option>
                  <option value="other">Other Services</option>
                </Select>
              </div>

              {/* Textarea */}
              <div className="relative">
                <Label htmlFor="message" className="text-gray-700">Message</Label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                  <FiMessageSquare className="text-green-600" />
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="pl-10 w-full border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-400 transition-all duration-200"
                  placeholder="Your Message"
                ></textarea>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Send Message <FiSend className="ml-2" />
                  </>
                )}
              </Button>

              {/* Error */}
              {submitError && (
                <div className="text-red-500 text-center py-3">
                  <i className="fa-solid fa-exclamation-circle mr-2"></i>
                  {submitError}
                </div>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticContactFormPage;
