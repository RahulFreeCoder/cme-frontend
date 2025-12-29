import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUpcomingEvents, fetchEventStats } from "../../services/eventsApi";

export const getUpcomingEvents = createAsyncThunk(
  "events/getUpcoming",
  async (startDateFrom, { rejectWithValue }) => {
    try {
      return await fetchUpcomingEvents(startDateFrom);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getEventStats = createAsyncThunk("events/getStats", async () => {
  const res = await fetchEventStats();
  return res;
});

const slice = createSlice({
  name: "cmeevents",
  initialState: {
    events: [],
    stats: { totalEvents: 0, registered: 0, upcoming: 0 },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUpcomingEvents.pending, (state) => { state.loading = true; })
      .addCase(getUpcomingEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(getUpcomingEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getEventStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default slice.reducer;
