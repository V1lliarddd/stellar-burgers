import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrdersApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

export type TOrderState = {
  orderRequest: boolean;
  orderRequestModalData: TOrder | null;
  orderRequestError: string | null;
};

export type TUserOrdersState = {
  userOrders: TOrder[];
  userOrdersIsLoading: boolean;
  userOrdersErrors: string | null;
};

export type TUserCurrentOrder = {
  userCurrnetOrder: TOrder | null;
  userCurrentOrderIsLoading: boolean;
  userCurrentOrderErrors: string | null;
};

const initialState: TOrderState & TUserCurrentOrder & TUserOrdersState = {
  orderRequest: false,
  orderRequestModalData: null,
  orderRequestError: null,
  userOrders: [],
  userOrdersIsLoading: false,
  userOrdersErrors: null,
  userCurrnetOrder: null,
  userCurrentOrderIsLoading: false,
  userCurrentOrderErrors: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/create', async (ingridientsIds, { rejectWithValue }) => {
  try {
    const res = await orderBurgerApi(ingridientsIds);
    const order: TOrder = {
      ...res.order,
      ingredients: ingridientsIds
    };
    return order;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('order/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const res = await getOrderByNumberApi(number);
    if (res.success && res.orders.length) return res.orders[0];
    return rejectWithValue('Заказ не найден');
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderRequestModalData = null;
      state.orderRequestError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderRequestError = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderRequestModalData = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderRequestError = action.payload || 'Error';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.userOrdersIsLoading = true;
        state.userOrdersErrors = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.userOrdersIsLoading = false;
          state.userOrders = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.userOrdersIsLoading = false;
        state.userOrdersErrors = action.payload || 'Error';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.userCurrentOrderIsLoading = true;
        state.userCurrentOrderErrors = null;
        state.userCurrnetOrder = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.userCurrentOrderIsLoading = false;
          state.userCurrnetOrder = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.userCurrentOrderIsLoading = false;
        state.userCurrentOrderErrors = action.payload || 'Error';
        state.userCurrnetOrder = null;
      });
  }
});

export const { clearOrderModalData } = orderSlice.actions;
export default orderSlice;
