import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  theme: "light" | "synthwave";
}

const initialState: ThemeState = {
  theme: localStorage.getItem("theme") === "synthwave" ? "synthwave" : "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "synthwave" : "light";
      localStorage.setItem("theme", state.theme);
    },
    setTheme(state, action: PayloadAction<"light" | "synthwave">) {
      state.theme = action.payload;
      localStorage.setItem("theme", state.theme);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
