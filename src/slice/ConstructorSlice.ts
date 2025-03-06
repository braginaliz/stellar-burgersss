import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '../utils/types'; 
import { v4 as uuidv4 } from 'uuid'; 

// Интерфейс состояния конструктора бургера
export interface IBurgerConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: IBurgerConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient | null>) => {
      state.bun = action.payload;
    },
    addIngredient: {
      prepare: (payload: TIngredient) => ({
        payload: { ...payload, id: uuidv4() } 
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload 
      );
    },
    moveIngredient: (state, action: PayloadAction<{ index: number; upwards: boolean }>) => {
      const ingredientLink = state.ingredients[action.payload.index];

      if (action.payload.upwards && action.payload.index > 0) {
        // Перемещение вверх
        state.ingredients[action.payload.index] = state.ingredients[action.payload.index - 1];
        state.ingredients[action.payload.index - 1] = ingredientLink;
      } else if (!action.payload.upwards && action.payload.index < state.ingredients.length - 1) {
        // Перемещение вниз
        state.ingredients[action.payload.index] = state.ingredients[action.payload.index + 1];
        state.ingredients[action.payload.index + 1] = ingredientLink;
      }
    },
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModalData = action.payload;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
});

export const {
  addIngredient,
  removeIngredient,
  setBun,
  setOrderRequest,
  setOrderModalData,
  clearConstructor,
  moveIngredient,
  resetConstructor,
} = burgerConstructorSlice.actions;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;