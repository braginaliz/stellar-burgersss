import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeedsData } from '../../slice/FeedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { ordersList, totalCount, totalTodayCount, error } = useSelector(
    (state) => state.feeds
  );

  useEffect(() => {
    dispatch(fetchFeedsData());
  }, [dispatch]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!ordersList.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={ordersList}
      handleGetFeeds={() => dispatch(fetchFeedsData())}
    />
  );
};
