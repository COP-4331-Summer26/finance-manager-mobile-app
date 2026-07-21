import client from './client';

// The backend returns raw Mongo documents (_id, not id). Normalize here
// so the rest of the app can consistently use `.id` — this is what was
// causing edit/delete to silently call `/transactions/undefined`.
const normalize = (tx) => ({ ...tx, id: tx.id || tx._id });
const normalizeList = (list) => list.map(normalize);

// params: { limit, sort, category, start, end }
export const getTransactions = (params = {}) =>
  client.get('/transactions', { params }).then((r) => normalizeList(r.data));

export const addTransaction = (data) =>
  client.post('/transactions', data).then((r) => normalize(r.data));

export const editTransaction = (id, data) =>
  client.put(`/transactions/${id}`, data).then((r) => normalize(r.data));

export const deleteTransaction = (id) =>
  client.delete(`/transactions/${id}`).then((r) => r.data);