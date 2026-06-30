import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
const storage = {
  getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
};
import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice.js';
import onboardingReducer from './slices/onboardingSlice.js';
import uiReducer from './slices/uiSlice.js';
import orderReducer from './slices/orderSlice.js';

const authPersistConfig = {
  key: '__lonapp_auth__',
  storage,
  whitelist: ['isAuthenticated', 'user', 'accessToken', 'refreshToken'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  onboarding: onboardingReducer, // transient — not persisted
  ui: uiReducer,
  order: orderReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
