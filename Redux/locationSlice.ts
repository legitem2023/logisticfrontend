// store/locationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationState = {
  current: Coordinates | null;
};

const initialState: LocationState = {
  current: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<Coordinates>) => {
      state.current = action.payload;
    },
    resetLocation: (state) => {
      state.current = null;
    },
  },
});

export const { setCurrentLocation, resetLocation } = locationSlice.actions;

export default locationSlice.reducer;
