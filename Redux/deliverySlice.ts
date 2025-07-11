import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DropoffDetail {
  dropoffAddress: string;
  dropoffLatitude: number;
  dropoffLongitude: number;
  dropoffContact: string;
  dropoffHouseNumber: string;
  dropoffReciever: string;
}

interface DeliveryDetails {
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  pickupContact: string;
  pickupHouseNumber: string;
  pickupSender: string;
  dropoffs: DropoffDetail[]; // Now supports multiple dropoffs
  vehicleId: string;
  deliveryOption: string;
}

const initialState: DeliveryDetails = {
  pickupAddress: '',
  pickupLatitude: 0,
  pickupLongitude: 0,
  pickupContact: '',
  pickupHouseNumber: '',
  pickupSender: '',
  dropoffs: [], // Initialize as empty array
  vehicleId: '',
  deliveryOption: ''
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
      name: string;
      vehicle: string;
      deliveryOption: string;
    }>) {
      state.pickupAddress = action.payload.address;
      state.pickupLatitude = action.payload.latitude;
      state.pickupLongitude = action.payload.longitude;
      state.pickupContact = action.payload.contact;
      state.pickupHouseNumber = action.payload.houseNumber;
      state.pickupSender = action.payload.name;
      state.vehicleId = action.payload.vehicle;
      state.deliveryOption = action.payload.deliveryOption;
    },
    addDropoffDetails(state, action: PayloadAction<{
      address: string;
      latitude: number;
      longitude: number;
      contact: string;
      houseNumber: string;
      name: string;
    }>) {
      state.dropoffs.push({
        dropoffAddress: action.payload.address,
        dropoffLatitude: action.payload.latitude,
        dropoffLongitude: action.payload.longitude,
        dropoffContact: action.payload.contact,
        dropoffHouseNumber: action.payload.houseNumber,
        dropoffReciever: action.payload.name
      });
    },
    clearDeliveryDetails(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { 
  setPickupDetails, 
  addDropoffDetails, 
  clearDeliveryDetails 
} = deliverySlice.actions;

export default deliverySlice.reducer;