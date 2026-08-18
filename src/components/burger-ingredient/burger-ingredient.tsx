import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from 'react-redux';
import { TConstructorIngredient } from '@utils-types';
import { v4 } from 'uuid';
import {
  addIngridient,
  setBun
} from '../../services/slices/burger-constructor-slice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      const ingredientConstructor: TConstructorIngredient = {
        ...ingredient,
        id: v4()
      };

      if (ingredient.type === 'bun') dispatch(setBun(ingredientConstructor));
      if (ingredient.type !== 'bun')
        dispatch(addIngridient(ingredientConstructor));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
