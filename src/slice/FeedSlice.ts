import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

export interface TFeedState {
  ordersList: TOrder[];
  totalCount: number;
  totalTodayCount: number;
  error: string | null;
}

export const initialState: TFeedState = {
  ordersList: [],
  totalCount: 0,
  totalTodayCount: 0,
  error: null
};

export const fetchFeedsData = createAsyncThunk(
  'feeds/fetchFeedsData',
  async () => {
    const response = await getFeedsApi();
    return response;
  }
);

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedsData.pending, (state) => {
        state.error = null;
      })
      .addCase(
        fetchFeedsData.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.ordersList = action.payload.orders;
          state.totalCount = action.payload.total;
          state.totalTodayCount = action.payload.totalToday;
        }
      )
      .addCase(fetchFeedsData.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка загрузки';
      });
  }
});

export const { clearError } = feedsSlice.actions;
export default feedsSlice.reducer;
