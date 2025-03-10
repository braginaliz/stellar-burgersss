import {
  orderBurgerApi,
  getFeedsApi,
  getOrdersApi
} from '../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TOrder
} from '@utils-types';

type TInitialStateOrders = {
  orders: TOrder[];
  totalOrders: number;
  ordersToday: number;
  userOrders: TOrder[] | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialStateOrders: TInitialStateOrders = {
  orders: [],
  totalOrders: 0,
  ordersToday: 0,
  userOrders: null,
  orderRequest: false,
  orderModalData: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: initialStateOrders,
  reducers: {
    closeOrderRequest(state) {
      state.orderRequest = false;
      state.orderModalData = null;
    },
    removeOrders(state) {
      state.orders.length = 0;
    },
    removeUserOrders(state) {
      state.userOrders = null;
    },
    openModal(state) {
      state.orderModalData = null; // Could add any modal logic here if needed
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchNewOrder.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(fetchNewOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(fetchFeed.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.ordersToday = action.payload.totalToday;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.userOrders = action.payload;
      });
  }
});

export const fetchNewOrder = createAsyncThunk(
  'orders/newOrder',
  async (data: string[]) => orderBurgerApi(data)
);

export const fetchFeed = createAsyncThunk('user/feed', async () =>
  getFeedsApi()
);

export const fetchUserOrders = createAsyncThunk('user/orders', async () =>
  getOrdersApi()
);

export const { 
  closeOrderRequest, 
  removeOrders, 
  removeUserOrders, 
  openModal 
} = ordersSlice.actions;

export const selectOrders = (state) => state.orders.orders;
export const selectTotalOrders = (state) => state.orders.totalOrders;
export const selectTodayOrders = (state) => state.orders.ordersToday;
export const selectUserOrders = (state) => state.orders.userOrders;
export const selectOrderRequest = (state) => state.orders.orderRequest;
export const selectOrderModalData = (state) => state.orders.orderModalData;
export default ordersSlice.reducer;
