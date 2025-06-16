import { createSlice } from "@reduxjs/toolkit";

export const buttonSlice = createSlice({
  name: "button",
  initialState: {
    isClicked: false,
    counter: 0,
  },
  reducers: {
    setIsClicked: (state, action) => {
      state.isClicked = action.payload.payload;
    },
    setCounter: (state, action) => {
      state.counter = state.counter + action.payload.value;
    },
  },
});

export const { setIsClicked, setCounter } = buttonSlice.actions;

export default buttonSlice.reducer;
