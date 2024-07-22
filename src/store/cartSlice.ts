import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Recipe } from "../types";

export interface CartItem extends Recipe {
  count: number;
}

export interface CartState {
  items: CartItem[];
  selectedItems: string[];
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem("cartItems") || "[]") || [],
  selectedItems:
    JSON.parse(localStorage.getItem("selectedItems") || "[]") || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const itemIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );

      if (itemIndex > -1) {
        // Update count if item already exists
        state.items[itemIndex].count += action.payload.count;
      } else {
        // Add new item to cart
        state.items.push(action.payload);
      }

      // Update localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    deleteCart: (state, action: PayloadAction<string>) => {
      // Remove item from cart
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );

      // Update localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    deleteAll: (state) => {
      // Clear all items
      state.items = [];

      // Update localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      // Set cart with new data
      state.items = action.payload;

      // Update localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    incrementCount: (state, action: PayloadAction<string>) => {
      // Find the item and increment its count
      const item = state.items.find(
        (item) => item.productId === action.payload
      );
      if (item) {
        item.count += 1;
      }

      // Update localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    decrementCount: (state, action: PayloadAction<string>) => {
      // Find the item and decrement its count
      const item = state.items.find(
        (item) => item.productId === action.payload
      );
      if (item && item.count > 0) {
        item.count -= 1;
      }

      // Update localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    selectItem: (state, action: PayloadAction<string>) => {
      // Add item to selectedItems if not already present
      if (!state.selectedItems.includes(action.payload)) {
        state.selectedItems.push(action.payload);
      }

      // Update localStorage
      localStorage.setItem(
        "selectedItems",
        JSON.stringify(state.selectedItems)
      );
    },
    deselectItem: (state, action: PayloadAction<string>) => {
      // Remove item from selectedItems
      state.selectedItems = state.selectedItems.filter(
        (id) => id !== action.payload
      );

      // Update localStorage
      localStorage.setItem(
        "selectedItems",
        JSON.stringify(state.selectedItems)
      );
    },
  },
});

export const {
  addToCart,
  deleteCart,
  deleteAll,
  setCart,
  incrementCount,
  decrementCount,
  selectItem,
  deselectItem,
} = cartSlice.actions;

export default cartSlice.reducer;
