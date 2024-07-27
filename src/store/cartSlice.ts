import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  count: number;
}

interface CartState {
  items: { [key: string]: CartItem };
  selectedItems: string[];
}

const initialState: CartState = {
  items: {},
  selectedItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems(state, action: PayloadAction<{ [key: string]: CartItem }>) {
      state.items = action.payload;
    },
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      if (state.items[item.id]) {
        state.items[item.id].count += item.count;
      } else {
        state.items[item.id] = { ...item, count: +1 };
      }
    },
    deleteCart(state, action: PayloadAction<string>) {
      delete state.items[action.payload];
      state.selectedItems = state.selectedItems.filter(
        (id) => id !== action.payload
      );
    },
    incrementCount(state, action: PayloadAction<string>) {
      const item = state.items[action.payload];
      if (item) {
        item.count += 1;
      }
    },
    decrementCount(state, action: PayloadAction<string>) {
      const item = state.items[action.payload];
      if (item) {
        if (item.count > 1) {
          item.count -= 1;
        } else {
          delete state.items[action.payload];
          state.selectedItems = state.selectedItems.filter(
            (id) => id !== action.payload
          );
        }
      }
    },
    selectItem(state, action: PayloadAction<string>) {
      if (!state.selectedItems.includes(action.payload)) {
        state.selectedItems.push(action.payload);
      }
    },
    deselectItem(state, action: PayloadAction<string>) {
      state.selectedItems = state.selectedItems.filter(
        (id) => id !== action.payload
      );
    },
  },
});

export const {
  setCartItems,
  addToCart,
  deleteCart,
  incrementCount,
  decrementCount,
  selectItem,
  deselectItem,
} = cartSlice.actions;

export default cartSlice.reducer;
