import {
  getIngredientsApi
} from '../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TIngredient,
  TIngredientUnique,
  TConstructorItems
} from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TInitialStateIngredients = {
  ingredients: TIngredient[];
  loading: boolean;
  constructorItems: TConstructorItems;
  isInit: boolean;
};

const initialStateIngredients: TInitialStateIngredients = {
  ingredients: [],
  loading: false,
  constructorItems: {
    bun: {
      price: 0
    },
    ingredients: []
  },
  isInit: false
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  async () => getIngredientsApi()
);


export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialStateIngredients,
  reducers: {
    addIngredient(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push({
          ...action.payload,
          uniqueId: uuidv4()
        });
      }
    },
    deleteIngredient(state, action: PayloadAction<TIngredientUnique>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (_, index) => index !== ingredientIndex
        );
    },
    moveIngredientUp(state, action: PayloadAction<TIngredientUnique>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      if (ingredientIndex > 0) {
        const prevItem = state.constructorItems.ingredients[ingredientIndex - 1];
        state.constructorItems.ingredients.splice(
          ingredientIndex - 1,
          2,
          action.payload,
          prevItem
        );
      }
    },
    moveIngredientDown(state, action: PayloadAction<TIngredientUnique>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      if (ingredientIndex < state.constructorItems.ingredients.length - 1) {
        const nextItem = state.constructorItems.ingredients[ingredientIndex + 1];
        state.constructorItems.ingredients.splice(
          ingredientIndex,
          2,
          nextItem,
          action.payload
        );
      }
    },
    init(state) {
      state.constructorItems = initialStateIngredients.constructorItems;
    }
  },selectors: {
    selectIngredients: (state) => state.ingredients,
    selectLoading: (state) => state.loading,
    selectConstructorItems: (state) => state.constructorItems,
    selectIsInit: (state) => state.isInit,
   
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.loading = false;
      });
  }
});


export const {
  addIngredient,
  deleteIngredient,
  moveIngredientUp,
  moveIngredientDown,
  init
} = ingredientsSlice.actions;
export const {selectIngredients, selectConstructorItems, selectLoading, selectIsInit} = ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
