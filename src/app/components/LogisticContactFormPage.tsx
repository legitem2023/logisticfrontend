// components/DeluxeContactForm.jsx
import { useState } from 'react';
import Head from 'next/head';

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Reset form after success
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
    <>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a192f] to-[#172a45] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzE3MmE0NSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')] opacity-20" />
        
        {/* Main container */}
        <div className="max-w-6xl w-full bg-[#0a192f]/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-[rgba(64,156,255,0.15)] animate-fadeIn">
          <div className="flex flex-col lg:flex-row">
            {/* Contact Information Side */}
            <div className="lg:w-2/5 bg-gradient-to-br from-[#0d2b4e] to-[#0a1a30] p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMTUgMTVoMzBNMTUgMzBoMzBNMTUgNDVoMzBNNDUgMTVoMzBNNDUgMzBoMzBNNDUgNDVoMzAiIHN0cm9rZT0iIzQwOWNmZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI0IiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-10" />
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold font-playfair text-white mb-8">Connect With Us</h2>
                
                <div className="space-y-6 mb-10">
                  <div className="flex items-start">
                    <div className="bg-[#112240]/50 p-3 rounded-full mr-4">
                      <i className="fa-solid fa-location-dot text-[#64ffda] text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Headquarters</h3>
                      <p className="text-[#a8b2d1]">123 Logistics Blvd, Suite 500<br />New York, NY 10001</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#112240]/50 p-3 rounded-full mr-4">
                      <i className="fa-solid fa-phone text-[#64ffda] text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Contact</h3>
                      <p className="text-[#a8b2d1]">+1 (800) 555-1234<br />support@globallogix.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#112240]/50 p-3 rounded-full mr-4">
                      <i className="fa-solid fa-clock text-[#64ffda] text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Business Hours</h3>
                      <p className="text-[#a8b2d1]">Monday - Friday: 8am - 8pm<br />Saturday: 9am - 4pm</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h3 className="text-xl font-playfair font-semibold text-white mb-4">Global Reach</h3>
                  <div className="flex space-x-3">
                    {['🇺🇸', '🇪🇺', '🇨🇳', '🇯🇵', '🇦🇪', '🇸🇬'].map((flag, idx) => (
                      <div key={idx} className="bg-[#112240]/50 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                        {flag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form Side */}
            <div className="lg:w-3/5 p-10">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold font-playfair text-white mb-2">Contact Our Team</h1>
                <p className="text-[#a8b2d1] max-w-lg mx-auto">Get in touch with our logistics experts. Well respond within 24 hours to discuss your shipping needs.</p>
              </div>
              
              {submitSuccess ? (
                <div className="bg-green-900/30 border border-green-500 rounded-xl p-8 text-center">
                  <i className="fa-solid fa-check-circle text-5xl text-green-500 mb-4"></i>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-[#a8b2d1]">Thank you for contacting us. Our logistics team will get back to you shortly.</p>
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
                        className="w-full bg-[#112240]/50 border border-[#233554] rounded-xl py-4 px-5 text-white placeholder-[#495c7c] focus:outline-none focus:ring-2 focus:ring-[#64ffda] transition-all duration-300"
                        placeholder="Full Name"
                      />
                      <i className="fa-solid fa-user absolute right-4 top-4 text-[#495c7c]"></i>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#112240]/50 border border-[#233554] rounded-xl py-4 px-5 text-white placeholder-[#495c7c] focus:outline-none focus:ring-2 focus:ring-[#64ffda] transition-all duration-300"
                        placeholder="Email Address"
                      />
                      <i className="fa-solid fa-envelope absolute right-4 top-4 text-[#495c7c]"></i>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-[#112240]/50 border border-[#233554] rounded-xl py-4 px-5 text-white placeholder-[#495c7c] focus:outline-none focus:ring-2 focus:ring-[#64ffda] transition-all duration-300"
                        placeholder="Phone Number"
                      />
                      <i className="fa-solid fa-phone absolute right-4 top-4 text-[#495c7c]"></i>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full bg-[#112240]/50 border border-[#233554] rounded-xl py-4 px-5 text-white placeholder-[#495c7c] focus:outline-none focus:ring-2 focus:ring-[#64ffda] transition-all duration-300"
                        placeholder="Company Name"
                      />
                      <i className="fa-solid fa-building absolute right-4 top-4 text-[#495c7c]"></i>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#112240]/50 border border-[#233554] rounded-xl py-4 px-5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#64ffda] transition-all duration-300"
                    >
                      <option value="">Select Service Type</option>
                      <option value="air">Air Freight</option>
                      <option value="sea">Sea Freight</option>
                      <option value="ground">Ground Transport</option>
                      <option value="warehousing">Warehousing</option>
                      <option value="customs">Customs Clearance</option>
                      <option value="other">Other Services</option>
                    </select>
                    <i className="fa-solid fa-chevron-down absolute right-4 top-4 text-[#495c7c] pointer-events-none"></i>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full bg-[#112240]/50 border border-[#233554] rounded-xl py-4 px-5 text-white placeholder-[#495c7c] focus:outline-none focus:ring-2 focus:ring-[#64ffda] transition-all duration-300"
                      placeholder="Your Message"
                    ></textarea>
                    <i className="fa-solid fa-comment-dots absolute right-4 top-4 text-[#495c7c]"></i>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#0d9488] to-[#0f766e] hover:from-[#0f766e] hover:to-[#115e59] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
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
                    <div className="text-red-400 text-center py-3">
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
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out;
          }
          body {
            font-family: 'Montserrat', sans-serif;
          }
          .font-playfair {
            font-family: 'Playfair Display', serif;
          }
        `}</style>
      </div>
    </>
  );
};

export default LogisticContactFormPage;
