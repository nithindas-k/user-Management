
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'authUser',
  initialState: {
    isLoggedIn: false,
    id: null,
    name: null, 
    email: null, 
    role: null,
    token: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.isLoggedIn = true;
      state.id = action.payload.id;
      state.name = action.payload.name; 
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
    clearUser: (state) => {
      state.isLoggedIn = false;
      state.id = null;
      state.name = null; 
      state.email = null;
      state.role = 'user';
      state.token = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;