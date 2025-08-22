// store/features/usernameSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UsernameState {
  value: string | null;
}

const initialState: UsernameState = {
  value: null,
};

export const usernameSlice = createSlice({
  name: 'username',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    resetUsername: (state) => {
      state.value = null;
    },
  },
});

export const { setUsername, resetUsername } = usernameSlice.actions;
export default usernameSlice.reducer;
