import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import userReducer from "./userSlice";
import cartReducer from "./cartSlice";

export const store: any = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    cart: cartReducer,
  },
});

export default store;
