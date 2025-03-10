import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

type TInitialStateUser = {
  user: TUser;
  isAuthenticated: boolean;
  loading: boolean;
  errorText: string;
};

const initialStateUser: TInitialStateUser = {
  user: {
    name: '',
    email: ''
  },
  isAuthenticated: false,
  loading: false,
  errorText: ''
};

export const fetchLoginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => loginUserApi(data)
);

export const fetchRegisterUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => registerUserApi(data)
);

export const getUserThunk = createAsyncThunk('user/get', async () =>
  getUserApi()
);

export const fetchLogout = createAsyncThunk('user/logout', async () =>
  logoutApi()
);

export const fetchUpdateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const userSlice = createSlice({
  name: 'user',
  initialState: initialStateUser,
  reducers: {
    setErrorText(state, action: PayloadAction<string>) {
      state.errorText = action.payload;
    },
    removeErrorText(state) {
      state.errorText = '';
    }
  }, selectors: {
    selectLoading: (state) => state.loading,
    selectUser: (state) => state.user,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectErrorText: (state) => state.errorText
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorText = action.error.message!;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(fetchRegisterUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.errorText = action.error.message!;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserThunk.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = { name: '', email: '' };
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user.name = action.payload.user.name;
        state.user.email = action.payload.user.email;
        state.isAuthenticated = true;
      })
      .addCase(fetchLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogout.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user = { name: '', email: '' };
          state.isAuthenticated = false;
        }
      })
      .addCase(fetchUpdateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpdateUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user.name = action.payload.user.name;
          state.user.email = action.payload.user.email;
        }
      });
  }
});



export const {
  setErrorText,
  removeErrorText
} = userSlice.actions;
export const {selectUser, selectIsAuthenticated, selectLoading, selectErrorText} = userSlice.selectors;
export default userSlice.reducer;
