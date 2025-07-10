import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DeliveryDetails {
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  pickupContact: string;
  pickupHouseNumber: string;
  pickupUnitNumber: string;

  dropoffAddress: string;
  dropoffLatitude: number;
  dropoffLongitude: number;
  dropoffContact: string;
  dropoffHouseNumber: string;
  dropoffUnitNumber: string;
}

const initialState: DeliveryDetails = {
  pickupAddress: '',
  pickupLatitude: 0,
  pickupLongitude: 0,
  pickupContact: '',
  pickupHouseNumber: '',
  pickupUnitNumber: '',

  dropoffAddress: '',
  dropoffLatitude: 0,
  dropoffLongitude: 0,
  dropoffContact: '',
  dropoffHouseNumber: '',
  dropoffUnitNumber: '',
};

export const deliverySlice = createSlice({
  name: 'deliveryDetails',
  initialState,
  reducers: {
    setPickupDetails(state, action: PayloadAction<{
      address: string;
      latitude: number;
      longitude: number;
      contact: string;
      houseNumber: string;
      unitNumber: string;
    }>) {
      state.pickupAddress = action.payload.address;
      state.pickupLatitude = action.payload.latitude;
      state.pickupLongitude = action.payload.longitude;
      state.pickupContact = action.payload.contact;
      state.pickupHouseNumber = action.payload.houseNumber;
      state.pickupUnitNumber = action.payload.unitNumber;
    },
    setDropoffDetails(state, action: PayloadAction<{
      address: string;
      latitude: number;
      longitude: number;
      contact: string;
      houseNumber: string;
      unitNumber: string;
    }>) {
      state.dropoffAddress = action.payload.address;
      state.dropoffLatitude = action.payload.latitude;
      state.dropoffLongitude = action.payload.longitude;
      state.dropoffContact = action.payload.contact;
      state.dropoffHouseNumber = action.payload.houseNumber;
      state.dropoffUnitNumber = action.payload.unitNumber;
    },
    clearDeliveryDetails(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setPickupDetails, setDropoffDetails, clearDeliveryDetails } = deliverySlice.actions;

export default deliverySlice.reducer;
