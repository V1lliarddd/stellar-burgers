import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { fetchOrderByNumber } from '../../services/slices/order-slice';
import { useDispatch, useSelector } from '../../services/store';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const number = Number(useParams<{ number: string }>().number);
  const userOrders = useSelector((state) => state.order.userOrders);
  const feedOrders = useSelector((state) => state.feed.orders);
  const orderById = useSelector((state) => state.order.orderRequestByNumber);
  let orderData =
    userOrders.find((item) => item.number === number) ||
    feedOrders.find((item) => item.number === number) ||
    orderById;

  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.data
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
