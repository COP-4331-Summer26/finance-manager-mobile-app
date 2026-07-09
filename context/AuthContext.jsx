import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../api/auth';
import { setUnauthorizedHandler } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  // On app start, check AsyncStorage for a stored session before
  // deciding whether to show the auth stack or the tabs.
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
      } finally {
        setBootstrapped(true);
      }
    })();
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    setUser(null);
  }, []);

  // If a request comes back 401, boot the user back to the login screen.
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
  }, []);

  const login = async (email, password) => {
    const { token, user } = await authApi.login(email, password);
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const register = async (name, email, password) => {
    const { token, user } = await authApi.register(name, email, password);
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, bootstrapped, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
