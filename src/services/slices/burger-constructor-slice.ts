import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '../../utils/types';
import { createOrder } from './order-slice';

export type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingridients: TConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingridients: []
};

const swapItems = <T>(array: T[], index1: number, index2: number): void => {
  [array[index1], array[index2]] = [array[index2], array[index1]];
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngridient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingridients.push(action.payload);
    },
    removeIngridient: (state, action: PayloadAction<number>) => {
      state.ingridients.splice(action.payload, 1);
    },
    moveIngridientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        swapItems(state.ingridients, index, index - 1);
      }
    },
    moveIngridientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.ingridients.length - 1) {
        swapItems(state.ingridients, index, index + 1);
      }
    },
    setBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.bun = action.payload;
    },
    clear: (state) => {
      state.bun = null;
      state.ingridients = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, (state) => {
      state.bun = null;
      state.ingridients = [];
    });
  }
});

export const {
  addIngridient,
  removeIngridient,
  moveIngridientUp,
  moveIngridientDown,
  setBun,
  clear
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice;
