import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { fetchFeeds } from '../../services/slices/feed-slice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feedState = useSelector((state) => state.feed);
  const orders: TOrder[] = feedState.orders;

  useEffect(() => {
    dispatch(fetchFeeds());
  }, []);

  if (feedState.isLoading) {
    return <Preloader />;
  }

  if (feedState.error) {
    return <div className=''>{feedState.error}</div>;
  }

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
