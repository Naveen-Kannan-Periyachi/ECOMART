import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

// Async thunks
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      console.log('=== CREATING PRODUCT DEBUG ===');
      console.log('Product data:', productData);
      console.log('API instance baseURL:', api.defaults.baseURL);
      
      // Create a test request to see URL construction
      console.log('Testing URL construction...');
      const testConfig = api.getUri({ url: '/products' });
      console.log('Constructed URL:', testConfig);
      
      console.log('Making actual API call...');
      const response = await api.post('/products', productData, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      console.log('Product creation successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('=== PRODUCT CREATION ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error config:', error.config);
      
      if (error.config) {
        const attemptedUrl = error.config.baseURL + error.config.url;
        console.error('Attempted URL:', attemptedUrl);
      }
      
      const errorData = error.response?.data || { message: error.message };
      console.error('Returning error data:', errorData);
      return rejectWithValue(errorData);
    }
  }
);

export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get('/products', { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProductError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        // Ensure error is always a string or serializable object
        const errorPayload = action.payload;
        if (typeof errorPayload === 'string') {
          state.error = errorPayload;
        } else if (errorPayload && typeof errorPayload === 'object') {
          state.error = errorPayload.message || JSON.stringify(errorPayload);
        } else {
          state.error = 'An unknown error occurred';
        }
        console.log('Setting error state to:', state.error);
      })
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        );
        state.currentProduct = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearProductError, clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;
