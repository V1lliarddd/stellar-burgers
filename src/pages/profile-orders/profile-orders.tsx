import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/services/root-reducer';
import { fetchUserOrders } from '../../services/slices/order-slice';
import { AppDispatch } from 'src/services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const orders: TOrder[] = useSelector(
    (state: RootState) => state.order.userOrders
  );

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
