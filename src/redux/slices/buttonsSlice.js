import { createSlice } from "@reduxjs/toolkit";

export const buttonSlice = createSlice({
  name: "button",
  initialState: {
    isClicked: false,
  },
  reducers: {
    setIsClicked: (state, action) => {
      state.isClicked = action.payload.payload;
    },
  },
});

export const { setIsClicked } = buttonSlice.actions;

export default buttonSlice.reducer;
