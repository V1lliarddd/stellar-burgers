import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  clearOrderModalData,
  createOrder
} from '../../services/slices/order-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const burgerConstructorState = useSelector(
    (state) => state.burgerConstructor
  );
  const orderState = useSelector((state) => state.order);
  const isAuth = useSelector((state) => state.user.user);

  const constructorItems = {
    bun: burgerConstructorState.bun,
    ingredients: burgerConstructorState.ingridients
  };

  const orderRequest = orderState.orderRequest;

  const orderModalData = orderState.orderRequestModalData;

  const onOrderClick = () => {
    if (!isAuth) {
      return navigate('/login', {
        replace: true,
        state: { from: location }
      });
    }

    if (!constructorItems.bun || orderRequest) return;

    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredients));
  };
  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
