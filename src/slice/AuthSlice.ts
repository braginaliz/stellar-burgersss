import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
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
  isChecked: boolean;
  userdata: TUser;
  isAuthorized: boolean;
  userorders: TOrder[] | [];
  error: string | undefined;
  isLoading: boolean;
}

const initialState: IUState = {
  isChecked: false,
  userdata: {
    name: '',
    email: ''
  },
  userorders:[],
  isAuthorized: false,
  error: '',
  isLoading: false
};

export const userLogin = createAsyncThunk(
  'auth/userLogin',
  async (loginData: TLoginData) => {
    const loginResult = await loginUserApi(loginData);
    setCookie('accessToken', loginResult.accessToken);
    localStorage.setItem('refreshToken', loginResult.refreshToken);
    return loginResult;
  }
);

export const userRegistrate = createAsyncThunk(
  'auth/userRegistration',
  async (registrationData: TRegisterData) => {
    const registrationResult = await registerUserApi(registrationData);
    setCookie('accessToken', registrationResult.accessToken);
    localStorage.setItem('refreshToken', registrationResult.refreshToken);
    return registrationResult;
  }
);

export const userUpdate = createAsyncThunk(
  'auth/userUpdate',
  async (updateData: Partial<TRegisterData>) => {
    await updateUserApi(updateData);
    return getUserApi();
  }
);

export const userLogout = createAsyncThunk('auth/userLogout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const checkAuthorization = createAsyncThunk<TUser, void>(
  'auth/checkAuthorization',
  async (_, { rejectWithValue }) => {
    try {
      const userResult = await getUserApi();
      return userResult.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const userOrders = createAsyncThunk('user/getUserOrders', async () =>
  getOrdersApi()
);


export const authSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    setAuthorization: (state, action: PayloadAction<boolean>) => {
      state.isAuthorized = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.userdata = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userRegistrate.fulfilled, (state, action) => {
        state.userdata = action.payload.user;
        state.isAuthorized = true;
        state.error = '';
      })
      .addCase(userRegistrate.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthorized = false;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.userdata = action.payload.user;
        state.isAuthorized = true;
        state.error = '';
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthorized = false;
      })
      .addCase(userUpdate.fulfilled, (state, action) => {
        state.userdata = action.payload.user;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.userdata = {
          email: '',
          name: ''
        };
        state.isAuthorized = false;
      })
      .addCase(userRegistrate.pending, (state) => {
        state.error = undefined;
      })
      .addCase(checkAuthorization.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        checkAuthorization.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.userdata = action.payload;
        }
      )
      .addCase(checkAuthorization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
      });
  },
  selectors: {
    setUser: (state) => state.userdata,
    
    errorSelector: (state) => state.error,
    loadingSelector: (state) => state.isLoading,
    userordersSelector: (state) => state.userorders,
  }
});

export const authReducer = authSlice.reducer;

export const isAuthorizedSelector = (state: RootState) =>
  state.authorization.isAuthorized;

export const userSelector = (state: RootState) => state.authorization.userdata;
export const { loadingSelector, setUser, errorSelector,  userordersSelector } = authSlice.selectors;
