import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const productSlice = createSlice({
  name: "product",
  initialState: {
    ...initialState,
  },
  reducers: {},
});

export default productSlice.reducer;
