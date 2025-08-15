import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import productsReducer from '../features/productsSlice';
import dashboardReducer from '../features/dashboardSlice';
import cartReducer from '../features/cartSlice';
import orderReducer from '../features/orderSlice';
import bookingReducer from '../features/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    dashboard: dashboardReducer,
    cart: cartReducer,
    orders: orderReducer,
    bookings: bookingReducer,
  },
});
