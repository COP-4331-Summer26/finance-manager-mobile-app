import client from './client';

// Categories
export const getCategories = () => client.get('/categories').then((r) => r.data);
export const addCategory = (data) => client.post('/categories', data).then((r) => r.data);
export const editCategory = (id, data) => client.put(`/categories/${id}`, data).then((r) => r.data);

// Cards
export const getCards = () => client.get('/cards').then((r) => r.data);
export const addCard = (data) => client.post('/cards', data).then((r) => r.data);

// Income
export const addIncome = (data) => client.post('/income', data).then((r) => r.data);

// Summary — month format: 'YYYY-MM'
export const getSummary = (month) =>
  client.get('/summary', { params: { month } }).then((r) => r.data);
