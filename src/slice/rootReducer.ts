import { combineSlices } from '@reduxjs/toolkit';
import { authReducer } from './AuthSlice';
import { ingredientsReducer } from './IngredientSlice';
import { burgerConstructorReducer } from './ConstructorSlice';
import { feedsSlice } from './FeedSlice'

const rootReducer = combineSlices({
  authorization: authReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer, 
  feeds: feedsSlice.reducer,
});

export default rootReducer;
