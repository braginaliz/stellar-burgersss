import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  addIngredient,
  removeIngredient,
  burgerConstructorSelector,
  resetConstructor
} from '../../slice/ConstructorSlice';
import {
  resetOrderModalData,
  isLoadingSelector,
  createOrder,
  ordersSelector
} from '../../slice/OrdersSlice';
import { isAuthorizedSelector } from '../../slice/AuthSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(burgerConstructorSelector);
  const orderRequest = useSelector(isLoadingSelector);
  const orderModalData = useSelector(ordersSelector);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(isAuthorizedSelector);

  const onOrderClick = () => {
    if (!isAuthenticated) {
      return navigate('/login');
    }

    const { bun, ingredients } = constructorItems;
    if (!constructorItems.bun || orderRequest) return;
    const orderData: string[] = [
      bun?._id!,
      ...ingredients.map((ingredient) => ingredient._id),
      bun?._id!
    ];
    dispatch(createOrder(orderData));
  };
  const closeOrderModal = () => {
    navigate('/', { replace: true });
    dispatch(resetOrderModalData());
    dispatch(resetConstructor());
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
