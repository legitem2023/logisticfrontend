/*'use client'
import { configureStore } from '@reduxjs/toolkit';
import DrawerReducer from './drawerSlice';
import deliveryReducer from './deliverySlice';
import VehicleReducer from './vehicleSlice';
import locationReducer from './locationSlice';
import tempUserReducer from './tempUserSlice';
import activeIndexReducer from './activeIndexSlice';
import roleReducer from './roleSlice';
import usernameReducer from './usernameSlice';
const store = configureStore({
  reducer: {
    drawer:DrawerReducer,
    delivery:deliveryReducer,
    vehicle:VehicleReducer,
    location: locationReducer,
    tempUser:tempUserReducer,
    activeIndex:activeIndexReducer,
    role:roleReducer,
    username:usernameReducer
  },
});

export default store;*/
// store.js
'use client'
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import DrawerReducer from './drawerSlice';
import deliveryReducer from './deliverySlice';
import VehicleReducer from './vehicleSlice';
import locationReducer from './locationSlice';
import tempUserReducer from './tempUserSlice';
import activeIndexReducer from './activeIndexSlice';
import roleReducer from './roleSlice';
import usernameReducer from './usernameSlice';

// Persist configuration for activeIndex only
const activeIndexPersistConfig = {
  key: 'activeIndex',
  storage,
};

// Only persist the activeIndex reducer
const persistedActiveIndexReducer = persistReducer(activeIndexPersistConfig, activeIndexReducer);

// Configure store
export const store = configureStore({
  reducer: {
    drawer: DrawerReducer,
    delivery: deliveryReducer,
    vehicle: VehicleReducer,
    location: locationReducer,
    tempUser: tempUserReducer,
    activeIndex: activeIndexReducer, // Only this one is persisted
    role: roleReducer,
    username: usernameReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);
export default store;
