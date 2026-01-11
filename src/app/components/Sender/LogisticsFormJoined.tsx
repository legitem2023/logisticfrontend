'use client';

import { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { VEHICLEQUERY } from '../../../../graphql/query';
import { CREATEDELIVERY } from '../../../../graphql/mutation';
import { showToast } from '../../../../utils/toastify';
import { getDistanceInKm } from '../../../../utils/getDistanceInKm';
import { calculateEta } from '../../../../utils/calculateEta';
import { setActiveIndex } from '../../../../Redux/activeIndexSlice';
import { selectTempUserId } from '../../../../Redux/tempUserSlice';
import LogisticFormLoading from '../Loadings/LogisticFormLoading';
import AnimatedCityscape from '../AnimatedCityscape';
import { useSelector, useDispatch } from "react-redux";
// Import components
import PickupSection from './components/PickupSection';
import DropoffSections from './components/DropoffSections';
import VehicleSelection from './components/VehicleSelection';
import ServiceSelection from './components/ServiceSelection';
import LocationDetailsPanel from './components/LocationDetailsPanel';
import DeliveryConfirmationModal from './components/DeliveryConfirmationModal';
import SuccessMessage from './components/SuccessMessage';

// Import hooks
import useGeocoding from './hooks/useGeocoding';
import useDeliveryValidation from './hooks/useDeliveryValidation';
import useDeliveryCalculation from './hooks/useDeliveryCalculation';

// Types
import type { Location, ActiveLocation } from './types';

// Icons
import {
  Home,
  MapPin,
  Truck,
  Rocket,
  Clock,
  Move
} from 'lucide-react';

// Services data
const SERVICES = [
  { id: 'Priority', name: 'Priority', icon: Rocket, time: '1-3 hours', price: '10' },
  { id: 'Regular', name: 'Regular', icon: Clock, time: 'Same day', price: '5' },
  { id: 'Polling', name: 'Polling', icon: Move, time: 'Multi-day', price: '5' }
];

const LogisticsFormJoined = () => {
  const dispatch = useDispatch();
  const { loading, error, data } = useQuery(VEHICLEQUERY);
  const globalUserId = useSelector(selectTempUserId);
  
  // Form state
  const [pickup, setPickup] = useState<Location>({
    address: '',
    houseNumber: '',
    contact: '',
    name: '',
    lat: null,
    lng: null
  });
  
  const [dropoffs, setDropoffs] = useState<Location[]>([{
    address: '',
    houseNumber: '',
    contact: '',
    name: '',
    lat: null,
    lng: null
  }]);
  
  const [activeLocation, setActiveLocation] = useState<ActiveLocation | null>(null);
  const [selectedService, setSelectedService] = useState<string>('Regular');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [sendLoading, setSendLoading] = useState(false);
  
  // Custom hooks
  const {
    suggestions,
    isLoading: isGeocodingLoading,
    selectedSuggestionCoords,
    typingCoordinates,
    isGeocodingTyping,
    handleAddressSearch,
    selectSuggestion,
    handleUseCurrentLocation,
    validateCoordinates
  } = useGeocoding({ pickup, dropoffs, activeLocation, setPickup, setDropoffs });
  
  const {
    selected,
    selectedVehicle,
    useBaseCost,
    usePerKmCost,
    distances,
    setDistances,
    expandedDetails,
    vehicleDetails,
    toggleDetails
  } = useDeliveryCalculation({ data });
  
  const { validateDelivery } = useDeliveryValidation();
  
  // GraphQL mutations
  const [createDelivery] = useMutation(CREATEDELIVERY, {
    onCompleted: (data) => {
      showToast("Delivery created", 'success');
      setSendLoading(false);
      dispatch(setActiveIndex(3));
    },
    onError: (error) => {
      console.error('Delivery creation error:', error);
      showToast("Failed to create delivery", 'error');
      setSendLoading(false);
    }
  });
  
  // Calculate distances between pickup and dropoffs
  useEffect(() => {
    const calculateDistances = async () => {
      if (pickup.lat && pickup.lng) {
        const calculatedDistances = await Promise.all(
          dropoffs.map(async (dropoff) => {
            if (dropoff.lat && dropoff.lng) {
              try {
                return await getDistanceInKm(
                  { lat: pickup.lat!, lng: pickup.lng! },
                  { lat: dropoff.lat!, lng: dropoff.lng! }
                );
              } catch (error) {
                console.error('Error calculating distance:', error);
                return 0;
              }
            }
            return 0;
          })
        );
        setDistances(calculatedDistances);
      }
    };

    calculateDistances();
  }, [pickup.lat, pickup.lng, dropoffs, setDistances]);
  
  // Location management functions
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
  
  const removeDropoff = (index: number) => {
    if (dropoffs.length <= 1) return;
    const updatedDropoffs = dropoffs.filter((_, i) => i !== index);
    setDropoffs(updatedDropoffs);
  };
  
  const openLocationDetails = (type: 'pickup' | 'dropoff', index: number | null = null) => {
    setActiveLocation({ type, index });
  };
  
  const closeLocationDetails = () => {
    setActiveLocation(null);
  };
  
  const closeDetails = () => {
    setShowDetails(false);
  };
  
  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickup({ ...pickup, [e.target.name]: e.target.value });
  };
  
  const handleDropoffChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedDropoffs = [...dropoffs];
    updatedDropoffs[index] = {
      ...updatedDropoffs[index],
      [e.target.name]: e.target.value
    };
    setDropoffs(updatedDropoffs);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate delivery
    const isValid = await validateDelivery({
      pickup,
      dropoffs,
      selectedVehicle,
      validateCoordinates
    });
    
    if (isValid) {
      setShowDetails(true);
    }
  };
  
  const confirmCommand = async (selectedDriver: any) => {
    const conf = confirm("Are you sure you want to place your order?");
    if (conf) {
      setSendLoading(true);
      
      try {
        for (const [i, dropoff] of dropoffs.entries()) {
          const { eta, etaInMinutes } = calculateEta(parseFloat(distances[i]?.toFixed(2) || '0'), "Priority");
          
          const input = {
            assignedRiderId: null,
            deliveryFee: selectedDriver.cost,
            deliveryType: selectedService,
            dropoffAddress: dropoff.address,
            dropoffLatitude: dropoff.lat,
            dropoffLongitude: dropoff.lng,
            estimatedDeliveryTime: eta,
            eta: etaInMinutes.toString(),
            paymentMethod: "Cash",
            paymentStatus: "Unpaid",
            pickupAddress: pickup.address,
            pickupLatitude: pickup.lat,
            pickupLongitude: pickup.lng,
            recipientName: dropoff.name,
            recipientPhone: dropoff.contact,
            senderId: globalUserId,
            baseRate: parseFloat(useBaseCost?.toString() || '0'),
            distance: parseFloat(distances[i]?.toFixed(2) || '0'),
            perKmRate: parseFloat(usePerKmCost?.toString() || '0')
          };
          
          await createDelivery({ variables: { input } });
        }
      } catch (error) {
        console.error('Error creating deliveries:', error);
        showToast('Failed to create some deliveries', 'error');
      } finally {
        setSendLoading(false);
      }
    }
  };
  
  if (loading) return <LogisticFormLoading />;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 customgrad text-white">
          <AnimatedCityscape>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <Truck className="h-8 w-8 mr-3" />
              Express Delivery Service
            </h1>
            <p className="mt-2 opacity-90">Fast and reliable logistics solutions</p>
          </AnimatedCityscape>
        </div>
        
        <form onSubmit={handleSubmit} className="p-2">
          <PickupSection
            pickup={pickup}
            onOpenLocationDetails={() => openLocationDetails('pickup')}
          />
          
          <DropoffSections
            dropoffs={dropoffs}
            onOpenLocationDetails={openLocationDetails}
            onAddDropoff={addDropoff}
            onRemoveDropoff={removeDropoff}
          />
          
          <VehicleSelection
            vehicles={data.getVehicleTypes}
            selected={selected}
            expandedDetails={expandedDetails}
            onVehicleSelect={vehicleDetails}
            onToggleDetails={toggleDetails}
          />
          
          <ServiceSelection
            services={SERVICES}
            selectedService={selectedService}
            onServiceSelect={setSelectedService}
          />
          
          <button
            type="submit"
            className="w-full customgrad text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center font-medium text-lg"
          >
            <Truck className="h-5 w-5 mr-2" />
            Schedule Delivery
          </button>
        </form>
      </div>
      
      {/* Location Details Panel */}
      {activeLocation && (
        <LocationDetailsPanel
          activeLocation={activeLocation}
          pickup={pickup}
          dropoffs={dropoffs}
          suggestions={suggestions}
          isGeocodingLoading={isGeocodingLoading}
          isGeocodingTyping={isGeocodingTyping}
          selectedSuggestionCoords={selectedSuggestionCoords}
          typingCoordinates={typingCoordinates}
          onClose={closeLocationDetails}
          onAddressSearch={handleAddressSearch}
          onSelectSuggestion={selectSuggestion}
          onUseCurrentLocation={handleUseCurrentLocation}
          onPickupChange={handlePickupChange}
          onDropoffChange={handleDropoffChange}
        />
      )}
      
      {/* Success Message */}
      {showSuccess && <SuccessMessage />}
      
      {/* Delivery Confirmation Modal */}
      {showDetails && (
        <DeliveryConfirmationModal
          pickup={pickup}
          dropoffs={dropoffs}
          distances={distances}
          useBaseCost={useBaseCost}
          usePerKmCost={usePerKmCost}
          onClose={closeDetails}
          onConfirm={confirmCommand}
          isLoading={sendLoading}
        />
      )}
    </div>
  );
};

export default LogisticsFormJoined;
