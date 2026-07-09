import client from './client';

export const register = (name, email, password) =>
  client.post('/auth/register', { name, email, password }).then((r) => r.data);

export const login = (email, password) =>
  client.post('/auth/login', { email, password }).then((r) => r.data);

export const forgotPassword = (email) =>
  client.post('/auth/forgot-password', { email }).then((r) => r.data);

export const getMe = () => client.get('/users/me').then((r) => r.data);

// NOTE: endpoint/field names here are a best guess (PUT /users/me/password
// with { currentPassword, newPassword }). Confirm the exact route and
// payload shape with whoever owns the backend auth code before relying
// on this — if it 404s, that's the first thing to check.
export const changePassword = (currentPassword, newPassword) =>
  client.put('/users/me/password', { currentPassword, newPassword }).then((r) => r.data);
