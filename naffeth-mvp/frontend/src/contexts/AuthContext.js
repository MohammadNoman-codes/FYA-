import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('naffeth_token'));
  const [loading, setLoading] = useState(true); // To check initial auth status

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        localStorage.setItem('naffeth_token', token); // Ensure token is in localStorage
        try {
          // Use the /api/auth/me endpoint to get user data
          const response = await api.get('/auth/me');
          setUser(response.data.data);
        } catch (error) {
          console.error("Auth verification failed:", error);
          // Token might be invalid or expired
          localStorage.removeItem('naffeth_token');
          setToken(null);
          setUser(null);
        }
      } else {
        localStorage.removeItem('naffeth_token'); // Clean up just in case
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]); // Re-run when token changes

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        setToken(response.data.token);
        // User data will be fetched by the useEffect hook
        return true;
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      // Handle login errors (e.g., show message to user)
      return false;
    }
    return false;
  };

   const register = async (name, email, password, role = 'student') => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      if (response.data.success) {
        setToken(response.data.token);
         // User data will be fetched by the useEffect hook
        return true;
      }
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      // Handle registration errors
      return false;
    }
    return false;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('naffeth_token');
    // Optionally redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
