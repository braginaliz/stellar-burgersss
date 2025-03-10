import { combineSlices } from '@reduxjs/toolkit';
import userReducer from './UserSlice';
import ingredientsReducer from './IngredientSlice';
import ordersReducer from './OrdersSlice';

const rootReducer = combineSlices({
  user: userReducer,
  ingredients: ingredientsReducer,
  orders: ordersReducer,
});

export default rootReducer;

