'use client'
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isActiveUser: false, // default value
};

const isActiveUserSlice = createSlice({
  name: 'isActiveUser',
  initialState,
  reducers: {
    setIsActiveUser: (state, action) => {
      state.isActiveUser = action.payload;
    },
    activateUser: (state) => {
      state.isActiveUser = true;
    },
    deactivateUser: (state) => {
      state.isActiveUser = false;
    },
  },
});

export const { setIsActiveUser, activateUser, deactivateUser } = isActiveUserSlice.actions;
export default isActiveUserSlice.reducer;
