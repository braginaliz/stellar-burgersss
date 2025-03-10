import { combineSlices } from 'redux';
import userReducer from './userSlice';
import ingredientsReducer from './ingredientsSlice';
import ordersReducer from './ordersSlice';

const rootReducer = combineSlices({
  user: userReducer,
  ingredients: ingredientsReducer,
  orders: ordersReducer,
});

export default rootReducer;

