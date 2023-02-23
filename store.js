import { configureStore } from "@reduxjs/toolkit";
import positionReducer from "./slices/position-slice";

export const store = configureStore({
  reducer: {
    position: positionReducer,
  },
});
