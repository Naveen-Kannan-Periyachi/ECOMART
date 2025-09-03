import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import productsReducer from '../features/productsSlice';
import dashboardReducer from '../features/dashboardSlice';
import cartReducer from '../features/cartSlice';
import orderReducer from '../features/orderSlice';
import bookingReducer from '../features/bookingSlice';
import adminReducer from '../features/adminSlice';
<<<<<<< HEAD
import recommendationsReducer from '../features/recommendationsSlice';
import notificationReducer from '../features/notificationSlice';
import negotiationReducer from '../features/negotiationSlice';
=======
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    dashboard: dashboardReducer,
    cart: cartReducer,
    orders: orderReducer,
    bookings: bookingReducer,
    admin: adminReducer,
<<<<<<< HEAD
    recommendations: recommendationsReducer,
    notifications: notificationReducer,
    negotiations: negotiationReducer,
=======
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
  },
});
