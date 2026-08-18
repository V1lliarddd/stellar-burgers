import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/services/root-reducer';
import { fetchFeeds } from '../../services/slices/feed-slice';
import { AppDispatch } from 'src/services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const feedState = useSelector((state: RootState) => state.feed);
  const orders: TOrder[] = feedState.orders;

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  useEffect(() => {
    dispatch(fetchFeeds());
    console.log(orders);
  }, [dispatch]);

  if (feedState.isLoading) {
    return <Preloader />;
  }

  if (feedState.error) {
    return <div className=''>{feedState.error}</div>;
  }

  if (!orders.length) {
    return <Preloader />;
  }

  <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
