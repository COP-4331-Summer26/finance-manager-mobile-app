import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set this to your machine's LAN IP when testing on a physical phone via Expo Go
// (localhost on the phone refers to the phone itself, not your computer).
// e.g. http://192.168.1.23:5000/api
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_URL,
});

// Attach the JWT to every request if we have one
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, clear storage.
// (Actual redirect-to-login happens in AuthContext, since navigation
// isn't reachable from here.)
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

client.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await AsyncStorage.multiRemove(['token', 'user']);
      onUnauthorized?.();
    }
    return Promise.reject(err);
  }
);

export default client;
