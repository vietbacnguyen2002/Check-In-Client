import { createSlice } from "@reduxjs/toolkit";

interface StatusState {
  value: boolean;
}

const initialState: StatusState = {
  value: false,
};

export const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    update: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { update } = statusSlice.actions;

export default statusSlice.reducer;