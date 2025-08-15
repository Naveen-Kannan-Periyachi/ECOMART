import { getUserProfile, logout } from '../features/authSlice';

export const initializeAuth = async (store) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      // Use unwrap to properly handle the rejection
      await store.dispatch(getUserProfile()).unwrap();
    } catch (error) {
      // If token is invalid or expired, clear it and reset auth state
      store.dispatch(logout());
    }
  }
};
