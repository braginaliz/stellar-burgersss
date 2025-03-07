import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

export interface IBurgerConstructorState {
  burgerConstructor:{ bun: TIngredient | null;
  ingredients: TConstructorIngredient[]},
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: IBurgerConstructorState = {
  burgerConstructor:{  bun: null,
    ingredients: []},

  orderRequest: false,
  orderModalData: null
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  selectors: {
    burgerConstructorSelector: (state) => state.burgerConstructor
  },
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient | null>) => {
      state.burgerConstructor.bun = action.payload;
    },
    addIngredient: {
      prepare: (payload: TIngredient) => ({
        payload: { ...payload, id: uuidv4() }
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.burgerConstructor.bun = action.payload;
        } else {
          state.burgerConstructor.ingredients.push(action.payload);
        }
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.burgerConstructor.ingredients = state.burgerConstructor.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; upwards: boolean }>
    ) => {
      const ingredientLink = state.burgerConstructor.ingredients[action.payload.index];

      if (action.payload.upwards && action.payload.index > 0) {
        state.burgerConstructor.ingredients[action.payload.index] =
          state.burgerConstructor.ingredients[action.payload.index - 1];
        state.burgerConstructor.ingredients[action.payload.index - 1] = ingredientLink;
      } else if (
        !action.payload.upwards &&
        action.payload.index < state.burgerConstructor.ingredients.length - 1
      ) {
        state.burgerConstructor.ingredients[action.payload.index] =
          state.burgerConstructor.ingredients[action.payload.index + 1];
        state.burgerConstructor.ingredients[action.payload.index + 1] = ingredientLink;
      }
    },
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModalData = action.payload;
    },
    clearConstructor: (state) => {
      state.burgerConstructor.bun = null;
      state.burgerConstructor.ingredients = [];
    },
    resetConstructor: (state) => {
      state.burgerConstructor.bun = null;
      state.burgerConstructor.ingredients = [];
    }
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

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
export const { burgerConstructorSelector } = burgerConstructorSlice.selectors;