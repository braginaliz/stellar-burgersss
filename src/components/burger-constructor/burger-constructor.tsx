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
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../services/store';
import { isAuthorizedSelector } from '../../slice/AuthSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(
    (state: RootState) => state.burgerConstructor
  );
  const { orderRequest, orderModalData } = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  const navigate = useNavigate();
  const onOrderClick = () => {
    if (!constructorItems.bun) return;

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
    dispatch(setOrderModalData(null));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
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
