import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

export interface IBurgerConstructorState {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  loading: boolean;
}

const initialState: IBurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  loading: true
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient | null>) => {
      state.constructorItems.bun = action.payload;
    },
    addIngredient: {
      prepare: (payload: TIngredient) => ({
        payload: { ...payload, id: uuidv4() }
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; upwards: boolean }>
    ) => {
      const ingredientLink =
        state.constructorItems.ingredients[action.payload.index];

      if (action.payload.upwards && action.payload.index > 0) {
        state.constructorItems.ingredients[action.payload.index] =
          state.constructorItems.ingredients[action.payload.index - 1];
        state.constructorItems.ingredients[action.payload.index - 1] =
          ingredientLink;
      } else if (
        !action.payload.upwards &&
        action.payload.index < state.constructorItems.ingredients.length - 1
      ) {
        state.constructorItems.ingredients[action.payload.index] =
          state.constructorItems.ingredients[action.payload.index + 1];
        state.constructorItems.ingredients[action.payload.index + 1] =
          ingredientLink;
      }
    },
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModalData = action.payload;
    },
    clearConstructor: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    },
    resetConstructor: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    }
  },
  selectors: {
    getLoadingSelector: (state) => state.loading,
    getConstructorSelector: (state) => state.constructorItems
  }
});

export const {
  addIngredient,
  removeIngredient,
  setBun,
  setOrderRequest,
  setOrderModalData,
  clearConstructor,
  moveIngredient,
  resetConstructor
} = burgerConstructorSlice.actions;

export const { getLoadingSelector, getConstructorSelector } =
  burgerConstructorSlice.selectors;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
