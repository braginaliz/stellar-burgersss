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

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const { bun, ingredients, orderRequest, orderModalData } = useSelector(
    (state) => state.burgerConstructor
  );

  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    dispatch(setOrderRequest(true));
    // Здесь должна быть логика отправки запроса на сервер для оформления заказа
    // После получения ответа обновите orderModalData и orderRequest
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
