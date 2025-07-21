// features/tempUser/tempUserSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TempUserState {
  userId: string | null;
}

const initialState: TempUserState = {
  userId: null,
};

const tempUserSlice = createSlice({
  name: 'tempUser',
  initialState,
  reducers: {
    setTempUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    clearTempUserId: (state) => {
      state.userId = null;
    },
  },
});

export const { setTempUserId, clearTempUserId } = tempUserSlice.actions;
export default tempUserSlice.reducer;

export const selectTempUserId = (state: { tempUser: TempUserState }) => 
  state.tempUser.userId;
