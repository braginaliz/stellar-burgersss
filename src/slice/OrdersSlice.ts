import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi, orderBurgerApi } from '../utils/burger-api';
import { TOrder } from '@utils-types';

interface OrderState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
  orderModalData: TOrder | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  orderModalData: null
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (orderId: number) => {
    const orders = await getOrdersApi();
    const order = orders.find((o: TOrder) => o.number === orderId);
    return order || null;
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[]) => {
    const order = await orderBurgerApi(ingredients);
    return order;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orderModalData = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload.order);
      });
  }
});

export default orderSlice.reducer;
