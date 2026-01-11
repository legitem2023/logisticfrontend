import { showToast } from '../../../../../utils/toastify';
import { Location } from '../types';

export const useDeliveryValidation = () => {
  const validatePickup = (pickup: Location): boolean => {
    if (!pickup || typeof pickup !== 'object') {
      showToast("Pickup data is missing or invalid", 'warning');
      return false;
    }

    if (!pickup.address) {
      showToast("Please enter a pickup address", 'warning');
      return false;
    }

    if (!pickup.houseNumber) {
      showToast("Please enter a house number", 'warning');
      return false;
    }

    if (!pickup.contact) {
      showToast("Please enter a contact number", 'warning');
      return false;
    }

    if (!pickup.name) {
      showToast("Please enter the sender's name", 'warning');
      return false;
    }

    if (typeof pickup.lat !== 'number') {
      showToast("Pickup latitude is missing or invalid", 'warning');
      return false;
    }

    if (typeof pickup.lng !== 'number') {
      showToast("Pickup longitude is missing or invalid", 'warning');
      return false;
    }

    return true;
  };

  const validateDropoffs = (dropoffs: Location[]): boolean => {
    for (const [index, dropoff] of dropoffs.entries()) {
      if (!dropoff.address) {
        showToast(`Please enter a dropoff address for location #${index + 1}`, 'warning');
        return false;
      }
    }
    return true;
  };

  const validateVehicle = (selectedVehicle: string): boolean => {
    if (!selectedVehicle) {
      showToast('Please select a vehicle type', 'warning');
      return false;
    }
    return true;
  };

  const validateDelivery = async ({
    pickup,
    dropoffs,
    selectedVehicle,
    validateCoordinates
  }: {
    pickup: Location;
    dropoffs: Location[];
    selectedVehicle: string;
    validateCoordinates: (location: Location) => Promise<Location | null>;
  }): Promise<boolean> => {
    // Validate and get coordinates if missing
    const validatedPickup = await validateCoordinates(pickup);
    if (!validatedPickup) {
      showToast("Could not find coordinates for pickup address. Please select from suggestions or use current location.", 'warning');
      return false;
    }
    
    const validatedDropoffs = await Promise.all(
      dropoffs.map(async (dropoff) => {
        const validated = await validateCoordinates(dropoff);
        if (!validated) {
          showToast(`Could not find coordinates for dropoff: ${dropoff.address}. Please select from suggestions.`, 'warning');
        }
        return validated;
      })
    );
    
    if (validatedDropoffs.includes(null)) return false;
    
    // Validate form fields
    if (!validatePickup(validatedPickup)) return false;
    if (!validateDropoffs(validatedDropoffs as Location[])) return false;
    if (!validateVehicle(selectedVehicle)) return false;
    
    return true;
  };

  return {
    validatePickup,
    validateDropoffs,
    validateVehicle,
    validateDelivery
  };
};

export default useDeliveryValidation;
