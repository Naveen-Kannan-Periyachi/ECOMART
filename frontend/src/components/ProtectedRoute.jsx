import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Verifying authentication...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
