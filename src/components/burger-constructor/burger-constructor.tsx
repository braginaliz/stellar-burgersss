import React, { FC, useMemo, useState } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  resetConstructor,
  getConstructorSelector
} from '../../slice/ConstructorSlice';

import {
  createOrder,
  selectOrderRequest,
  selectOrderResponse,
  resetOrderResponse
} from '../../slice/OrdersSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../services/store';
import { getIsAuthChecked } from '../../slice/AuthSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const user = useSelector(getIsAuthChecked);
  const constructorItems = useSelector(getConstructorSelector);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderResponse);
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (isOpen) {
      if (!user) {
        navigate('/login');
        return;
      }

      dispatch(
        createOrder({
          constructorItems,
          orderRequest: false,
          orderModalData: null,
          loading: false
        })
      );
      dispatch(resetConstructor());
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const onCloseClick = () => {
    setIsOpen(false);
  };

  const closeOrderModal = () => {
    dispatch(resetOrderResponse());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems.ingredients.length > 0
        ? constructorItems.ingredients.reduce(
            (accum, currentValue) => accum + currentValue.price,
            0
          )
        : 0),
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
