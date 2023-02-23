import { createSlice } from "@reduxjs/toolkit";

export const positionSlice = createSlice({
  name: "position",
  initialState: {
    position: {show: false},
  },
  reducers: {
    set: (state, action) => {
      state.position = action.payload;
    },
    unset: (state, action) => {
      state.position = {show: false};
    },
  },
});

export const { set, unset } = positionSlice.actions;

export const selectPosition = (state) => state.position.position;

export default positionSlice.reducer;
