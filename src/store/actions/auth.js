import { setIsLoading, setIsAuthenticated, setUser, setTokens, setAuthError, resetAuth } from '../slices/authSlice.js';
import { store } from '../index.js';
import * as authApi from '../../api/auth.api.js';

export const login = async ({ email, password }) => {
  store.dispatch(setIsLoading(true));
  store.dispatch(setAuthError(null));
  try {
    const data = await authApi.loginApi({ email, password });
    store.dispatch(setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken }));
    store.dispatch(setUser(data.user));
    store.dispatch(setIsAuthenticated(true));
    return true;
  } catch (err) {
    store.dispatch(setAuthError(err?.response?.data?.message || 'Login failed'));
    return false;
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const verifyOTP = async ({ email, otp, context }) => {
  store.dispatch(setIsLoading(true));
  store.dispatch(setAuthError(null));
  try {
    const data = await authApi.verifyOtpApi({ email, otp, context });
    return { success: true, data };
  } catch (err) {
    store.dispatch(setAuthError(err?.response?.data?.message || 'Invalid OTP'));
    return { success: false };
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const logout = async () => {
  try {
    await authApi.logoutApi();
  } catch {
    // Never block logout on server error
  }
  store.dispatch(resetAuth());
};
