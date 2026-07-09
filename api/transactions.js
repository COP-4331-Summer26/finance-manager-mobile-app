import client from './client';

// params: { limit, sort, category, start, end }
export const getTransactions = (params = {}) =>
  client.get('/transactions', { params }).then((r) => r.data);

export const addTransaction = (data) =>
  client.post('/transactions', data).then((r) => r.data);

export const editTransaction = (id, data) =>
  client.put(`/transactions/${id}`, data).then((r) => r.data);

export const deleteTransaction = (id) =>
  client.delete(`/transactions/${id}`).then((r) => r.data);
