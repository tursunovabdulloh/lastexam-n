import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginUser } from "../types";

export interface UserState {
  user: LoginUser | null;
  authChange: boolean;
}

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  authChange: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginUser>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.authChange = true;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      state.authChange = false;
    },
    authChange: (state, action: PayloadAction<boolean>) => {
      state.authChange = action.payload;
    },
  },
});

export const { login, logout, authChange } = userSlice.actions;
export default userSlice.reducer;
