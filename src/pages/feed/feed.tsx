import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getAllFeeds } from '../../slice/FeedSlice'; // Исправлено на правильный экшен

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { feeds, error } = useSelector((state) => state.feeds);
  const { orders, total, totalToday } = feeds; // Изменено для получения данных из feeds

  useEffect(() => {
    dispatch(getAllFeeds()); // Используем правильный экшен
  }, [dispatch]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(getAllFeeds())} // Используем правильный экшен
    />
  );
};
