import client from './client.js';

export const saveStepApi = (step, payload) => client.post(`/onboarding/${step}`, payload).then((r) => r.data);
export const completeOnboardingApi = (payload) => client.post('/onboarding/complete', payload).then((r) => r.data);
