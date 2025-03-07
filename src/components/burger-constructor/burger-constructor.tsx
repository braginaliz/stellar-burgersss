
import React, { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  addIngredient,
  removeIngredient,
  setBun,
  setOrderRequest,
  setOrderModalData
} from '../../slice/ConstructorSlice';
import { createOrder } from '../../slice/OrdersSlice'; 
import {isAuthorizedSelector } from '../../slice/AuthSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const { bun, ingredients, orderRequest, orderModalData } = useSelector(
    (state) => state.burgerConstructor
  );

  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };

  const navigate = useNavigate();
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    
    dispatch(setOrderRequest(true));


    if (!isAuthorizedSelector) {
      return navigate('/login'); 
    }

    const data = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(data)); 
  };

  const closeOrderModal = () => {
    dispatch(setOrderRequest(false));
    dispatch(setOrderModalData(null));
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
