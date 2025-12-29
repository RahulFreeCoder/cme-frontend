import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerCME } from "../../services/cmeRegistrationApi";
import toast from "react-hot-toast";

export const submitCMERegistration = createAsyncThunk(
  "cmeRegistration/submit",
  async (payload, { rejectWithValue }) => {
    try {
      return await registerCME(payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Registration submission failed"
      );
    }
  }
);

const cmeRegistrationSlice = createSlice({
  name: "cmeRegistration",
  initialState: {
    submitting: false,
    successMessage: null,
    errorMessage: null,
    errors: null,
  },
  reducers: {
    clearCMERegistrationStatus: (state) => {
      state.successMessage = null;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitCMERegistration.pending, (state) => {
        state.submitting = true;
        state.errorMessage = null;
      })
      .addCase(submitCMERegistration.fulfilled, (state, action) => {
        state.submitting = false;
        state.successMessage = action.payload.message;
        toast.success("CME Registration successful 🎉", {
          id: "cmeRegister",
        });
      })
      .addCase(submitCMERegistration.rejected, (state, action) => {
        state.submitting = false;
        state.errorMessage = action.payload.message;
        toast.error(action.payload.errorMessage || "Registration failed", {
          id: "cmeRegister",
        });
      });
  },
});

export const { clearCMERegistrationStatus } =
  cmeRegistrationSlice.actions;
export default cmeRegistrationSlice.reducer;
