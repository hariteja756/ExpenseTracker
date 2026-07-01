import { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await API.get('/auth/me');
          setUser(data);
        } catch (error) {
          console.error('Session expired or invalid token', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
    });
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
    });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
