import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

// Create booking request
export const createBookingRequest = createAsyncThunk(
  'bookings/createRequest',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/bookings', bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get user's bookings
export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUserBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/bookings/mybookings');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get owner's bookings
export const fetchOwnerBookings = createAsyncThunk(
  'bookings/fetchOwnerBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/bookings/owner');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Confirm booking
export const confirmBooking = createAsyncThunk(
  'bookings/confirm',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/bookings/${bookingId}/confirm`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Cancel booking
export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    userBookings: [],
    ownerBookings: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create booking request
      .addCase(createBookingRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.userBookings.unshift(action.payload);
      })
      .addCase(createBookingRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create booking';
      })

      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.userBookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch bookings';
      })

      // Fetch owner bookings
      .addCase(fetchOwnerBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerBookings = action.payload;
      })
      .addCase(fetchOwnerBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch owner bookings';
      })

      // Confirm booking
      .addCase(confirmBooking.fulfilled, (state, action) => {
        const booking = action.payload;
        state.ownerBookings = state.ownerBookings.map(b =>
          b._id === booking._id ? booking : b
        );
      })

      // Cancel booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const booking = action.payload;
        state.userBookings = state.userBookings.map(b =>
          b._id === booking._id ? booking : b
        );
        state.ownerBookings = state.ownerBookings.map(b =>
          b._id === booking._id ? booking : b
        );
      });
  },
});

export const { clearBookingError } = bookingSlice.actions;

export default bookingSlice.reducer;
