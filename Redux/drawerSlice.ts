'use client'
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  drawer: true,
};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    setDrawer: (state, action) => {
      state.drawer = action.payload;
    },
    closeDrawer: (state) => {
      state.drawer = false;
    },
  },
});


export const { setDrawer, closeDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;
