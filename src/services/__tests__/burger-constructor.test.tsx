import { TConstructorIngredient, TOrder } from '@utils-types';
import burgerConstructorSlice, {
  initialState,
  addIngridient,
  removeIngridient,
  moveIngridientUp,
  moveIngridientDown,
  setBun,
  clear
} from '../slices/burger-constructor-slice';
import { createOrder } from '../slices/order-slice';
import { expect, it, describe } from '@jest/globals';

const mockIngredient: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'test-1',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: '',
  image_mobile: '',
  image_large: '',
  id: 'test-1'
};

const mockBun: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'test-3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: '',
  image_mobile: '',
  image_large: '',
  id: 'test-3'
};

const mockIngredients: TConstructorIngredient[] = [
  mockIngredient,
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'test-2',
    type: 'main',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 1,
    image: '',
    image_mobile: '',
    image_large: '',
    id: 'test-2'
  }
];

const mockOrderData: TOrder = {
  _id: 'test-4',
  status: 'done',
  name: 'Test',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 1,
  ingredients: ['test-1', 'test-2']
};

describe('Проверка редьюсера burger-constructor', () => {
  it('Проверка addIngridient', () => {
    const prevState = {
      ...initialState
    };
    const state = burgerConstructorSlice.reducer(
      prevState,
      addIngridient(mockIngredient)
    );

    expect(state.ingridients).toHaveLength(1);
  });

  it('Проверка removeIngredient', () => {
    const prevState = {
      ...initialState,
      ingridients: [mockIngredient]
    };
    const state = burgerConstructorSlice.reducer(
      prevState,
      removeIngridient(Number(prevState.ingridients[0]._id))
    );

    expect(state.ingridients).toHaveLength(0);
  });
  it('Проверка moveIngredientUp', () => {
    const sliceInitialState = {
      ...initialState,
      ingridients: mockIngredients
    };

    const newState = burgerConstructorSlice.reducer(
      sliceInitialState,
      moveIngridientUp(1)
    );
    expect(newState.ingridients).toEqual([
      mockIngredients[1],
      mockIngredients[0]
    ]);
  });

  it('Проверка moveIngredientDown', () => {
    const sliceInitialState = {
      ...initialState,
      ingridients: mockIngredients
    };

    const newState = burgerConstructorSlice.reducer(
      sliceInitialState,
      moveIngridientDown(0)
    );
    expect(newState.ingridients).toEqual([
      mockIngredients[1],
      mockIngredients[0]
    ]);
  });
  it('Проверка setBun', () => {
    const sliceInitialState = {
      ...initialState,
      bun: null
    };

    const newState = burgerConstructorSlice.reducer(
      sliceInitialState,
      setBun(mockBun)
    );
    expect(newState.bun).not.toBeNull();
  });
  it('Проверка clear', () => {
    const sliceInitialState = {
      ingridients: mockIngredients,
      bun: mockBun
    };

    const newState = burgerConstructorSlice.reducer(sliceInitialState, clear());
    expect(newState).toEqual({
      bun: null,
      ingridients: []
    });
  });

  it('Проверка createOrder.fulfilled', async () => {
    const sliceInitialState = {
      ...initialState
    };

    const action = createOrder.fulfilled(mockOrderData, 'requestId', [
      '1',
      '2'
    ]);
    const newState = burgerConstructorSlice.reducer(sliceInitialState, action);

    expect(newState).toEqual({
      bun: null,
      ingridients: []
    });
  });
  it('Проверка UNKNOWN_ACTION', () => {
    const newState = burgerConstructorSlice.reducer(undefined, {
      type: 'unknown'
    });
    expect(newState).toEqual(initialState);
  });
});
