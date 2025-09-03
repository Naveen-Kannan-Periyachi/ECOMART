import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';
import logger from '../utils/logger';

// Async thunks
export const getRecommendations = createAsyncThunk(
  'recommendations/getRecommendations',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/recommend/${userId || ''}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations');
    }
  }
);

export const getTrendingProducts = createAsyncThunk(
  'recommendations/getTrendingProducts',
  async (limit = 8, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/trending?limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trending products');
    }
  }
);

export const logActivity = createAsyncThunk(
  'recommendations/logActivity',
  async ({ productId, action, metadata = {} }, { rejectWithValue }) => {
    try {
      const response = await api.post('/activity', {
        productId,
        action,
        metadata
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to log activity');
    }
  }
);

export const getUserActivity = createAsyncThunk(
  'recommendations/getUserActivity',
  async ({ userId, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/activity/user/${userId || ''}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user activity');
    }
  }
);

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState: {
    recommendations: [],
    trendingProducts: [],
    userActivity: [],
    loading: false,
    trendingLoading: false,
    activityLoading: false,
    error: null,
    metadata: null,
    activityMetadata: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRecommendations: (state) => {
      state.recommendations = [];
      state.metadata = null;
    },
    clearTrending: (state) => {
      state.trendingProducts = [];
    },
    clearActivity: (state) => {
      state.userActivity = [];
      state.activityMetadata = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Recommendations
      .addCase(getRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload.data || [];
        state.metadata = action.payload.metadata || null;
      })
      .addCase(getRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Trending Products
      .addCase(getTrendingProducts.pending, (state) => {
        state.trendingLoading = true;
        state.error = null;
      })
      .addCase(getTrendingProducts.fulfilled, (state, action) => {
        state.trendingLoading = false;
        state.trendingProducts = action.payload.data || [];
      })
      .addCase(getTrendingProducts.rejected, (state, action) => {
        state.trendingLoading = false;
        state.error = action.payload;
      })
      
      // Log Activity
      .addCase(logActivity.pending, () => {
        // Don't show loading for activity logging
      })
      .addCase(logActivity.fulfilled, () => {
        // Activity logged successfully
      })
      .addCase(logActivity.rejected, (state, action) => {
        // Silent fail for activity logging
        logger.debug('Activity logging failed:', action.payload);
      })
      
      // Get User Activity
      .addCase(getUserActivity.pending, (state) => {
        state.activityLoading = true;
        state.error = null;
      })
      .addCase(getUserActivity.fulfilled, (state, action) => {
        state.activityLoading = false;
        state.userActivity = action.payload.data || [];
        state.activityMetadata = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages,
          count: action.payload.count
        };
      })
      .addCase(getUserActivity.rejected, (state, action) => {
        state.activityLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearRecommendations, clearTrending, clearActivity } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;
