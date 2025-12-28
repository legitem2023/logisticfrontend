// components/DeluxeContactForm.jsx
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SUBMIT_LOGISTICS_CONTACT_FORM } from "../../../graphql/mutation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Select } from "./ui/Select";
import { FiUser, FiMail, FiPhone, FiHome, FiMessageSquare, FiChevronDown, FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
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
  const [submitResult, setSubmitResult] = useState(null);
  const [errors, setErrors] = useState({});

  // Apollo Mutation Hook
  const [submitContactForm] = useMutation(SUBMIT_LOGISTICS_CONTACT_FORM);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.service) newErrors.service = "Service type is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitResult(null);
    
    try {
      const { data } = await submitContactForm({
        variables: {
          formData: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            company: formData.company || null,
            service: formData.service,
            message: formData.message,
          },
        },
      });
      
      setSubmitResult(data.submitLogisticsContactForm);
      
      if (data.submitLogisticsContactForm.success) {
        // Reset form after 5 seconds
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            phone: "",
            company: "",
            service: "",
            message: "",
          });
          setSubmitResult(null);
        }, 5000);
      }
    } catch (error) {
      console.error("Mutation error:", error);
      setSubmitResult({
        success: false,
        message: error.message || "Failed to submit form. Please try again.",
        referenceNumber: null,
        emailSent: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Display
  if (submitResult?.success) {
    return (
      <div className="flex justify-center bg-gradient-to-br from-green-50 to-green-100 p-1">
        <Card className="max-w-7xl w-full shadow-xl border border-green-100 overflow-hidden relative bg-white">
          <CardHeader className="bg-gradient-to-r from-green-800 to-green-600 p-0 relative overflow-hidden">
            <AnimatedCityscape>
              <CardTitle className="text-2xl font-bold text-white text-center relative z-10">
                Message Sent Successfully!
              </CardTitle>
            </AnimatedCityscape>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="bg-green-50 border border-green-400 rounded-xl p-8 text-center">
              <FiCheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                Thank You for Contacting Us!
              </h3>
              <p className="text-green-700 mb-4">{submitResult.message}</p>
              
              {submitResult.referenceNumber && (
                <div className="bg-white border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-1">Reference Number</p>
                  <p className="text-lg font-mono font-bold text-green-800">
                    {submitResult.referenceNumber}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Please keep this number for your records
                  </p>
                </div>
              )}
              
              <div className="space-y-2 text-gray-600 mb-6">
                {submitResult.emailSent && (
                  <p className="flex items-center justify-center">
                    <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Confirmation email sent to {formData.email}
                  </p>
                )}
                <p>Our logistics team will contact you within 24 hours</p>
              </div>
              
              <Button
                onClick={() => setSubmitResult(null)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Submit Another Inquiry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gradient-to-br from-green-50 to-green-100 p-1">
      <Card className="max-w-7xl w-full shadow-xl border border-green-100 overflow-hidden relative bg-white">
        <CardHeader className="bg-gradient-to-r from-green-800 to-green-600 p-0 relative overflow-hidden">
          <AnimatedCityscape>
            <CardTitle className="text-2xl font-bold text-white text-center relative z-10">
              Contact Our Logistics Team
            </CardTitle>
            <p className="text-green-100 text-center mt-2 relative z-10">
              Were here to help you move forward
            </p>
          </AnimatedCityscape>
        </CardHeader>

        <CardContent className="p-8">
          {submitResult?.message && !submitResult?.success && (
            <div className="bg-red-50 border border-red-400 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center">
                <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{submitResult.message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                  <FiUser className="text-green-600" />
                </div>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`pl-10 border-gray-300 focus:border-green-500 focus:ring-green-400 transition-all duration-200 ${
                    errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-400' : ''
                  }`}
                  placeholder="Full Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="relative">
                <Label htmlFor="email" className="text-gray-700">Email *</Label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                  <FiMail className="text-green-600" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 border-gray-300 focus:border-green-500 focus:ring-green-400 transition-all duration-200 ${
                    errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-400' : ''
                  }`}
                  placeholder="Email Address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
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
              <Label htmlFor="service" className="text-gray-700">Service Type *</Label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                <FiChevronDown className="text-green-600" />
              </div>
              <Select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className={`pl-10 border-gray-300 focus:border-green-500 focus:ring-green-400 transition-all duration-200 ${
                  errors.service ? 'border-red-300 focus:border-red-500 focus:ring-red-400' : ''
                }`}
              >
                <option value="">Select Service Type</option>
                <option value="air">Air Freight</option>
                <option value="sea">Sea Freight</option>
                <option value="ground">Ground Transport</option>
                <option value="warehousing">Warehousing</option>
                <option value="customs">Customs Clearance</option>
                <option value="other">Other Services</option>
              </Select>
              {errors.service && (
                <p className="text-red-500 text-sm mt-1">{errors.service}</p>
              )}
            </div>

            {/* Textarea */}
            <div className="relative">
              <Label htmlFor="message" className="text-gray-700">Message *</Label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                <FiMessageSquare className="text-green-600" />
              </div>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`pl-10 w-full border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-400 transition-all duration-200 ${
                  errors.message ? 'border-red-300 focus:border-red-500 focus:ring-red-400' : ''
                }`}
                placeholder="Please describe your logistics requirements..."
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Send Message <FiSend className="ml-2" />
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-500">
              <p>Fields marked with * are required</p>
              <p className="mt-1">You will receive a confirmation email with your reference number</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticContactFormPage;
