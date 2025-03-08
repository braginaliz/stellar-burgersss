import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const orders = useSelector((state) => state.orders.orderResponse.order);

  return <ProfileOrdersUI orders={orders ? [orders] : []} />;
};
