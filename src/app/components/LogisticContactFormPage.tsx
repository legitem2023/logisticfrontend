// components/DeluxeContactForm.jsx
import { useState } from 'react';

const LogisticContactFormPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: '',
          message: '',
        });
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-900 via-green-700 to-green-500 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMTUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] opacity-10" />

      {/* Main container */}
      <div className="max-w-6xl w-full bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-green-300 animate-fadeIn">
        <div className="flex flex-col lg:flex-row">
          {/* Form Side */}
          <div className="w-full p-10">
            {submitSuccess ? (
              <div className="bg-green-50 border border-green-400 rounded-xl p-8 text-center">
                <i className="fa-solid fa-check-circle text-5xl text-green-600 mb-4"></i>
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  Message Sent!
                </h3>
                <p className="text-green-700">
                  Thank you for contacting us. Our logistics team will get back
                  to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-green-50 border border-green-300 rounded-xl py-4 px-5 text-green-900 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                      placeholder="Full Name"
                    />
                    <i className="fa-solid fa-user absolute right-4 top-4 text-green-400"></i>
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-green-50 border border-green-300 rounded-xl py-4 px-5 text-green-900 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                      placeholder="Email Address"
                    />
                    <i className="fa-solid fa-envelope absolute right-4 top-4 text-green-400"></i>
                  </div>

                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-green-50 border border-green-300 rounded-xl py-4 px-5 text-green-900 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                      placeholder="Phone Number"
                    />
                    <i className="fa-solid fa-phone absolute right-4 top-4 text-green-400"></i>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-green-50 border border-green-300 rounded-xl py-4 px-5 text-green-900 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                      placeholder="Company Name"
                    />
                    <i className="fa-solid fa-building absolute right-4 top-4 text-green-400"></i>
                  </div>
                </div>

                <div className="relative">
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full bg-green-50 border border-green-300 rounded-xl py-4 px-5 text-green-900 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                  >
                    <option value="">Select Service Type</option>
                    <option value="air">Air Freight</option>
                    <option value="sea">Sea Freight</option>
                    <option value="ground">Ground Transport</option>
                    <option value="warehousing">Warehousing</option>
                    <option value="customs">Customs Clearance</option>
                    <option value="other">Other Services</option>
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-4 top-4 text-green-400 pointer-events-none"></i>
                </div>

                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full bg-green-50 border border-green-300 rounded-xl py-4 px-5 text-green-900 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    placeholder="Your Message"
                  ></textarea>
                  <i className="fa-solid fa-comment-dots absolute right-4 top-4 text-green-400"></i>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-700 to-green-500 hover:from-green-600 hover:to-green-400 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Processing...
                      </>
                    ) : (
                      <>
                        Send Message
                        <i className="fa-solid fa-paper-plane ml-2"></i>
                      </>
                    )}
                  </button>
                </div>

                {submitError && (
                  <div className="text-red-500 text-center py-3">
                    <i className="fa-solid fa-exclamation-circle mr-2"></i>
                    {submitError}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        body {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default LogisticContactFormPage;
