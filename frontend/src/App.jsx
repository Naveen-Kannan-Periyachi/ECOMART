import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import useWebSocket from './hooks/useWebSocket';
import './styles/productDisplay.css';
import Register from './pages/Register';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Chat from './pages/Chat';
import ChatList from './pages/ChatList';
import OrderDetails from './pages/OrderDetails';
import Negotiations from './pages/Negotiations';
import Home from './pages/Home';
import ApiTest from './pages/ApiTest';
import DirectApiTest from './pages/DirectApiTest';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetails from './pages/admin/AdminUserDetails';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';


function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Initialize WebSocket connection
  useWebSocket();
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: isAdminRoute ? '#f9fafb' : '#f5f5f5'
    }}>
      {!isAdminRoute && <Navbar />}
      <Box sx={{
        flex: 1,
        animation: 'fadeInPage 0.7s',
        '@keyframes fadeInPage': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }} key={location.pathname}>
        <Routes location={location}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="/direct-api-test" element={<DirectApiTest />} />
          
          {/* Product routes - specific routes before parameterized ones */}
          <Route
            path="/products/add"
            element={
              <ProtectedRoute>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          
          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/orders"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/new"
            element={
              <ProtectedRoute>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/edit/:id"
            element={
              <ProtectedRoute>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/chats" element={<ChatList />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route 
            path="/negotiations" 
            element={
              <ProtectedRoute>
                <Negotiations />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/negotiations/:negotiationId" 
            element={
              <ProtectedRoute>
                <Negotiations />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<AdminUserDetails />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
