'use client'
import { configureStore } from '@reduxjs/toolkit';
import DrawerReducer from './drawerSlice'
const store = configureStore({
  reducer: {
    drawer:DrawerReducer
  },
});

export default store;
