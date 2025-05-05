import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useSelector(state => state.authentication);
  
  // Check both isAuthenticated flag and token existence
  const isUserAuthenticated = isAuthenticated && token;

  // If not authenticated, redirect to login
  if (!isUserAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If authenticated and trying to access login page, redirect to dashboard
  if (isUserAuthenticated && window.location.pathname === '/login') {
    console.log('User already authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;