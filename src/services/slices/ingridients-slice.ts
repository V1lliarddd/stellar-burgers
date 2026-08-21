import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

export type TIngridientsState = {
  data: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngridientsState = {
  data: [],
  isLoading: false,
  error: null
};

export const fetchIngridients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingridients/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const ingridientsSlice = createSlice({
  name: 'ingridients',
  initialState,
  reducers: {
    deleteError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngridients.pending, (state) => {
        (state.isLoading = true), (state.error = null);
      })
      .addCase(
        fetchIngridients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          (state.isLoading = false), (state.data = action.payload);
        }
      )
      .addCase(fetchIngridients.rejected, (state, action) => {
        (state.isLoading = false), (state.error = action.payload || 'Error');
      });
  }
});

export const { deleteError } = ingridientsSlice.actions;
export default ingridientsSlice;
