// store/vehicleSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VehicleState {
  selectedVehicle: string;
}

const initialState: VehicleState = {
  selectedVehicle: '',
};

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    setSelectedVehicle: (state, action: PayloadAction<string>) => {
      state.selectedVehicle = action.payload;
    },
    clearSelectedVehicle: (state) => {
      state.selectedVehicle = null;
    },
  },
});

export const { setSelectedVehicle, clearSelectedVehicle } = vehicleSlice.actions;
export default vehicleSlice.reducer;
