import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

// Async thunks for admin operations

// Users management
export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

<<<<<<< HEAD
export const getUserDetails = createAsyncThunk(
  'admin/getUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

=======
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return { ...response.data, userId };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Products management
export const getAllProducts = createAsyncThunk(
  'admin/getAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/products');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/products/${productId}`);
      return { ...response.data, productId };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Orders management
export const getAllOrders = createAsyncThunk(
  'admin/getAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/orders');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

<<<<<<< HEAD
// User-specific item management
export const deleteUserProduct = createAsyncThunk(
  'admin/deleteUserProduct',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/users/${userId}/products/${productId}`);
      return { ...response.data, productId };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteUserOrder = createAsyncThunk(
  'admin/deleteUserOrder',
  async ({ userId, orderId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/users/${userId}/orders/${orderId}`);
      return { ...response.data, orderId };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteUserChat = createAsyncThunk(
  'admin/deleteUserChat',
  async ({ userId, chatId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/users/${userId}/chats/${chatId}`);
      return { ...response.data, chatId };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

=======
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
<<<<<<< HEAD
    userDetails: null,
=======
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
    products: [],
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
<<<<<<< HEAD
    clearUserDetails: (state) => {
      state.userDetails = null;
    },
=======
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
  },
  extraReducers: (builder) => {
    builder
      // Users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload.data;
        const index = state.users.findIndex(user => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], role: updatedUser.role };
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload.userId);
      })
<<<<<<< HEAD
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload.data;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUserProduct.fulfilled, (state, action) => {
        if (state.userDetails) {
          state.userDetails.products = state.userDetails.products.filter(
            product => product._id !== action.payload.productId
          );
          state.userDetails.stats.totalProducts -= 1;
        }
      })
      .addCase(deleteUserOrder.fulfilled, (state, action) => {
        if (state.userDetails) {
          state.userDetails.orders = state.userDetails.orders.filter(
            order => order._id !== action.payload.orderId
          );
          state.userDetails.stats.totalOrders -= 1;
        }
      })
      .addCase(deleteUserChat.fulfilled, (state, action) => {
        if (state.userDetails) {
          state.userDetails.chats = state.userDetails.chats.filter(
            chat => chat._id !== action.payload.chatId
          );
          state.userDetails.stats.totalChats -= 1;
        }
      })
=======
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
      // Products
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(product => product._id !== action.payload.productId);
      })
      // Orders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload.data;
        const index = state.orders.findIndex(order => order._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      });
  },
});

<<<<<<< HEAD
export const { clearError, clearUserDetails } = adminSlice.actions;
=======
export const { clearError } = adminSlice.actions;
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
export default adminSlice.reducer;
