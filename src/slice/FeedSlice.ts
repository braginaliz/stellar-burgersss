import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

// Определение интерфейса состояния
export interface TFeedState {
  ordersList: TOrder[];
  totalCount: number;
  totalTodayCount: number;
  error: string | null;
}

// Начальное состояние
export const initialState: TFeedState = {
  ordersList: [],
  totalCount: 0,
  totalTodayCount: 0,
  error: null,
};

// Асинхронный thunk 
export const fetchFeedsData = createAsyncThunk('feeds/fetchFeedsData', async () => {
  const response = await getFeedsApi();
  return response; 
});

// Создание слайса
export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedsData.pending, (state) => {
        state.error = null; 
      })
      .addCase(
        fetchFeedsData.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          const { orders, total, totalToday } = action.payload;
          state.ordersList = orders;
          state.totalCount = total;
          state.totalTodayCount = totalToday;
        }
      )
      .addCase(fetchFeedsData.rejected, (state, action) => {
        state.error = action.error.message || 'Unknown error'; 
      });
  },
});

// Селекторы
export const selectFeedsState = (state: { feeds: TFeedState }) => state.feeds;
export const selectFeedsOrders = (state: { feeds: TFeedState }) => state.feeds.ordersList;
export const selectFeedsError = (state: { feeds: TFeedState }) => state.feeds.error; 

export const { clearError } = feedsSlice.actions; 

export default feedsSlice.reducer; 
