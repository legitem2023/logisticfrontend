'use client'
import { configureStore } from '@reduxjs/toolkit';
import DrawerReducer from './drawerSlice';
import DeliveryReducer from './deliverySlice'
const store = configureStore({
  reducer: {
    drawer:DrawerReducer,
    delivery:DeliveryReducer
  },
});

export default store;
