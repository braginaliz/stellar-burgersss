import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { userOrders, userordersSelector } from '../../slice/AuthSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(userordersSelector);

  useEffect(() => {
    dispatch(userOrders());
  }, [dispatch]);

  if (!orders) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
