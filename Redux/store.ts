'use client'
import { configureStore } from '@reduxjs/toolkit';
import DrawerReducer from './drawerSlice';
import DeliveryReducer from './deliverySlice'
import VehicleReducer from './vehicleSlice';
const store = configureStore({
  reducer: {
    drawer:DrawerReducer,
    delivery:DeliveryReducer,
    vehicle:VehicleReducer
  },
});

export default store;
