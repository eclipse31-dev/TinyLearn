import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on component mount
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    console.log('AuthContext: Initializing, savedToken:', savedToken ? 'exists' : 'missing');
    
    if (savedToken && savedUser) {
      console.log('AuthContext: Setting token and user from localStorage');
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      // Set the token in axios headers globally
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    
    console.log('AuthContext: Setting loading to false');
    setLoading(false);
  }, []);

  // Update axios headers whenever token changes
  useEffect(() => {
    if (token) {
      console.log('AuthContext: Token updated, setting axios headers');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = (userData, authToken) => {
    console.log('AuthContext: login() called with token:', authToken ? 'exists' : 'missing');
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    console.log('AuthContext: login() complete, token set');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}