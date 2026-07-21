import client from './client';

const normalize = (obj) => ({ ...obj, id: obj.id || obj._id });
const normalizeList = (list) => list.map(normalize);

// Categories
export const getCategories = () => client.get('/categories').then((r) => normalizeList(r.data));
export const addCategory = (data) => client.post('/categories', data).then((r) => normalize(r.data));
export const editCategory = (id, data) => client.put(`/categories/${id}`, data).then((r) => normalize(r.data));
export const deleteCategory = (id) => client.delete(`/categories/${id}`).then((r) => r.data);

// Cards
export const getCards = () => client.get('/cards').then((r) => normalizeList(r.data));
export const addCard = (data) => client.post('/cards', data).then((r) => normalize(r.data));
export const deleteCard = (id) => client.delete(`/cards/${id}`).then((r) => r.data);

// Income
export const addIncome = (data) => client.post('/income', data).then((r) => normalize(r.data));

// Summary — month format: 'YYYY-MM'
export const getSummary = (month) =>
  client.get('/summary', { params: { month } }).then((r) => r.data);