import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'src/services/root-reducer';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const data = useSelector((state: RootState) => state.ingredients.data);
  const ingredientData = data.filter((item) => item._id === id);

  if (!ingredientData.length) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData[0]} />;
};
