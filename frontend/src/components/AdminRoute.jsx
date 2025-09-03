import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
<<<<<<< HEAD
import { Box, CircularProgress, Typography } from '@mui/material';
=======
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
<<<<<<< HEAD
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
          bgcolor: '#f9fafb'
        }}
      >
        <CircularProgress size={50} sx={{ color: '#667eea' }} />
        <Typography variant="body1" color="text.secondary">
          Verifying admin permissions...
        </Typography>
      </Box>
=======
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary"></div>
      </div>
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
    );
  }

  if (!isAuthenticated) {
    toast.error('Please login to access admin panel');
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    toast.error('Admin access required. Insufficient permissions.');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
