import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { INSERTPICKUPPROOF } from '../../../../graphql/mutation';
import { Camera, Edit2, CheckCircle, Trash2, X } from 'lucide-react';

const packageConditions = [
  { value: 'excellent', label: 'Excellent - No visible damage' },
  { value: 'good', label: 'Good - Minor wear' },
  { value: 'fair', label: 'Fair - Some damage' },
  { value: 'poor', label: 'Poor - Significant damage' },
];

const PickupProofForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerSignature: null,
    id: '',
    numberOfPackages: '',
    otpCode: '',
    packageCondition: '',
    pickupAddress: '',
    pickupDateTime: '',
    pickupLatitude: '',
    pickupLongitude: '',
    proofPhotoUrl: null,
    remarks: '',
    riderId: '',
    status: 'completed'
  });

  const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const signatureCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [canvasContext, setCanvasContext] = useState(null);

  const [insertPickupProof, { loading, error }] = useMutation(INSERTPICKUPPROOF);

  useEffect(() => {
    if (signatureCanvasRef.current) {
      const canvas = signatureCanvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#006341';
      ctx.lineWidth = 2;
      setCanvasContext(ctx);
    }
  }, []);

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

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvasContext.beginPath();
    canvasContext.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvasContext.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    canvasContext.stroke();
    setIsSignatureEmpty(false);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (!isSignatureEmpty) {
      const canvas = signatureCanvasRef.current;
      const signatureData = canvas.toDataURL();
      setFormData(prev => ({
        ...prev,
        customerSignature: signatureData
      }));
    }
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    setIsSignatureEmpty(true);
    setFormData(prev => ({
      ...prev,
      customerSignature: null
    }));
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
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-green-100">
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
                </label>
                <div 
                  className="relative w-full h-40 border-2 border-dashed border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition cursor-pointer"
                  onClick={() => document.getElementById('signatureCanvas').focus()}
                >
                  <canvas
                    id="signatureCanvas"
                    ref={signatureCanvasRef}
                    width="100%"
                    height="100%"
                    className="absolute inset-0 w-full h-full"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  {isSignatureEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center text-green-400">
                      <Edit2 className="mr-2" />
                      <span>Sign here</span>
                    </div>
                  )}
                  {!isSignatureEmpty && (
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow text-green-600 hover:text-green-800 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
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
