"use client";
import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./slices/employeeSlice";
import apiSlice from "./api/apiSlice";

console.log("hellooo");
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    employee: employeeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
