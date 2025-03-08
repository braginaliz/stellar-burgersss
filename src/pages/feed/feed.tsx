import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getAllFeeds } from '../../slice/FeedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { feeds, error } = useSelector((state) => state.feeds);
  const { orders, total, totalToday } = feeds;

  useEffect(() => {
    dispatch(getAllFeeds());
  }, [dispatch]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(getAllFeeds())} />
  );
};
