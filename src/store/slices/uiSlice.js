import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],     // [{ id, type, message, duration }]
  modalOpen: false,
  modalContent: null,
};

let nextToastId = 1;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.toasts.push({
        id: nextToastId++,
        type: 'info', // success | warning | error | info
        duration: 4000,
        ...action.payload,
      });
    },
    dismissToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    openModal: (state, action) => {
      state.modalOpen = true;
      state.modalContent = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.modalContent = null;
    },
  },
});

export const { showToast, dismissToast, openModal, closeModal } = uiSlice.actions;

export const selectToasts = (state) => state.ui.toasts;
export const selectModalOpen = (state) => state.ui.modalOpen;
export const selectModalContent = (state) => state.ui.modalContent;

export default uiSlice.reducer;
