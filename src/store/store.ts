import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import userReducer from "./userSlice";

export const store: any = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
  },
});

export default store;
