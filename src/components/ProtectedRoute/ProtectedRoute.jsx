import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useSelector(state => state.authentication);
  const location = useLocation();

  if (loading) {
    return null; // or your loader component
  }

  if (!isAuthenticated) {
    // Redirect to login while saving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect unauthorized users to a default route based on their role
    switch (user?.role) {
      case 'caregiver':
        return <Navigate to="/caregiver-home" replace />;
      case 'dependent':
        return <Navigate to="/dependent-home" replace />;
      case 'funder':
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;