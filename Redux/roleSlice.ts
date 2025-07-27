import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RoleState {
  role: string | null;
}

const initialState: RoleState = {
  role: null,
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
    clearRole: (state) => {
      state.role = null;
    },
  },
});

export const { setRole, clearRole } = roleSlice.actions;

export const selectRole = (state: { role: RoleState }) => state.role.role;

export default roleSlice.reducer;
