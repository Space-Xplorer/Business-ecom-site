import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await axios.get('http://localhost:8080/user/status', { withCredentials: true });
      if (res.data.isAuthenticated) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:8080/user/login', { email, password }, { withCredentials: true });
    await checkAuth();
    return res;
  };

  const logout = async () => {
    await axios.post('http://localhost:8080/user/logout', {}, { withCredentials: true });
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
    const syncLogout = () => {
      checkAuth();
    };
    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}; 