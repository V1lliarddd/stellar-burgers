import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/services/root-reducer';
import { fetchFeeds } from '../../services/slices/feed-slice';
import { AppDispatch } from 'src/services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const feedState = useSelector((state: RootState) => state.feed);
  const orders: TOrder[] = feedState.orders;

  useEffect(() => {
    dispatch(fetchFeeds());
  }, []);

  if (feedState.isLoading) {
    console.log('1');
    return <Preloader />;
  }

  if (feedState.error) {
    console.log('2');
    return <div className=''>{feedState.error}</div>;
  }

  if (!orders.length) {
    console.log('3');
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
