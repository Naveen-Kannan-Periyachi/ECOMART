import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, CircularProgress, Typography } from '@mui/material';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
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
