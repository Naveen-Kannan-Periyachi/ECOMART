import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import NotificationService from '../services/notificationService.js';

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 1, limit = 20, unreadOnly = false }, { rejectWithValue }) => {
    try {
      const data = await NotificationService.getNotifications(page, limit, unreadOnly);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const count = await NotificationService.getUnreadCount();
      return count;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      await NotificationService.markAsRead(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await NotificationService.markAllAsRead();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
  totalPages: 1,
  browserPermission: 'default',
  realTimeNotification: null, // For showing toast notifications
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Add a real-time notification (from socket)
    addRealTimeNotification: (state, action) => {
      const newNotification = action.payload;
      
      // Add to the beginning of notifications list
      state.notifications.unshift(newNotification);
      
      // Update unread count if it's a new notification
      if (!newNotification.isRead) {
        state.unreadCount += 1;
      }
      
      // Set as real-time notification for toast display
      state.realTimeNotification = newNotification;
    },
    
    // Clear the real-time notification (after toast is shown)
    clearRealTimeNotification: (state) => {
      state.realTimeNotification = null;
    },
    
    // Update browser permission status
    setBrowserPermission: (state, action) => {
      state.browserPermission = action.payload;
    },
    
    // Clear all notifications
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.hasMore = true;
      state.currentPage = 1;
      state.totalPages = 1;
    },
    
    // Reset error state
    clearError: (state) => {
      state.error = null;
    },
    
    // Update notification locally (optimistic update)
    updateNotificationLocal: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.notifications.findIndex(n => n._id === id);
      if (index !== -1) {
        state.notifications[index] = { ...state.notifications[index], ...updates };
        
        // Update unread count if read status changed
        if (updates.isRead !== undefined) {
          if (updates.isRead && !state.notifications[index].isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          } else if (!updates.isRead && state.notifications[index].isRead) {
            state.unreadCount += 1;
          }
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state, action) => {
        // Only show loading for first page
        if (action.meta.arg?.page === 1) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        const { notifications, pagination } = action.payload;
        
        if (action.meta.arg?.page === 1) {
          // First page - replace notifications
          state.notifications = notifications;
        } else {
          // Subsequent pages - append notifications
          state.notifications.push(...notifications);
        }
        
        state.currentPage = pagination.currentPage;
        state.totalPages = pagination.totalPages;
        state.hasMore = pagination.hasMore;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      
      // Mark notification as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const index = state.notifications.findIndex(n => n._id === notificationId);
        if (index !== -1 && !state.notifications[index].isRead) {
          state.notifications[index].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      // Mark all notifications as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
      })
      
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const index = state.notifications.findIndex(n => n._id === notificationId);
        if (index !== -1) {
          const notification = state.notifications[index];
          if (!notification.isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications.splice(index, 1);
        }
      });
  },
});

export const {
  addRealTimeNotification,
  clearRealTimeNotification,
  setBrowserPermission,
  clearNotifications,
  clearError,
  updateNotificationLocal
} = notificationSlice.actions;

export default notificationSlice.reducer;
