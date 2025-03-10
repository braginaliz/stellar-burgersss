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
  isModalOpened: boolean;
};

const initialStateOrders: TInitialStateOrders = {
  orders: [],
  totalOrders: 0,
  ordersToday: 0,
  userOrders: null,
  orderRequest: false,
  orderModalData: null,
  isModalOpened: false,
};


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
      state.orderModalData = null; 
    },
    closeModal(state) {
      state.isModalOpened = false;
    },
  },
  selectors: {
   
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrders: (state) => state.orders,
    selectTotalOrders: (state) => state.totalOrders,
    selectTodayOrders: (state) => state.ordersToday,
    selectUserOrders: (state) => state.userOrders,
    selectIsModalOpened: (state) => state.isModalOpened,
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


export const { 
  closeOrderRequest, 
  removeOrders, 
  removeUserOrders, 
  openModal ,
  closeModal
} = ordersSlice.actions;

export const { selectOrderModalData,
  selectOrderRequest,
  selectOrders,
  selectTotalOrders,
  selectTodayOrders,
  selectUserOrders,selectIsModalOpened} = ordersSlice.selectors;
export default ordersSlice.reducer;
