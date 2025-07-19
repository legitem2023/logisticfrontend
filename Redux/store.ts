'use client'
import { configureStore } from '@reduxjs/toolkit';
import DrawerReducer from './drawerSlice';
import deliveryReducer from './deliverySlice'
import VehicleReducer from './vehicleSlice';
import locationReducer from './locationSlice';

const store = configureStore({
  reducer: {
    drawer:DrawerReducer,
    delivery:deliveryReducer,
    vehicle:VehicleReducer,
    location: locationReducer,
  },
});

export default store;
