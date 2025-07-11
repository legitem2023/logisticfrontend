// components/LogisticsForm.jsx
import { useState } from 'react';

const LogisticsForm = () => {
  // State management
  const [pickup, setPickup] = useState({
    address: '',
    houseNumber: '',
    contact: '',
    name: ''
  });
  
  const [dropoffs, setDropoffs] = useState([{
    address: '',
    houseNumber: '',
    contact: '',
    name: ''
  }]);
  
  const [activeLocation, setActiveLocation] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedService, setSelectedService] = useState('Regular');

  // Handle input changes
  const handlePickupChange = (e) => {
    setPickup({...pickup, [e.target.name]: e.target.value});
  };

  const handleDropoffChange = (index, e) => {
    const updatedDropoffs = [...dropoffs];
    updatedDropoffs[index] = {
      ...updatedDropoffs[index],
      [e.target.name]: e.target.value
    };
    setDropoffs(updatedDropoffs);
  };

  // Location management
  const addDropoff = () => {
    setDropoffs([...dropoffs, {
      address: '',
      houseNumber: '',
      contact: '',
      name: ''
    }]);
  };

  const removeDropoff = (index) => {
    if (dropoffs.length <= 1) return;
    const updatedDropoffs = dropoffs.filter((_, i) => i !== index);
    setDropoffs(updatedDropoffs);
  };

  // Open/close location details
  const openLocationDetails = (type, index = null) => {
    setActiveLocation({ type, index });
  };

  const closeLocationDetails = () => {
    setActiveLocation(null);
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      pickup,
      dropoffs,
      selectedVehicle,
      selectedService
    };
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pickup Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Pickup Location</h2>
          <button
            type="button"
            onClick={() => openLocationDetails('pickup')}
            className="w-full text-left p-3 border border-gray-300 rounded-lg mb-3 hover:bg-gray-50"
          >
            {pickup.address || 'Enter pickup address'}
          </button>
        </div>

        {/* Dropoff Sections */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Drop-off Locations</h2>
            <button
              type="button"
              onClick={addDropoff}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
            >
              + Add Dropoff
            </button>
          </div>

          {dropoffs.map((dropoff, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => openLocationDetails('dropoff', index)}
                  className="flex-1 text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {dropoff.address || `Enter drop-off address #${index + 1}`}
                </button>
                {dropoffs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDropoff(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Vehicle Selection */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Vehicle Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {['Motorcycle', 'Car', 'Truck'].map((vehicle) => (
              <button
                key={vehicle}
                type="button"
                onClick={() => setSelectedVehicle(vehicle)}
                className={`p-3 border rounded-lg text-center ${
                  selectedVehicle === vehicle
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {vehicle}
              </button>
            ))}
          </div>
        </div>

        {/* Service Selection */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Service Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {['Priority', 'Regular', 'Polling'].map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => setSelectedService(service)}
                className={`p-3 border rounded-lg text-center ${
                  selectedService === service
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Schedule Delivery
        </button>
      </form>

      {/* Location Details Slide-up Panel */}
      {activeLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-end md:justify-center">
          <div className="bg-white w-full max-w-md rounded-t-xl md:rounded-xl shadow-lg animate-slide-up md:animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {activeLocation.type === 'pickup' 
                    ? 'Pickup Details' 
                    : `Drop-off #${activeLocation.index + 1} Details`}
                </h2>
                <button onClick={closeLocationDetails} className="text-gray-500 hover:text-gray-700">
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Address</label>
                  <input
                    type="text"
                    name="address"
                    value={
                      activeLocation.type === 'pickup' 
                        ? pickup.address 
                        : dropoffs[activeLocation.index].address
                    }
                    onChange={(e) => 
                      activeLocation.type === 'pickup'
                        ? handlePickupChange(e)
                        : handleDropoffChange(activeLocation.index, e)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Street, City, Postal Code"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">House Number</label>
                    <input
                      type="text"
                      name="houseNumber"
                      value={
                        activeLocation.type === 'pickup' 
                          ? pickup.houseNumber 
                          : dropoffs[activeLocation.index].houseNumber
                      }
                      onChange={(e) => 
                        activeLocation.type === 'pickup'
                          ? handlePickupChange(e)
                          : handleDropoffChange(activeLocation.index, e)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="No."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Number</label>
                    <input
                      type="tel"
                      name="contact"
                      value={
                        activeLocation.type === 'pickup' 
                          ? pickup.contact 
                          : dropoffs[activeLocation.index].contact
                      }
                      onChange={(e) => 
                        activeLocation.type === 'pickup'
                          ? handlePickupChange(e)
                          : handleDropoffChange(activeLocation.index, e)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Recipient Name</label>
                  <input
                    type="text"
                    name="name"
                    value={
                      activeLocation.type === 'pickup' 
                        ? pickup.name 
                        : dropoffs[activeLocation.index].name
                    }
                    onChange={(e) => 
                      activeLocation.type === 'pickup'
                        ? handlePickupChange(e)
                        : handleDropoffChange(activeLocation.index, e)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Full name"
                  />
                </div>

                <button
                  type="button"
                  onClick={closeLocationDetails}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Save Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsForm;
