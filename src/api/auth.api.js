import client from './client.js';

export const loginApi = (payload) => client.post('/auth/login', payload).then((r) => r.data);
export const logoutApi = () => client.post('/auth/logout').then((r) => r.data);
export const verifyOtpApi = (payload) => client.post('/auth/verify-otp', payload).then((r) => r.data);
export const forgotPasswordApi = (payload) => client.post('/auth/forgot-password', payload).then((r) => r.data);
export const resetPasswordApi = (payload) => client.post('/auth/reset-password', payload).then((r) => r.data);
