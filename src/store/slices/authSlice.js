import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,          // { id, name, email, phone, role }
  accessToken: null,
  refreshToken: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoading: (state, action) => { state.isLoading = action.payload; },
    setIsAuthenticated: (state, action) => { state.isAuthenticated = action.payload; },
    setUser: (state, action) => { state.user = action.payload; },
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setAuthError: (state, action) => { state.error = action.payload; },
    resetAuth: () => initialState,
  },
});

export const { setIsLoading, setIsAuthenticated, setUser, setTokens, setAuthError, resetAuth } = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthLoading = (state) => state.auth.isLoading;

export default authSlice.reducer;
