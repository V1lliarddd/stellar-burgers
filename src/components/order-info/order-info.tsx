import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/services/root-reducer';
import { useParams } from 'react-router-dom';
import { AppDispatch } from 'src/services/store';
import { fetchOrderByNumber } from '../../services/slices/order-slice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const number = Number(useParams<{ number: string }>().number);
  const userOrders = useSelector((state: RootState) => state.order.userOrders);
  const feedOrders = useSelector((state: RootState) => state.feed.orders);
  const orderById = useSelector(
    (state: RootState) => state.order.orderRequestByNumber
  );
  let orderData =
    userOrders.find((item) => item.number === number) ||
    feedOrders.find((item) => item.number === number) ||
    orderById;

  const ingredients: TIngredient[] = useSelector(
    (state: RootState) => state.ingredients.data
  );

  useEffect(() => {
    if (!orderData) {
      console.log(1);
      dispatch(fetchOrderByNumber(number));
    }
  }, [dispatch, orderData, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
