import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import NegotiationService from '../services/negotiationService.js';

// Async thunks
export const startNegotiation = createAsyncThunk(
  'negotiations/startNegotiation',
  async ({ productId, proposedPrice, message }, { rejectWithValue }) => {
    try {
      const data = await NegotiationService.startNegotiation(productId, proposedPrice, message);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start negotiation');
    }
  }
);

export const fetchNegotiations = createAsyncThunk(
  'negotiations/fetchNegotiations',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await NegotiationService.getNegotiations(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch negotiations');
    }
  }
);

export const fetchNegotiation = createAsyncThunk(
  'negotiations/fetchNegotiation',
  async (negotiationId, { rejectWithValue }) => {
    try {
      const data = await NegotiationService.getNegotiation(negotiationId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch negotiation');
    }
  }
);

export const acceptNegotiation = createAsyncThunk(
  'negotiations/acceptNegotiation',
  async ({ negotiationId, message }, { rejectWithValue }) => {
    try {
      const data = await NegotiationService.acceptNegotiation(negotiationId, message);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept negotiation');
    }
  }
);

export const rejectNegotiation = createAsyncThunk(
  'negotiations/rejectNegotiation',
  async ({ negotiationId, message }, { rejectWithValue }) => {
    try {
      const data = await NegotiationService.rejectNegotiation(negotiationId, message);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject negotiation');
    }
  }
);

export const makeCounterOffer = createAsyncThunk(
  'negotiations/makeCounterOffer',
  async ({ negotiationId, counterOffer, message }, { rejectWithValue }) => {
    try {
      const data = await NegotiationService.makeCounterOffer(negotiationId, counterOffer, message);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to make counter offer');
    }
  }
);

export const cancelNegotiation = createAsyncThunk(
  'negotiations/cancelNegotiation',
  async (negotiationId, { rejectWithValue }) => {
    try {
      const data = await NegotiationService.cancelNegotiation(negotiationId);
      return { negotiationId, ...data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel negotiation');
    }
  }
);

export const fetchProductNegotiationStats = createAsyncThunk(
  'negotiations/fetchProductStats',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await NegotiationService.getProductNegotiationStats(productId);
      return { productId, ...data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch negotiation stats');
    }
  }
);

const initialState = {
  negotiations: [],
  currentNegotiation: null,
  productStats: {},
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalNegotiations: 0,
    hasMore: false
  },
  filters: {
    role: 'all', // all, buyer, seller
    status: 'all' // all, pending, accepted, rejected, counter_offered, expired
  }
};

const negotiationSlice = createSlice({
  name: 'negotiations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearCurrentNegotiation: (state) => {
      state.currentNegotiation = null;
    },
    
    clearNegotiations: (state) => {
      state.negotiations = [];
      state.pagination = initialState.pagination;
    },
    
    // Update negotiation locally (for real-time updates)
    updateNegotiationLocal: (state, action) => {
      const updatedNegotiation = action.payload;
      const index = state.negotiations.findIndex(n => n._id === updatedNegotiation._id);
      
      if (index !== -1) {
        state.negotiations[index] = updatedNegotiation;
      }
      
      if (state.currentNegotiation?._id === updatedNegotiation._id) {
        state.currentNegotiation = updatedNegotiation;
      }
    },
    
    // Add new negotiation (for real-time updates)
    addNegotiationLocal: (state, action) => {
      const newNegotiation = action.payload;
      state.negotiations.unshift(newNegotiation);
    }
  },
  extraReducers: (builder) => {
    builder
      // Start negotiation
      .addCase(startNegotiation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startNegotiation.fulfilled, (state, action) => {
        state.loading = false;
        state.negotiations.unshift(action.payload.negotiation);
        state.error = null;
      })
      .addCase(startNegotiation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch negotiations
      .addCase(fetchNegotiations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNegotiations.fulfilled, (state, action) => {
        state.loading = false;
        const { negotiations, pagination } = action.payload;
        
        if (pagination.currentPage === 1) {
          state.negotiations = negotiations;
        } else {
          state.negotiations.push(...negotiations);
        }
        
        state.pagination = pagination;
        state.error = null;
      })
      .addCase(fetchNegotiations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single negotiation
      .addCase(fetchNegotiation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNegotiation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNegotiation = action.payload;
        state.error = null;
      })
      .addCase(fetchNegotiation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Accept negotiation
      .addCase(acceptNegotiation.fulfilled, (state, action) => {
        const updatedNegotiation = action.payload.negotiation;
        const index = state.negotiations.findIndex(n => n._id === updatedNegotiation._id);
        
        if (index !== -1) {
          state.negotiations[index] = updatedNegotiation;
        }
        
        if (state.currentNegotiation?._id === updatedNegotiation._id) {
          state.currentNegotiation = updatedNegotiation;
        }
      })
      
      // Reject negotiation
      .addCase(rejectNegotiation.fulfilled, (state, action) => {
        const updatedNegotiation = action.payload.negotiation;
        const index = state.negotiations.findIndex(n => n._id === updatedNegotiation._id);
        
        if (index !== -1) {
          state.negotiations[index] = updatedNegotiation;
        }
        
        if (state.currentNegotiation?._id === updatedNegotiation._id) {
          state.currentNegotiation = updatedNegotiation;
        }
      })
      
      // Make counter offer
      .addCase(makeCounterOffer.fulfilled, (state, action) => {
        const updatedNegotiation = action.payload.negotiation;
        const index = state.negotiations.findIndex(n => n._id === updatedNegotiation._id);
        
        if (index !== -1) {
          state.negotiations[index] = updatedNegotiation;
        }
        
        if (state.currentNegotiation?._id === updatedNegotiation._id) {
          state.currentNegotiation = updatedNegotiation;
        }
      })
      
      // Cancel negotiation
      .addCase(cancelNegotiation.fulfilled, (state, action) => {
        const negotiationId = action.payload.negotiationId;
        state.negotiations = state.negotiations.filter(n => n._id !== negotiationId);
        
        if (state.currentNegotiation?._id === negotiationId) {
          state.currentNegotiation = null;
        }
      })
      
      // Fetch product negotiation stats
      .addCase(fetchProductNegotiationStats.fulfilled, (state, action) => {
        const { productId, ...stats } = action.payload;
        state.productStats[productId] = stats;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearCurrentNegotiation,
  clearNegotiations,
  updateNegotiationLocal,
  addNegotiationLocal
} = negotiationSlice.actions;

export default negotiationSlice.reducer;
