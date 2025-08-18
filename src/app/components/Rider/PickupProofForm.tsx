import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';
import { INSERTPICKUPPROOF } from '../../../../graphql/mutation';
import { Camera, Edit2, CheckCircle, Trash2, X } from 'lucide-react';
import { selectTempUserId } from '../../../../Redux/tempUserSlice';

const packageConditions = [
  { value: 'excellent', label: 'Excellent - No visible damage' },
  { value: 'good', label: 'Good - Minor wear' },
  { value: 'fair', label: 'Fair - Some damage' },
  { value: 'poor', label: 'Poor - Significant damage' },
];

const PickupProofForm = () => {
  const location = useSelector((state: any) => state.location.current);
  console.log(location);
    const globalUserId = useSelector(selectTempUserId);

  const [formData, setFormData] = useState({
    customerName: '',
    customerSignature: null,
    id: '',
    numberOfPackages: 1,
    otpCode: '',
    packageCondition: '',
    pickupAddress: '',
    pickupDateTime: '',
    pickupLatitude: location.latitude,
    pickupLongitude: location.longitude,
    proofPhotoUrl: null,
    remarks: '',
    riderId: globalUserId,
    status: 'completed'
  });

  const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureSaved, setSignatureSaved] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const signatureCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  const [insertPickupProof, { loading, error }] = useMutation(INSERTPICKUPPROOF);

  // Initialize canvas context with high resolution
  useEffect(() => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    // Get the display size (CSS pixels)
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    // Set internal resolution 5x higher
    const scale = 5;
    canvas.width = displayWidth * scale;
    canvas.height = displayHeight * scale;
    
    const context = canvas.getContext('2d');
    
    // Scale context to match CSS size
    context.scale(scale, scale);
    
    // Set up canvas properties
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = 3;
    context.strokeStyle = '#2e8b57';
    
    setCtx(context);
    
    // Handle window resize to maintain high resolution
    const handleResize = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      canvas.width = displayWidth * scale;
      canvas.height = displayHeight * scale;
      context.scale(scale, scale);
      context.lineJoin = 'round';
      context.lineCap = 'round';
      context.lineWidth = 3;
      context.strokeStyle = '#2e8b57';
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Get coordinates from both mouse and touch events
  const getCoordinates = (e) => {
    const canvas = signatureCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // For touch events
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } 
    // For mouse events
    else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          proofPhotoUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle signature drawing
  const startDrawing = (e) => {
    if (!ctx) return;
    
    // Prevent scrolling on mobile
    if (e.touches) {
      e.preventDefault();
    }
    
    const { x, y } = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !ctx) return;
    
    // Prevent scrolling on mobile
    if (e.touches) {
      e.preventDefault();
    }
    
    const { x, y } = getCoordinates(e);
    
    ctx.lineTo(x, y);
    ctx.stroke();
    setIsSignatureEmpty(false);
  };

  const stopDrawing = () => {
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  // Save signature to form data
  const saveSignature = () => {
    const canvas = signatureCanvasRef.current;
    const dataUrl = canvas.toDataURL();
    
    setFormData(prev => ({
      ...prev,
      customerSignature: dataUrl
    }));
    setSignatureSaved(true);
    
    setTimeout(() => {
      setSignatureSaved(false);
    }, 2000);
  };

  // Clear signature
  const clearSignature = () => {
    if (!ctx) return;
    
    const canvas = signatureCanvasRef.current;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    ctx.clearRect(0, 0, displayWidth * 5, displayHeight * 5);
    setFormData(prev => ({
      ...prev,
      customerSignature: null
    }));
    setIsSignatureEmpty(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await insertPickupProof({
        variables: {
          input: formData
        }
      });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 p-1">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-2xl overflow-hidden border border-green-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-800 to-green-600 p-6 text-center">
            <h2 className="text-2xl font-bold text-white">Proof of Pickup</h2>
            <p className="text-green-100 mt-2">Complete the form to document the package pickup</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Customer Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800 border-b border-green-100 pb-2">
                Customer Information
              </h3>
              
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-green-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  placeholder="Enter customer name"
                />
              </div>

              {/* Signature Pad */}
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Customer Signature
                  {signatureSaved && (
                    <span className="ml-2 text-green-600 text-sm flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Saved
                    </span>
                  )}
                </label>
                <div className="border-2 border-green-300 rounded-2xl bg-white p-4 shadow-inner">
                  <canvas
                    ref={signatureCanvasRef}
                    className="w-full h-[150px] border border-gray-200 rounded-lg bg-gray-50 cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  <div className="flex justify-between mt-3">
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition flex items-center shadow-sm"
                    >
                      <Trash2 className="h-5 w-5 mr-1" />
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={saveSignature}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition flex items-center shadow-md"
                    >
                      <CheckCircle className="h-5 w-5 mr-1" />
                      Save Signature
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800 border-b border-green-100 pb-2">
                Pickup Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pickupAddress" className="block text-sm font-medium text-green-700 mb-1">
                    Pickup Address
                  </label>
                  <input
                    type="text"
                    id="pickupAddress"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    placeholder="Enter pickup address"
                  />
                </div>

                <div>
                  <label htmlFor="pickupDateTime" className="block text-sm font-medium text-green-700 mb-1">
                    Pickup Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id="pickupDateTime"
                    name="pickupDateTime"
                    value={formData.pickupDateTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="pickupLatitude" className="block text-sm font-medium text-green-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="pickupLatitude"
                    name="pickupLatitude"
                    value={formData.pickupLatitude}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    placeholder="00.000000"
                  />
                </div>

                <div>
                  <label htmlFor="pickupLongitude" className="block text-sm font-medium text-green-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="pickupLongitude"
                    name="pickupLongitude"
                    value={formData.pickupLongitude}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    placeholder="00.000000"
                  />
                </div>

                <div>
                  <label htmlFor="numberOfPackages" className="block text-sm font-medium text-green-700 mb-1">
                    Number of Packages
                  </label>
                  <input
                    type="number"
                    id="numberOfPackages"
                    name="numberOfPackages"
                    value={formData.numberOfPackages}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    placeholder="1"
                  />
                </div>
              </div>
            </div>

            {/* Package Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800 border-b border-green-100 pb-2">
                Package Information
              </h3>

              <div>
                <label htmlFor="packageCondition" className="block text-sm font-medium text-green-700 mb-1">
                  Package Condition
                </label>
                <select
                  id="packageCondition"
                  name="packageCondition"
                  value={formData.packageCondition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                >
                  <option value="">Select condition</option>
                  {packageConditions.map((condition) => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="proofPhotoUrl" className="block text-sm font-medium text-green-700 mb-1">
                  Proof Photo
                </label>
                <input
                  type="file"
                  id="proofPhotoUrl"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full border-2 border-dashed border-green-200 rounded-lg p-4 bg-green-50 hover:bg-green-100 transition cursor-pointer flex flex-col items-center justify-center"
                >
                  {formData.proofPhotoUrl ? (
                    <>
                      <img 
                        src={formData.proofPhotoUrl} 
                        alt="Proof" 
                        className="max-h-48 rounded-lg mb-2"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData(prev => ({ ...prev, proofPhotoUrl: null }));
                        }}
                        className="mt-2 px-3 py-1 bg-white rounded-full shadow text-green-600 hover:text-green-800 transition flex items-center"
                      >
                        <X size={16} className="mr-1" />
                        Change Photo
                      </button>
                    </>
                  ) : (
                    <>
                      <Camera className="text-green-400 mb-2" size={24} />
                      <span className="text-green-600">Click to upload photo</span>
                      <span className="text-xs text-green-400 mt-1">Supports JPG, PNG</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="otpCode" className="block text-sm font-medium text-green-700 mb-1">
                  OTP Code
                </label>
                <input
                  type="text"
                  id="otpCode"
                  name="otpCode"
                  value={formData.otpCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  placeholder="Enter OTP code"
                />
              </div>

              <div>
                <label htmlFor="remarks" className="block text-sm font-medium text-green-700 mb-1">
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  placeholder="Any additional notes..."
                />
              </div>
            </div>

            {/* Hidden fields */}
            <input type="hidden" name="riderId" value={formData.riderId} />
            <input type="hidden" name="status" value={formData.status} />
            <input type="hidden" name="id" value={formData.id} />

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || isSignatureEmpty || !formData.proofPhotoUrl}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${loading || isSignatureEmpty || !formData.proofPhotoUrl 
                  ? 'bg-green-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 shadow-lg'}`}
              >
                {loading ? 'Submitting...' : 'Submit Proof of Pickup'}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                Error: {error.message}
              </div>
            )}

            {submitSuccess && (
              <div className="p-3 bg-green-50 text-green-700 rounded-lg flex items-center justify-center">
                <CheckCircle className="mr-2 text-green-600" />
                Pickup proof submitted successfully!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PickupProofForm;
