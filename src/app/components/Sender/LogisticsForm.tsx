"use client";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Loader2, Truck, ArrowLeft } from "lucide-react";
import { showToast } from "../../../utils/toastify";
import { GET_VEHICLES } from "../../../graphql/query";
import { SEND_DELIVERY_REQUEST } from "../../../graphql/mutation";
import DeliverySteps from "./DeliverySteps";
import PickupForm from "./PickupForm";
import DropoffForm from "./DropoffForm";
import VehicleForm from "./VehicleForm";
import ServiceForm from "./ServiceForm";
import ConfirmDetails from "./ConfirmDetails";
import { useRouter } from "next/navigation";

// --- Validation helpers ---
const validatePickup = (pickup: any) => {
  return (
    pickup.address.trim() !== "" &&
    pickup.lat !== null &&
    pickup.lng !== null &&
    pickup.contact.trim() !== "" &&
    pickup.name.trim() !== ""
  );
};

const validateDropoffs = (dropoffs: any[]) => {
  return dropoffs.every(
    (drop) =>
      drop.address.trim() !== "" &&
      drop.lat !== null &&
      drop.lng !== null &&
      drop.contact.trim() !== "" &&
      drop.name.trim() !== ""
  );
};

const validateVehicle = (vehicle: any) => {
  return vehicle !== null;
};

export default function LogisticsForm() {
  const [step, setStep] = useState(1);
  const [pickup, setPickup] = useState({
    address: "",
    house: "",
    contact: "",
    name: "",
    lat: null,
    lng: null,
  });
  const [dropoffs, setDropoffs] = useState([
    { address: "", house: "", contact: "", name: "", lat: null, lng: null },
  ]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedService, setSelectedService] = useState("Regular");
  const [activeLocation, setActiveLocation] = useState(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const router = useRouter();

  // --- Apollo ---
  const { data: vehicleData, loading: vehicleLoading } = useQuery(GET_VEHICLES);
  const [sendDeliveryRequest, { loading: sendLoading }] = useMutation(SEND_DELIVERY_REQUEST);

  // --- Computed Validations ---
  const isPickupValid = validatePickup(pickup);
  const areDropoffsValid = validateDropoffs(dropoffs);
  const isVehicleValid = validateVehicle(selectedVehicle);
  const isFormValid = isPickupValid && areDropoffsValid && isVehicleValid;

  // --- Address suggestion selection (forces lat/lng) ---
  const selectSuggestion = (suggestion: any) => {
    const address = suggestion.formatted_address;
    const coords = suggestion.geometry.location;

    if (activeLocation?.type === "pickup") {
      setPickup({ ...pickup, address, lat: coords.lat, lng: coords.lng });
    } else if (activeLocation?.index !== null) {
      const updatedDropoffs = [...dropoffs];
      updatedDropoffs[activeLocation.index] = {
        ...updatedDropoffs[activeLocation.index],
        address,
        lat: coords.lat,
        lng: coords.lng,
      };
      setDropoffs(updatedDropoffs);
    }
    setSuggestions([]);
  };

  // --- Submit Handler ---
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isFormValid) {
      showToast("Please complete all required fields.", "error");
      return;
    }

    try {
      await sendDeliveryRequest({
        variables: {
          input: {
            pickup,
            dropoffs,
            vehicleId: selectedVehicle.id,
            service: selectedService,
            total: 0, // TODO: replace with actual computed total
          },
        },
      });
      showToast("Delivery request sent!", "success");
      router.push("/user-dashboard");
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  // --- Navigation Guards ---
  const handleNext = () => {
    if (step === 1 && !isPickupValid) {
      showToast("Please complete pickup details.", "error");
      return;
    }
    if (step === 2 && !areDropoffsValid) {
      showToast("Please complete all dropoff details.", "error");
      return;
    }
    if (step === 3 && !isVehicleValid) {
      showToast("Please select a vehicle.", "error");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Schedule a Delivery
      </h2>

      <DeliverySteps step={step} />

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <PickupForm
            pickup={pickup}
            setPickup={setPickup}
            setActiveLocation={setActiveLocation}
            suggestions={suggestions}
            setSuggestions={setSuggestions}
            selectSuggestion={selectSuggestion}
          />
        )}

        {step === 2 && (
          <DropoffForm
            dropoffs={dropoffs}
            setDropoffs={setDropoffs}
            setActiveLocation={setActiveLocation}
            suggestions={suggestions}
            setSuggestions={setSuggestions}
            selectSuggestion={selectSuggestion}
          />
        )}

        {step === 3 && (
          <VehicleForm
            vehicles={vehicleData?.getVehicles || []}
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
            loading={vehicleLoading}
          />
        )}

        {step === 4 && (
          <ServiceForm
            selectedService={selectedService}
            setSelectedService={setSelectedService}
          />
        )}

        {step === 5 && (
          <ConfirmDetails
            pickup={pickup}
            dropoffs={dropoffs}
            vehicle={selectedVehicle}
            service={selectedService}
          />
        )}

        {/* --- Navigation Buttons --- */}
        <div className="mt-8 flex justify-between items-center">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </button>
          )}

          {step < 5 && (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-6 py-3 rounded-xl customgrad text-white font-semibold shadow-md hover:opacity-90 transition"
            >
              Next
            </button>
          )}

          {step === 5 && (
            <button
              type="submit"
              disabled={!isFormValid || sendLoading}
              className={`w-full py-3 px-4 rounded-xl flex items-center justify-center font-medium text-lg ${
                isFormValid
                  ? "customgrad text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {sendLoading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : (
                <Truck className="h-5 w-5 mr-2" />
              )}
              Schedule Delivery
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
