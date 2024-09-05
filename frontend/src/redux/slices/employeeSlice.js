"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  info: localStorage.getItem("employeeInfo")
    ? JSON.parse(window.localStorage.getItem("employeeInfo"))
    : null,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.info = action.payload;
      localStorage.setItem("employeeInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.info = null;
      localStorage.clear();
    },
  },
});

const employeeReducer = employeeSlice.reducer;

export const { setCredentials, logout } = employeeSlice.actions;
export default employeeReducer;
