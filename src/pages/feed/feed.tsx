import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getAllFeeds, getAllOrdersSelector } from '../../slice/FeedSlice';

export const Feed: FC = () => {
  const orders = useSelector(getAllOrdersSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getAllFeeds());
      }}
    />
  );
};
