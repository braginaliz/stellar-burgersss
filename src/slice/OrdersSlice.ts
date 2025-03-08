import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { IBurgerConstructorState}  from './ConstructorSlice';

type TOrdersState = {
  error: string | null | undefined;
  orderResponse: {
    order: TOrder | null;
  };
  orderRequest: boolean;
};

const initialState: TOrdersState = {
  error: null,
  orderResponse: {
    order: null
  },
  orderRequest: false
};

export const createOrder = createAsyncThunk(
  'orders/orderBurger',
  async (items: IBurgerConstructorState) => {
    let orderData: string[] = [];
    if (items.constructorItems.bun && items.constructorItems.ingredients.length > 0) {
      orderData.push(items.constructorItems.bun._id);
      orderData.push(items.constructorItems.bun._id);
      items.constructorItems.ingredients.forEach((item) => orderData.push(item._id));
    }
    return orderBurgerApi(orderData!);
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderResponse: (state) => {
      state.orderResponse.order = null;
    }
  },
  selectors: {
    selectOrderResponse: (state) => state.orderResponse.order,
    selectOrderRequest: (state) => state.orderRequest
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.error = null;
        state.orderRequest = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.error.message;
        state.orderRequest = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderResponse.order = action.payload.order;
      });
  }
});

export const ordersReducer = ordersSlice.reducer;

export const { selectOrderRequest, selectOrderResponse } =
  ordersSlice.selectors;

export const { resetOrderResponse } = ordersSlice.actions;