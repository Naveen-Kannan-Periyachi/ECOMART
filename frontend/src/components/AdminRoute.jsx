import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary"></div>
      </div>
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
