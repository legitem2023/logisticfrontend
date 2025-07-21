// features/tempUser/tempUserSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TempUserState {
  userId: string | null;
  expiry: number | null;
}

const initialState: TempUserState = {
  userId: null,
  expiry: null,
};

const tempUserSlice = createSlice({
  name: 'tempUser',
  initialState,
  reducers: {
    setTempUserId: (state, action: PayloadAction<{ userId: string; ttl?: number }>) => {
      const ttl = action.payload.ttl || 5 * 60 * 1000; // Default 5 minutes
      state.userId = action.payload.userId;
      state.expiry = Date.now() + ttl;
    },
    clearTempUserId: (state) => {
      state.userId = null;
      state.expiry = null;
    },
  },
});

export const { setTempUserId, clearTempUserId } = tempUserSlice.actions;

// Selector with auto-clear logic
export const selectTempUserId = (state: { tempUser: TempUserState }) => {
  const { userId, expiry } = state.tempUser;
  
  if (userId && expiry && Date.now() > expiry) {
    store.dispatch(clearTempUserId());
    return null;
  }
  
  return userId;
};

export default tempUserSlice.reducer;
