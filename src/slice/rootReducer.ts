import { combineSlices } from '@reduxjs/toolkit';
import { authReducer } from './AuthSlice';
import { ingredientsReducer } from './IngredientSlice';
import { burgerConstructorReducer } from './ConstructorSlice';
import { feedsReducer } from './FeedSlice';
import { ordersReducer } from './OrdersSlice';

const rootReducer = combineSlices({
  authorization: authReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  feeds: feedsReducer,
  orders: ordersReducer
});

export default rootReducer;
