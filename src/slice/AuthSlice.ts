import {
  isAnyOf,
  createAsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import { TUser, TOrder } from '../utils/types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi,
  getOrdersApi
} from '../utils/burger-api';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';
import { RootState } from 'src/services/store';

interface IUState {
  isAuthChecked: boolean;
  userdata: TUser | null;
  userorders: TOrder[] | [];
  error: string | undefined;
  isLoading: boolean;
}

export const initialState: IUState = {
  isAuthChecked: false,
  userdata: null,
  userorders: [],
  error: undefined,
  isLoading: false
};

export const userLogin = createAsyncThunk(
  'loginUser',
  async (userData: TLoginData) => {
    const data = await loginUserApi(userData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const userRegistrate = createAsyncThunk(
  'authorization/userRegistration',
  async (registerData: TRegisterData) => {
    const data = await registerUserApi(registerData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const checkUserAuth = createAsyncThunk('checkUserAuth', async () => {
  const accessToken = getCookie('accessToken');
  if (!accessToken) {
    throw new Error('Access token is not available');
  }
  const response = await getUserApi();
  return response;
});

export const userUpdate = createAsyncThunk(
  'authorization/userUpdate',
  async (updateData: Partial<TRegisterData>) => {
    await updateUserApi(updateData);
    return getUserApi();
  }
);

export const userLogout = createAsyncThunk(
  'authorization/userLogout',
  async () => {
    await logoutApi();
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  }
);

export const userOrders = createAsyncThunk(
  'authorization/getUserOrders',
  async () => getOrdersApi()
);

export const authSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.userdata = action.payload.user;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.error = undefined;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.userdata = action.payload.user;
        state.isAuthChecked = true;
        state.error = undefined;
        state.isLoading = false;
      })
      .addCase(userRegistrate.fulfilled, (state, action) => {
        state.userdata = action.payload;
        state.isAuthChecked = true;
        state.error = undefined;
        state.isLoading = false;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.userdata = null;
        state.isAuthChecked = false;
        state.error = undefined;
        state.isLoading = false;
      })
      .addCase(userUpdate.fulfilled, (state, action) => {
        state.error = undefined;
        state.isLoading = false;
      })
      .addCase(userOrders.fulfilled, (state, action) => {
        state.userorders = action.payload;
        state.error = undefined;
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(
          userLogin.pending,
          userRegistrate.pending,
          userUpdate.pending,
          userOrders.pending
        ),
        (state) => {
          state.error = undefined;
          state.isLoading = true;
        }
      )
      .addMatcher(
        isAnyOf(
          userLogin.rejected,
          userRegistrate.rejected,
          userUpdate.rejected,
          userOrders.rejected
        ),
        (state) => {
          state.error = undefined;
          state.isLoading = false;
        }
      );
  },
  selectors: {
    getUser: (state) => state.userdata,
    getIsAuthChecked: (state) => state.isAuthChecked,
    errorSelector: (state) => state.error,
    loadingSelector: (state) => state.isLoading,
    userordersSelector: (state) => state.userorders
  }
});

export const authReducer = authSlice.reducer;
export const {
  getIsAuthChecked,
  loadingSelector,
  getUser,
  errorSelector,
  userordersSelector
} = authSlice.selectors;
