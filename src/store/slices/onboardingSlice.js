import { createSlice } from '@reduxjs/toolkit';

// Transient wizard state — NOT persisted. Cleared after registration completes.
// Tracks the 5-step business registration wizard (EP-01: US-0001 to US-0005).
const initialState = {
  currentStep: 0, // 0-indexed: 0=Company Info, 1=Outlets, 2=Services, 3=Payment, 4=Admin Account
  isLoading: false,
  error: null,
  formData: {
    companyInfo: {},   // US-0001
    outlets: [],       // US-0002
    services: {},      // US-0003
    payment: {},       // US-0004
    adminAccount: {},  // US-0005
  },
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setStep: (state, action) => { state.currentStep = action.payload; },
    nextStep: (state) => { state.currentStep = Math.min(state.currentStep + 1, 4); },
    prevStep: (state) => { state.currentStep = Math.max(state.currentStep - 1, 0); },
    setStepData: (state, action) => {
      const { step, data } = action.payload;
      state.formData[step] = { ...state.formData[step], ...data };
    },
    setIsLoading: (state, action) => { state.isLoading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
    resetOnboarding: () => initialState,
  },
});

export const { setStep, nextStep, prevStep, setStepData, setIsLoading, setError, resetOnboarding } = onboardingSlice.actions;

export const selectCurrentStep = (state) => state.onboarding.currentStep;
export const selectOnboardingData = (state) => state.onboarding.formData;
export const selectOnboardingLoading = (state) => state.onboarding.isLoading;
export const selectOnboardingError = (state) => state.onboarding.error;

export default onboardingSlice.reducer;
