import { setIsLoading, setError, nextStep, resetOnboarding } from '../slices/onboardingSlice.js';
import { setIsAuthenticated, setUser, setTokens } from '../slices/authSlice.js';
import { store } from '../index.js';
import * as onboardingApi from '../../api/onboarding.api.js';

export const submitStep = async (stepKey, payload) => {
  store.dispatch(setIsLoading(true));
  store.dispatch(setError(null));
  try {
    await onboardingApi.saveStepApi(stepKey, payload);
    store.dispatch(nextStep());
    return true;
  } catch (err) {
    store.dispatch(setError(err?.response?.data?.message || 'Something went wrong'));
    return false;
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const completeOnboarding = async (payload) => {
  store.dispatch(setIsLoading(true));
  store.dispatch(setError(null));
  try {
    const data = await onboardingApi.completeOnboardingApi(payload);
    // After wizard completes, the business is created and admin account set up.
    // If the API returns session tokens, log the user in directly.
    if (data?.accessToken) {
      store.dispatch(setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken }));
      store.dispatch(setUser(data.user));
      store.dispatch(setIsAuthenticated(true));
    }
    store.dispatch(resetOnboarding());
    return true;
  } catch (err) {
    store.dispatch(setError(err?.response?.data?.message || 'Registration failed'));
    return false;
  } finally {
    store.dispatch(setIsLoading(false));
  }
};
