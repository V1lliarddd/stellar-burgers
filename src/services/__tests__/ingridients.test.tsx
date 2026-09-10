import ingridientsSlice, {
  deleteError,
  fetchIngridients,
  initialState
} from '../slices/ingridients-slice';
import type { TIngredient } from '@utils-types';
import { expect, it, describe } from '@jest/globals';

describe('Проверка редьюсера ingredients', () => {
  it('Проверка fetchIngridients.pending', () => {
    const prevState = {
      ...initialState,
      error: 'test error'
    };

    const action = fetchIngridients.pending('requestId', undefined);
    const state = ingridientsSlice.reducer(prevState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Проверка fetchIngridients.fulfilled', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
        name: 'test',
        type: 'bun',
        proteins: 1,
        fat: 1,
        carbohydrates: 1,
        calories: 1,
        price: 100,
        image: '/',
        image_mobile: '/',
        image_large: '/'
      }
    ];

    const prevState = {
      ...initialState,
      isLoading: true
    };

    const action = fetchIngridients.fulfilled(
      mockIngredients,
      'requestId',
      undefined
    );
    const state = ingridientsSlice.reducer(prevState, action);

    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockIngredients);
  });

  it('Проверка fetchIngridients.rejected', () => {
    const prevState = {
      ...initialState,
      isLoading: true
    };

    const action = fetchIngridients.rejected(null, 'requestId', undefined);
    const state = ingridientsSlice.reducer(prevState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не получилось загрузить ингридиенты');
  });

  it('Проверка deleteError', () => {
    const prevState = {
      ...initialState,
      error: 'some error'
    };
    const action = deleteError();
    const state = ingridientsSlice.reducer(prevState, action);

    expect(state.error).toEqual(null);
  });

  it('Проверка UNKNOWN_ACTION', () => {
    const state = ingridientsSlice.reducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });
});
