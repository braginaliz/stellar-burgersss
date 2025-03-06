import { combineSlices } from '@reduxjs/toolkit';
import { authReducer } from './AuthSlice';
import { ingredientsReducer } from './IngredientSlice';
import { burgerConstructorReducer } from './ConstructorSlice';

const rootReducer = combineSlices({
  authorization: authReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer, 
});

export default rootReducer;
