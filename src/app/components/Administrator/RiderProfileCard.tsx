import React, { useState } from 'react';
import { 
  User,
  Car,
  Phone,
  Mail,
  MapPin,
  Shield,
  Calendar,
  ChevronRight,
  Lock,
  X
} from 'lucide-react';
import { format } from 'date-fns';

const RiderProfileCard = ({ rider, onViewDetails }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    INACTIVE: 'bg-red-100 text-red-800 border-red-200',
    BUSY: 'bg-orange-100 text-orange-800 border-orange-200',
    OFFLINE: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const status = statusColors[rider.status] || 'bg-blue-100 text-blue-800 border-blue-200';

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long!' });
      setLoading(false);
      return;
    }

    try {
      // Simulate API call - replace with your actual API endpoint
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: rider.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Auto-close modal after success
        setTimeout(() => {
          setShowPasswordModal(false);
          setMessage({ type: '', text: '' });
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  return (
    <>
      <div className="w-full max-w-sm rounded-2xl shadow-lg overflow-hidden bg-white border border-gray-100">
        {/* Header with Gradient Background */}
        <div 
          className="pt-8 pb-12 px-6 text-center relative"
          style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' }}
        >
          {/* Avatar with Status Badge */}
          <div className="relative inline-block">
            {rider.image ? (
              <img 
                src={rider.image}
                alt={rider.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white/30"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-purple-600 border-4 border-white/30">
                <User size={32} />
              </div>
            )}
            {/* Status Badge */}
            <span 
              className={`absolute -bottom-2 -right-2 w-5 h-5 rounded-full border-2 border-white ${status.split(' ')[0]}`}
            ></span>
          </div>

          <h3 className="text-xl font-semibold text-white mt-4 mb-1">{rider.name}</h3>
          <p className="text-white/80">{rider.role}</p>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Details Sections */}
          <div className="space-y-5">
            {/* Email */}
            <div>
              <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                <Mail className="w-4 h-4 mr-2 text-blue-500" />
                Email
              </div>
              <p className="text-gray-800">{rider.email}</p>
            </div>

            {/* Phone */}
            <div>
              <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                <Phone className="w-4 h-4 mr-2 text-blue-500" />
                Phone
              </div>
              <p className="text-gray-800">{rider.phoneNumber}</p>
            </div>

            {/* Vehicle */}
            <div>
              <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                <Car className="w-4 h-4 mr-2 text-blue-500" />
                Vehicle
              </div>
              <p className="font-semibold text-gray-800">{rider.vehicleType.name}</p>
              <div className="text-sm text-gray-500 mt-1">
                <p>Plate: {rider.licensePlate}</p>
                <p>Capacity: {rider.vehicleType.maxCapacityKg}kg · {rider.vehicleType.maxVolumeM3}m³</p>
              </div>
            </div>

            {/* Location */}
            {rider.currentLatitude && rider.currentLongitude && (
              <div>
                <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  Location
                </div>
                <p className="text-gray-800">
                  {rider.currentLatitude.toFixed(4)}, {rider.currentLongitude.toFixed(4)}
                </p>
              </div>
            )}

            {/* Status */}
            <div>
              <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                <Shield className="w-4 h-4 mr-2 text-blue-500" />
                Status
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status}`}>
                {rider.status}
              </span>
            </div>

            {/* Change Password Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center justify-center w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </button>
            </div>
          </div>

          {/* Footer with Date and Button */}
          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              Joined {format(new Date(rider.createdAt * 1000), 'MMM d, yyyy')}
            </div>
            <button
              onClick={() => onViewDetails(rider)}
              className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium transition-colors"
            >
              View Full Profile
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center">
                <Lock className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Change Password for {rider.name}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setMessage({ type: '', text: '' });
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handlePasswordChange} className="p-6">
              {/* Message Display */}
              {message.text && (
                <div className={`mb-4 p-3 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Current Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter current password"
                />
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleInputChange}
                  required
                  minLength="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter new password (min. 8 characters)"
                />
              </div>

              {/* Confirm New Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setMessage({ type: '', text: '' });
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RiderProfileCard;
