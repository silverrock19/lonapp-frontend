import { createContext, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated, selectUserRole } from '../store/slices/authSlice.js';
import { logout } from '../store/actions/auth.js';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    role,
    logout,
  }), [user, isAuthenticated, role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthProvider;
