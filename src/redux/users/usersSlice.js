import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllUsers } from "../../services/usersApi";

// Async thunks
export const getUsers = createAsyncThunk("users/getAll", async () => {
  const res = await fetchAllUsers();
  return res;
});

// Slice
const slice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export default slice.reducer;
