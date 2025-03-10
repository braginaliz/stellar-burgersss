import { combineReducers } from 'redux';
import userReducer from './userSlice';
import ingredientsReducer from './ingredientsSlice';
import ordersReducer from './ordersSlice';

const rootReducer = combineReducers({
  user: userReducer,
  ingredients: ingredientsReducer,
  orders: ordersReducer,
});

export default rootReducer;

