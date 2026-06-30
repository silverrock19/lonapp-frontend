import { createSlice } from '@reduxjs/toolkit';
import { calcPricing } from '../../lib/mock/orderServices.js';

let _orderCounter = 1000;

function genOrderId() {
  _orderCounter += 1;
  return 'ORD-2026-06-' + String(_orderCounter);
}

const emptyDraft = {
  id: null,
  outlet: null,
  turnaround: 'standard',
  entryMode: 'itemized',
  items: [],
  subtotal: 0,
  surcharge: 0,
  pickupFee: 15,
  deliveryFee: 15,
  vat: 0,
  total: 0,
  pickupAddress: null,
  pickupDate: null,
  pickupSlot: null,
  deliveryAddress: null,
  deliveryDate: null,
  deliverySlot: null,
  notes: '',
  status: 'draft',
  createdAt: null,
};

function recompute(state) {
  const p = calcPricing(state.draft.items, state.draft.turnaround, state.draft.outlet);
  state.draft.subtotal    = p.subtotal;
  state.draft.surcharge   = p.surcharge;
  state.draft.pickupFee   = p.pickupFee;
  state.draft.deliveryFee = p.deliveryFee;
  state.draft.vat         = p.vat;
  state.draft.total       = p.total;
}

const orderSlice = createSlice({
  name: 'order',
  initialState: { draft: { ...emptyDraft }, placed: [] },
  reducers: {
    startDraft: (state, action) => {
      state.draft = {
        ...emptyDraft,
        id: genOrderId(),
        outlet: action.payload,
        pickupFee:   action.payload?.pickupFee   ?? 15,
        deliveryFee: action.payload?.deliveryFee ?? 15,
        createdAt: 'now',
      };
    },
    setTurnaround: (state, action) => {
      state.draft.turnaround = action.payload;
      recompute(state);
    },
    setItem: (state, action) => {
      const { id, name, unitPrice, category, qty } = action.payload;
      const idx = state.draft.items.findIndex(i => i.id === id);
      if (qty <= 0) {
        if (idx >= 0) state.draft.items.splice(idx, 1);
      } else if (idx >= 0) {
        state.draft.items[idx].qty = qty;
      } else {
        state.draft.items.push({ id, name, unitPrice, category, qty });
      }
      recompute(state);
    },
    setPickup: (state, action) => {
      const { address, date, slot } = action.payload;
      state.draft.pickupAddress = address;
      state.draft.pickupDate    = date;
      state.draft.pickupSlot    = slot;
    },
    setDelivery: (state, action) => {
      const { address, date, slot } = action.payload;
      state.draft.deliveryAddress = address;
      state.draft.deliveryDate    = date;
      state.draft.deliverySlot    = slot;
    },
    setNotes: (state, action) => {
      state.draft.notes = action.payload;
    },
    placeOrder: (state) => {
      if (state.draft.id) {
        state.placed.push({ ...state.draft, status: 'placed' });
      }
      state.draft = { ...emptyDraft };
    },
    clearDraft: (state) => {
      state.draft = { ...emptyDraft };
    },
    upgradeTurnaround: (state, action) => {
      state.draft.turnaround = action.payload;
      recompute(state);
    },
  },
});

export const {
  startDraft, setTurnaround, setItem, setPickup, setDelivery,
  setNotes, placeOrder, clearDraft, upgradeTurnaround,
} = orderSlice.actions;

export const selectDraft      = (state) => state.order.draft;
export const selectPlaced     = (state) => state.order.placed;
export const selectDraftItems = (state) => state.order.draft.items;

export default orderSlice.reducer;
