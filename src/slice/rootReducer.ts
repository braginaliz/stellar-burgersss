import { combineSlices } from '@reduxjs/toolkit';
import { UserReducer } from './UserSlice';
import { ingredientsReducer } from './IngredientSlice';
import { combinedOrderReducer } from './OrdersSlice';
import { feedsReducer } from './FeedSlice';
import { constructorReducer } from './ConstructorSlice';

const rootReducer = combineSlices({
  user: UserReducer,
  burgerConstructor: constructorReducer,
  ingredients: ingredientsReducer,
  feeds: feedsReducer,
  combinedorder: combinedOrderReducer
});

export default rootReducer;
