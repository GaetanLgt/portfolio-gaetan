/**
 * TechFeed Data Index
 * Export centralisé des données du Neural Feed
 */

export { signals, default as feedSignals } from './signals.js';
export { categories, default as feedCategories } from './categories.js';
export { quotes, default as feedQuotes } from './quotes.js';

// Helpers
export const getSignalsByCategory = (signals, categoryId) => {
  if (categoryId === 'all') return signals;
  return signals.filter(s => s.categoryId === categoryId);
};

export const getCountByCategory = (signals, categoryId) => {
  if (categoryId === 'all') return signals.length;
  return signals.filter(s => s.categoryId === categoryId).length;
};

export const getFeaturedSignal = (signals) => {
  return signals.find(s => s.type === 'featured');
};

export const getRegularSignals = (signals, featuredId) => {
  return signals.filter(s => s.id !== featuredId);
};
