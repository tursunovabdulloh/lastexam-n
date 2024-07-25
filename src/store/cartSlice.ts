import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  count: number;
}

interface CartState {
  items: { [key: string]: CartItem };
  selectedItems: Set<string>;
}

const initialState: CartState = {
  items: {},
  selectedItems: new Set(),
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
        state.items[item.id] = { ...item, count: 1 };
      }
    },
    deleteCart(state, action: PayloadAction<string>) {
      delete state.items[action.payload];
      state.selectedItems.delete(action.payload);
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
          state.selectedItems.delete(action.payload);
        }
      }
    },
    selectItem(state, action: PayloadAction<string>) {
      state.selectedItems.add(action.payload);
    },
    deselectItem(state, action: PayloadAction<string>) {
      state.selectedItems.delete(action.payload);
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
