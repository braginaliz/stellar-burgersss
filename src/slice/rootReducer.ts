import { combineSlices } from '@reduxjs/toolkit';
import { authReducer } from './AuthSlice';
import { ingredientsReducer } from './IngredientSlice';
import { burgerConstructorReducer } from './ConstructorSlice';
import { feedsSlice } from './FeedSlice';
import orderSlice from './OrdersSlice';

const rootReducer = combineSlices({
  authorization: authReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  feeds: feedsSlice.reducer,
  orders: orderSlice
});

export default rootReducer;
