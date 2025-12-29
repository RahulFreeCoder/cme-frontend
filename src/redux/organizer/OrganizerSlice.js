import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCme: null,   // { cmeId, title }
  cmeIds: [],  //  cmeids by organizer
};

const organizerSlice = createSlice({
  name: "organizer",
  initialState,
  reducers: {
    setListCmes(state, action) {
      state.cmeIds = action.payload;
    },
    setSelectedCmeRegistrations(state, action) {
      state.selectedCme = action.payload;
    },
    clearSelectedCmeRegistrations(state) {
      state.selectedCme = null;
    },
  },
});

export const { setSelectedCmeRegistrations, clearSelectedCmeRegistrations, setListCmes } =
  organizerSlice.actions;

export default organizerSlice.reducer;
