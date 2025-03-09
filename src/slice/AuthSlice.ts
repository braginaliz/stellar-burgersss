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
  userorders: [],
  isAuthorized: false,
  error: undefined,
  isLoading: false
};

export const userLogin = createAsyncThunk(
  'auth/userLogin',
  async (userdata: TLoginData, { rejectWithValue }) => { 
    const response = await loginUserApi(userdata);

    if (!response?.success) {
      return rejectWithValue(response);
    }

    const { user, refreshToken, accessToken } = response;

    setCookie('accessToken', accessToken); 
    localStorage.setItem('refreshToken', refreshToken); 
    return user;
  }
);


export const userRegistrate = createAsyncThunk(
  'auth/userRegistration',
  async (registerData: TRegisterData) => {
    const data = await registerUserApi(registerData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
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
      .addCase(userLogin.fulfilled, (state, action) => {
        state.userdata = { ...action.payload }; // Исправлено с userData на userdata
        state.isAuthorized = true; // Исправлено с isAuthChecked на isAuthorized
        state.error = undefined;
        state.isLoading = false;
      })
      .addCase(userRegistrate.fulfilled, (state, action) => {
        // Исправлено с registerUser на userRegistrate
        state.userdata = { ...action.payload }; // Исправлено с userData на userdata
        state.isAuthorized = true; // Исправлено с isAuthChecked на isAuthorized
        state.error = undefined;
        state.isLoading = false;
      })
      .addCase(userUpdate.fulfilled, (state, action) => {
        // Исправлено с getUser на userUpdate
        state.error = undefined;
        state.isLoading = false;
      })
      .addCase(userOrders.fulfilled, (state, action) => {
        // Исправлено с getUserOrders на userOrders
        state.userorders = action.payload; // Исправлено с userOrders на userorders
        state.error = undefined;
        state.isLoading = false;
      })
      // Удалены ненужные addMatcher
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
    setUser: (state) => state.userdata,

    errorSelector: (state) => state.error,
    loadingSelector: (state) => state.isLoading,
    userordersSelector: (state) => state.userorders
  }
});

export const authReducer = authSlice.reducer;

export const isAuthorizedSelector = (state: RootState) =>
  state.authorization.isAuthorized;

export const userSelector = (state: RootState) => state.authorization.userdata;
export const { loadingSelector, setUser, errorSelector, userordersSelector } =
  authSlice.selectors;
