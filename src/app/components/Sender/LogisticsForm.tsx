'use client';
import { Icon } from '@iconify/react';
import { showToast } from '../../../../utils/toastify';
import { getDistanceInKm } from '../../../../utils/getDistanceInKm';
import { calculateEta } from '../../../../utils/calculateEta';
import { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { VEHICLEQUERY } from '../../../../graphql/query';
import { CREATEDELIVERY } from '../../../../graphql/mutation';
import { useSelector, useDispatch } from "react-redux";
import { selectTempUserId } from '../../../../Redux/tempUserSlice';
import { setActiveIndex } from '../../../../Redux/activeIndexSlice';
import {
  Home, MapPin, Truck, Rocket, Clock, Move,
  User, Phone, PlusCircle, X, CheckCircle2,
  Loader2, Package, LocateFixed, Route, ChevronDown, ChevronUp
} from 'lucide-react';
import LogisticFormLoading from '../Loadings/LogisticFormLoading';
import ClassicConfirmForm from './ClassicConfirmForm';

interface Location {
  address: string;
  houseNumber: string;
  contact: string;
  name: string;
  lat: number | null;
  lng: number | null;
}

interface VehicleType {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  perKmRate: number;
}

interface Service {
  id: string;
  name: string;
  icon: any;
  time: string;
  price: string;
}

const LogisticsForm = () => {
  const dispatch = useDispatch();
  const { loading, error, data } = useQuery(VEHICLEQUERY);
  const [createDelivery] = useMutation(CREATEDELIVERY);
  const globalUserId = useSelector(selectTempUserId);

  // Premium state management
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [expandedVehicle, setExpandedVehicle] = useState<string | null>(null);
  const [pickup, setPickup] = useState<Location>({
    address: '', houseNumber: '', contact: '', name: '', lat: null, lng: null
  });
  const [dropoffs, setDropoffs] = useState<Location[]>([{
    address: '', houseNumber: '', contact: '', name: '', lat: null, lng: null
  }]);
  const [activeLocation, setActiveLocation] = useState<{ type: 'pickup' | 'dropoff', index: number | null } | null>(null);
  const [selectedService, setSelectedService] = useState<Service['id']>('Priority');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [distances, setDistances] = useState<number[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Luxury services data
  const premiumServices: Service[] = [
    { id: 'Priority', name: 'Executive Priority', icon: Rocket, time: '1-3 hours', price: '15' },
    { id: 'Regular', name: 'Premium Standard', icon: Clock, time: 'Same day', price: '10' },
    { id: 'Polling', name: 'Scheduled Elite', icon: Move, time: 'Multi-day', price: '8' }
  ];

  // Enhanced validation
  const validateForm = () => {
    if (!pickup.address || !pickup.houseNumber || !pickup.contact || !pickup.name) {
      showToast("Please complete all pickup details", 'warning');
      return false;
    }

    if (dropoffs.some(d => !d.address || !d.houseNumber || !d.contact || !d.name)) {
      showToast("Please complete all drop-off details", 'warning');
      return false;
    }

    if (!selectedVehicle) {
      showToast("Please select a vehicle", 'warning');
      return false;
    }

    return true;
  };

  // Premium geocoding with error handling
  const geocodeAddress = async (query: string) => {
    if (!query || query.length < 3) return [];
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      if (!response.ok) throw new Error('Geocoding failed');
      return response.json();
    } catch (error) {
      showToast("Address lookup service unavailable", 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search with premium UX
  const handleAddressSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const location = activeLocation;

    // Update state
    if (location?.type === 'pickup') {
      setPickup({...pickup, address: value});
    } else if (location?.index !== null) {
      const updated = [...dropoffs];
      updated[location.index].address = value;
      setDropoffs(updated);
    }

    // Debounce
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      if (value.length > 2) setSuggestions(await geocodeAddress(value));
      else setSuggestions([]);
    }, 500);
  };

  // Luxury location management
  const addDropoff = () => setDropoffs([...dropoffs, {
    address: '', houseNumber: '', contact: '', name: '', lat: null, lng: null
  }]);

  const removeDropoff = (index: number) => {
    if (dropoffs.length > 1) {
      setDropoffs(dropoffs.filter((_, i) => i !== index));
    }
  };

  // Premium calculation effects
  useEffect(() => {
    const calculateDistances = async () => {
      if (pickup.lat && pickup.lng) {
        const calculated = await Promise.all(
          dropoffs.map(async dropoff => {
            if (dropoff.lat && dropoff.lng) {
              try {
                return await getDistanceInKm(
                  { lat: pickup.lat!, lng: pickup.lng! },
                  { lat: dropoff.lat, lng: dropoff.lng }
                );
              } catch {
                return 0;
              }
            }
            return 0;
          })
        );
        setDistances(calculated);
      }
    };
    calculateDistances();
  }, [pickup.lat, pickup.lng, dropoffs]);

  // Executive submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) setShowDetails(true);
  };

  // Platinum order confirmation
  const confirmOrder = async (driverDetails: any) => {
    setSendLoading(true);
    try {
      for (const [i, dropoff] of dropoffs.entries()) {
        const { eta } = calculateEta(parseFloat(distances[i]), selectedService);
        await createDelivery({
          variables: {
            input: {
              assignedRiderId: null,
              deliveryFee: selectedVehicle?.cost,
              deliveryType: selectedService,
              dropoffAddress: dropoff.address,
              dropoffLatitude: dropoff.lat,
              dropoffLongitude: dropoff.lng,
              estimatedDeliveryTime: eta,
              paymentMethod: "Cash",
              paymentStatus: "Unpaid",
              pickupAddress: pickup.address,
              pickupLatitude: pickup.lat,
              pickupLongitude: pickup.lng,
              recipientName: dropoff.name,
              recipientPhone: dropoff.contact,
              senderId: globalUserId,
              baseRate: selectedVehicle?.cost || 0,
              distance: distances[i],
              perKmRate: selectedVehicle?.perKmRate || 0
            }
          }
        });
      }
      showToast("Your premium delivery has been scheduled", 'success');
      dispatch(setActiveIndex(3));
    } catch (error) {
      showToast("Failed to create delivery", 'error');
    } finally {
      setSendLoading(false);
    }
  };

  if (loading) return <LogisticFormLoading />;
  if (error) return (
    <div className="bg-rose-100 border-l-4 border-rose-500 text-rose-700 p-4 rounded-lg shadow-lg max-w-2xl mx-auto mt-10">
      <p>Error loading service options: {error.message}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-800 rounded-2xl shadow-2xl overflow-hidden mb-10">
        <div className="p-8 md:p-12 text-white">
          <div className="flex items-center mb-4">
            <Truck className="h-10 w-10 mr-3 text-amber-300" />
            <h1 className="text-3xl md:text-4xl font-bold">
              Elite<span className="text-amber-300">Express</span> Logistics
            </h1>
          </div>
          <p className="text-lg text-indigo-100 max-w-2xl">
            Premium delivery services with white-glove treatment and real-time tracking
          </p>
        </div>
      </div>

      {/* Luxury Form Container */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <form onSubmit={handleSubmit} className="p-6">
          {/* Pickup Section */}
          <div className="bg-indigo-50 p-6 rounded-xl mb-8 border border-indigo-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-indigo-800">
              <MapPin className="h-6 w-6 mr-2 text-indigo-600" />
              Executive Pickup Location
            </h2>
            <button
              type="button"
              onClick={() => setActiveLocation({ type: 'pickup', index: null })}
              className={`w-full text-left p-5 rounded-xl mb-3 transition-all duration-300 ${pickup.address ? 'bg-white border-2 border-indigo-300 shadow-sm' : 'bg-indigo-100 border-2 border-dashed border-indigo-300 hover:bg-indigo-200'}`}
            >
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-3 text-indigo-500 flex-shrink-0" />
                {pickup.address ? (
                  <div className="truncate flex-1">{pickup.address}</div>
                ) : (
                  <div className="text-indigo-600 flex-1">Enter premium pickup location</div>
                )}
                <ChevronDown className="h-5 w-5 text-indigo-400 ml-2" />
              </div>
            </button>
          </div>

          {/* Dropoff Sections */}
          <div className="bg-amber-50 p-6 rounded-xl mb-8 border border-amber-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center text-amber-800">
                <Package className="h-6 w-6 mr-2 text-amber-600" />
                Platinum Drop-off Locations
              </h2>
              <button
                type="button"
                onClick={addDropoff}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Destination
              </button>
            </div>

            {dropoffs.map((dropoff, index) => (
              <div key={index} className="mb-4 last:mb-0 group">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setActiveLocation({ type: 'dropoff', index })}
                    className={`flex-1 text-left p-5 rounded-xl transition-all duration-300 ${dropoff.address ? 'bg-white border-2 border-amber-300 shadow-sm' : 'bg-amber-100 border-2 border-dashed border-amber-300 hover:bg-amber-200'}`}
                  >
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-amber-500 flex-shrink-0" />
                      {dropoff.address ? (
                        <div className="truncate flex-1">{dropoff.address}</div>
                      ) : (
                        <div className="text-amber-600 flex-1">Destination #{index + 1}</div>
                      )}
                      <ChevronDown className="h-5 w-5 text-amber-400 ml-2" />
                    </div>
                  </button>
                  {dropoffs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDropoff(index)}
                      className="ml-3 p-2 text-rose-500 hover:text-rose-700 rounded-full hover:bg-rose-50 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Luxury Vehicle Selection */}
          <div className="bg-slate-50 p-6 rounded-xl mb-8 border border-slate-200">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-slate-800">
              <Truck className="h-6 w-6 mr-2 text-slate-600" />
              Concierge Fleet Selection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.getVehicleTypes.map((vehicle: VehicleType) => (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer ${selectedVehicle?.id === vehicle.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="p-5 flex items-start">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <Icon icon={vehicle.icon} className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-800">{vehicle.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{vehicle.description}</p>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Base: ₱{vehicle.cost}</span>
                        <span className="text-sm font-medium text-slate-600">+ ₱{vehicle.perKmRate}/km</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedVehicle(expandedVehicle === vehicle.id ? null : vehicle.id);
                    }}
                    className="w-full px-4 py-3 border-t border-slate-100 bg-slate-50 hover:bg-slate-100 text-sm font-medium text-indigo-600 flex items-center justify-center transition-colors"
                  >
                    {expandedVehicle === vehicle.id ? (
                      <>
                        <span>Hide Features</span>
                        <ChevronUp className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      <>
                        <span>View Features</span>
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </button>
                  {expandedVehicle === vehicle.id && (
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" />
                          Real-time GPS tracking
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" />
                          Temperature control
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" />
                          Premium insurance
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" />
                          Dedicated concierge
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Premium Service Selection */}
          <div className="bg-slate-50 p-6 rounded-xl mb-8 border border-slate-200">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-slate-800">
              <Clock className="h-6 w-6 mr-2 text-slate-600" />
              Priority Service Tier
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {premiumServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${selectedService === service.id ? 'border-purple-500 bg-purple-50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div className="flex items-center mb-4">
                    <service.icon className={`h-8 w-8 mr-3 ${selectedService === service.id ? 'text-purple-600' : 'text-slate-500'}`} />
                    <h3 className="font-bold text-lg">{service.name}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{service.time} delivery window</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Additional fee</span>
                    <span className="text-lg font-bold text-purple-600">₱{service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platinum Submit Button */}
          <button
            type="submit"
            disabled={sendLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {sendLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Truck className="h-6 w-6 mr-3" />
                Schedule Premium Delivery
              </>
            )}
          </button>
        </form>
      </div>

      {/* Luxury Location Panel */}
      {activeLocation && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-white rounded-t-2xl md:rounded-2xl shadow-2xl animate-slide-up md:animate-scale-in max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                  {activeLocation.type === 'pickup' ? (
                    <>
                      <Home className="h-5 w-5 mr-2 text-indigo-500" />
                      Premium Pickup Details
                    </>
                  ) : (
                    <>
                      <Package className="h-5 w-5 mr-2 text-amber-500" />
                      Platinum Drop-off #{activeLocation.index! + 1}
                    </>
                  )}
                </h2>
                <button
                  onClick={() => setActiveLocation(null)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
              {/* Address Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                  <LocateFixed className="h-4 w-4 mr-2 text-indigo-500" />
                  Premium Location Search
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    name="address"
                    value={
                      activeLocation.type === 'pickup'
                        ? pickup.address
                        : dropoffs[activeLocation.index!].address
                    }
                    onChange={handleAddressSearch}
                    className="w-full p-4 pl-12 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Search luxury location..."
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
                {isLoading && (
                  <div className="mt-2 text-sm text-slate-500 flex items-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2 text-indigo-500" />
                    Searching premium locations...
                  </div>
                )}
                {suggestions.length > 0 && (
                  <div className="mt-2 border border-slate-200 rounded-xl overflow-hidden shadow-lg">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          const location = {
                            formatted_address: suggestion.display_name,
                            geometry: {
                              location: {
                                lat: parseFloat(suggestion.lat),
                                lng: parseFloat(suggestion.lon)
                              }
                            }
                          };
                          selectSuggestion(location);
                        }}
                        className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-none flex items-start"
                      >
                        <MapPin className="h-4 w-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{suggestion.display_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Details Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Suite/Unit #
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="houseNumber"
                        value={
                          activeLocation.type === 'pickup'
                            ? pickup.houseNumber
                            : dropoffs[activeLocation.index!].houseNumber
                        }
                        onChange={(e) =>
                          activeLocation.type === 'pickup'
                            ? handlePickupChange(e)
                            : handleDropoffChange(activeLocation.index!, e)
                        }
                        className="w-full p-4 pl-11 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="Building/Suite"
                      />
                      <Home className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Contact Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="contact"
                        value={
                          activeLocation.type === 'pickup'
                            ? pickup.contact
                            : dropoffs[activeLocation.index!].contact
                        }
                        onChange={(e) =>
                          activeLocation.type === 'pickup'
                            ? handlePickupChange(e)
                            : handleDropoffChange(activeLocation.index!, e)
                        }
                        className="w-full p-4 pl-11 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="+1 (___) ___ ____"
                      />
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {activeLocation.type === 'pickup' ? 'Your Name' : 'Recipient Name'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={
                        activeLocation.type === 'pickup'
                          ? pickup.name
                          : dropoffs[activeLocation.index!].name
                      }
                      onChange={(e) =>
                        activeLocation.type === 'pickup'
                          ? handlePickupChange(e)
                          : handleDropoffChange(activeLocation.index!, e)
                      }
                      className="w-full p-4 pl-11 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="Full name"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={() => setActiveLocation(null)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition font-semibold flex items-center justify-center"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Save Luxury Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Platinum Confirmation Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden mx-4 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">
                  Elite Delivery Confirmation
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
              <ClassicConfirmForm
                order={{
                  sender: {
                    name: pickup.name,
                    address: pickup.address,
                    contact: pickup.contact
                  },
                  recipients: dropoffs.map((dropoff, i) => ({
                    name: dropoff.name,
                    address: dropoff.address,
                    contact: dropoff.contact,
                    distanceKm: distances[i]?.toFixed(2) || '0.00',
                  })),
                  billing: {
                    baseRate: selectedVehicle?.cost || 0,
                    perKmRate: selectedVehicle?.perKmRate || 0,
                    serviceFee: premiumServices.find(s => s.id === selectedService)?.price || '0',
                    total: null, // Will be calculated
                  },
                  service: premiumServices.find(s => s.id === selectedService)?.name || '',
                  vehicle: selectedVehicle?.name || ''
                }}
                onConfirm={confirmOrder}
                onLoading={sendLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsForm;
