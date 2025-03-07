import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../utils/types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../utils/burger-api';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

interface IUState {
  user: TUser | null;
  isAuthorized: boolean;
  error: string | undefined;
}

const initialState: IUState = {
  user: null,
  isAuthorized: false,
  error: ''
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

export const checkAuthorization = createAsyncThunk(
  'auth/checkAuthorization',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      const userResult = await getUserApi();
      dispatch(setUser(userResult.user));
      dispatch(setAuthorization(true));
    } else {
      dispatch(setAuthorization(false));
    }
  }
);

export const authSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    setAuthorization: (state, action: PayloadAction<boolean>) => {
      state.isAuthorized = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userRegistrate.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthorized = true;
        state.error = '';
      })
      .addCase(userRegistrate.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthorized = false;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthorized = true;
        state.error = '';
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthorized = false;
      })
      .addCase(userUpdate.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.user = null;
        state.isAuthorized = false;
      });
  }
});

export const { setAuthorization, setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
export const UserSelector = (state: { authorization: IUState }) =>
  state.authorization.user;
export const isAuthorizedSelector = (state: { authorization: IUState }) =>
  state.authorization.isAuthorized;
export const UsernameSelector = (state: { authorization: IUState }) =>
  state.authorization.user?.name;
