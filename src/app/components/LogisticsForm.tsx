import { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  MapPin, 
  Truck, 
  Rocket, 
  Clock, 
  Move,
  User,
  Phone,
  PlusCircle,
  X,
  CheckCircle2,
  Loader2,
  Package,
  LocateFixed,
  Route
} from 'lucide-react';

const LogisticsForm = () => {
  // State management
  const [pickup, setPickup] = useState({
    address: '',
    houseNumber: '',
    contact: '',
    name: '',
    lat: null,
    lng: null
  });
  
  const [dropoffs, setDropoffs] = useState([{
    address: '',
    houseNumber: '',
    contact: '',
    name: '',
    lat: null,
    lng: null
  }]);
  
  const [activeLocation, setActiveLocation] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState('Car');
  const [selectedService, setSelectedService] = useState('Regular');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mapPreview, setMapPreview] = useState(null);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

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
      name: '',
      lat: null,
      lng: null
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
    setSuggestions([]);
  };

  const closeLocationDetails = () => {
    setActiveLocation(null);
    setSuggestions([]);
  };

  // Geocoding function using OpenStreetMap Nominatim
  const geocodeAddress = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      
      return data.map(result => ({
        formatted_address: result.display_name,
        geometry: { 
          location: { 
            lat: parseFloat(result.lat), 
            lng: parseFloat(result.lon) 
          } 
        }
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced address search
  const handleAddressSearch = (e) => {
    const value = e.target.value;
    
    if (activeLocation?.type === 'pickup') {
      setPickup({...pickup, address: value});
    } else if (activeLocation?.index !== null) {
      const updatedDropoffs = [...dropoffs];
      updatedDropoffs[activeLocation.index].address = value;
      setDropoffs(updatedDropoffs);
    }
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for debounce
    timeoutRef.current = setTimeout(async () => {
      if (value.length > 2) {
        const results = await geocodeAddress(value);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 500);
  };

  // Select a suggestion
  const selectSuggestion = (suggestion) => {
    const address = suggestion.formatted_address;
    
    if (activeLocation?.type === 'pickup') {
      setPickup({
        ...pickup, 
        address,
        lat: suggestion.geometry.location.lat,
        lng: suggestion.geometry.location.lng
      });
    } else if (activeLocation?.index !== null) {
      const updatedDropoffs = [...dropoffs];
      updatedDropoffs[activeLocation.index] = {
        ...updatedDropoffs[activeLocation.index],
        address,
        lat: suggestion.geometry.location.lat,
        lng: suggestion.geometry.location.lng
      };
      setDropoffs(updatedDropoffs);
    }
    
    setSuggestions([]);
  };

  // Generate map preview URL
  useEffect(() => {
    if (pickup.lat && pickup.lng && dropoffs[0].lat && dropoffs[0].lng) {
      const markers = [
        `color:blue|label:P|${pickup.lat},${pickup.lng}`,
        ...dropoffs.map((dropoff, i) => `color:red|label:${i+1}|${dropoff.lat},${dropoff.lng}`)
      ].join('&');
      
      const url = `https://www.openstreetmap.org/export/embed.html?bbox=${
        Math.min(pickup.lng, ...dropoffs.map(d => d.lng)) - 0.1
      },${
        Math.min(pickup.lat, ...dropoffs.map(d => d.lat)) - 0.1
      },${
        Math.max(pickup.lng, ...dropoffs.map(d => d.lng)) + 0.1
      },${
        Math.max(pickup.lat, ...dropoffs.map(d => d.lat)) + 0.1
      }&markers=${markers}`;
      
      setMapPreview(url);
    }
  }, [pickup, dropoffs]);

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!pickup.address) {
      alert('Please enter a pickup address');
      return;
    }
    
    for (const [index, dropoff] of dropoffs.entries()) {
      if (!dropoff.address) {
        alert(`Please enter a dropoff address for location #${index + 1}`);
        return;
      }
    }
    
    if (!selectedVehicle) {
      alert('Please select a vehicle type');
      return;
    }
    
    const formData = {
      pickup,
      dropoffs,
      selectedVehicle,
      selectedService
    };
    
    console.log('Form submitted:', formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Focus input when panel opens
  useEffect(() => {
    if (activeLocation && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeLocation]);

  // Vehicle data
  const vehicles = [
    { id: 'Motorcycle', name: 'Motorcycle', icon: Truck, capacity: 'Small packages', price: '$5' },
    { id: 'Car', name: 'Car', icon: Truck, capacity: 'Medium loads', price: '$15' },
    { id: 'Truck', name: 'Truck', icon: Truck, capacity: 'Large shipments', price: '$35' }
  ];

  // Service data
  const services = [
    { id: 'Priority', name: 'Priority', icon: Rocket, time: '1-3 hours', price: '+$10' },
    { id: 'Regular', name: 'Regular', icon: Clock, time: 'Same day', price: '' },
    { id: 'Polling', name: 'Polling', icon: Move, time: 'Multi-day', price: '-$5' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-0">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <Truck className="h-8 w-8 mr-3" />
            Express Delivery Service
          </h1>
          <p className="mt-2 opacity-90">Fast and reliable logistics solutions</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-2">
          {/* Pickup Section */}
          <div className="bg-blue-50 p-5 rounded-xl mb-6 border border-blue-100">
            <h2 className="text-lg font-semibold mb-3 flex items-center text-blue-800">
              <MapPin className="h-5 w-5 mr-2" />
              Pickup Location
            </h2>
            <button
              type="button"
              onClick={() => openLocationDetails('pickup')}
              className="w-full text-left p-4 border-2 border-dashed border-blue-300 rounded-xl mb-3 hover:bg-blue-100 flex items-center"
            >
              {pickup.address ? (
                <span className="truncate flex-1">{pickup.address}</span>
              ) : (
                <span className="text-blue-500 flex-1">Enter pickup address</span>
              )}
              <Home className="h-5 w-5 text-blue-500 ml-2" />
            </button>
          </div>

          {/* Dropoff Sections */}
          <div className="bg-orange-50 p-5 rounded-xl mb-6 border border-orange-100">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold flex items-center text-orange-800">
                <MapPin className="h-5 w-5 mr-2" />
                Drop-off Locations
              </h2>
              <button
                type="button"
                onClick={addDropoff}
                className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm flex items-center hover:bg-orange-600 transition-colors"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Dropoff
              </button>
            </div>

            {dropoffs.map((dropoff, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => openLocationDetails('dropoff', index)}
                    className="flex-1 text-left p-4 border-2 border-dashed border-orange-300 rounded-xl hover:bg-orange-100 flex items-center"
                  >
                    {dropoff.address ? (
                      <span className="truncate flex-1">{dropoff.address}</span>
                    ) : (
                      <span className="text-orange-500 flex-1">Enter drop-off address #{index + 1}</span>
                    )}
                    <div className="bg-orange-100 text-orange-800 rounded-full px-2 py-1 text-xs ml-2">
                      #{index + 1}
                    </div>
                  </button>
                  {dropoffs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDropoff(index)}
                      className="ml-2 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Map Preview */}
          {mapPreview && (
            <div className="bg-gray-50 p-5 rounded-xl mb-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-3 flex items-center">
                <Route className="h-5 w-5 mr-2 text-gray-700" />
                Route Preview
              </h2>
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-300">
                <iframe 
                  src={mapPreview}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}

          {/* Vehicle Selection */}
          <div className="bg-gray-50 p-5 rounded-xl mb-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-gray-700" />
              Vehicle Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedVehicle === vehicle.id
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <vehicle.icon className={`h-6 w-6 mr-2 ${
                      selectedVehicle === vehicle.id ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <span className="font-medium">{vehicle.name}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{vehicle.capacity}</div>
                  <div className="text-sm font-medium mt-2">{vehicle.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Selection */}
          <div className="bg-gray-50 p-5 rounded-xl mb-8 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-700" />
              Service Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedService === service.id
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <service.icon className={`h-6 w-6 mr-2 ${
                      selectedService === service.id ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Delivery: {service.time}</div>
                  <div className="text-sm font-medium mt-2">{service.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center font-medium text-lg"
          >
            <Truck className="h-5 w-5 mr-2" />
            Schedule Delivery
          </button>
        </form>
      </div>

      {/* Location Details Slide-up Panel */}
      {activeLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-end md:justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl md:rounded-2xl shadow-lg animate-slide-up md:animate-scale-in max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center">
                  {activeLocation.type === 'pickup' 
                    ? <><Home className="h-5 w-5 mr-2 text-blue-500" /> Pickup Details</> 
                    : <><MapPin className="h-5 w-5 mr-2 text-orange-500" /> Drop-off #{activeLocation.index + 1} Details</>}
                </h2>
                <button 
                  onClick={closeLocationDetails} 
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-5 overflow-y-auto flex-grow">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    Full Address
                  </label>
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      name="address"
                      value={
                        activeLocation.type === 'pickup' 
                          ? pickup.address 
                          : dropoffs[activeLocation.index].address
                      }
                      onChange={handleAddressSearch}
                      className="w-full p-3 border border-gray-300 rounded-lg pl-10"
                      placeholder="Search address..."
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>
                  
                  {isLoading && (
                    <div className="mt-2 text-sm text-gray-500 flex items-center">
                      <Loader2 className="animate-spin h-4 w-4 mr-2 text-blue-500" />
                      Searching...
                    </div>
                  )}
                  
                  {suggestions.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                      {suggestions.map((suggestion, index) => (
                        <div 
                          key={index}
                          onClick={() => selectSuggestion(suggestion)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-start"
                        >
                          <MapPin className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="truncate">{suggestion.formatted_address}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center">
                      <Home className="h-4 w-4 mr-1 text-gray-500" />
                      House Number
                    </label>
                    <div className="relative">
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
                        className="w-full p-3 border border-gray-300 rounded-lg pl-10"
                        placeholder="No."
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Home className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-gray-500" />
                      Contact Number
                    </label>
                    <div className="relative">
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
                        className="w-full p-3 border border-gray-300 rounded-lg pl-10"
                        placeholder="Phone number"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Phone className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-500" />
                    Recipient Name
                  </label>
                  <div className="relative">
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
                      className="w-full p-3 border border-gray-300 rounded-lg pl-10"
                      placeholder="Full name"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-gray-200">
              <button
                type="button"
                onClick={closeLocationDetails}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center font-medium"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up z-50 flex items-center">
          <CheckCircle2 className="h-6 w-6 mr-2" />
          Delivery scheduled successfully!
        </div>
      )}
    </div>
  );
};

export default LogisticsForm;
