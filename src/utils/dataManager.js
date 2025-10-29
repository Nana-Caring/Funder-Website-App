/**
 * Data Management Utilities
 * Handles caching, persistence, and data freshness for the application
 */

// Cache duration settings
export const CACHE_SETTINGS = {
  DEPENDENTS: 5 * 60 * 1000, // 5 minutes
  STATS: 2 * 60 * 1000, // 2 minutes  
  TRANSACTIONS: 3 * 60 * 1000, // 3 minutes
  ACTIVITY: 1 * 60 * 1000, // 1 minute
};

/**
 * Check if cached data is still fresh
 * @param {string} cacheKey - The cache key to check
 * @param {number} maxAge - Maximum age in milliseconds
 * @returns {boolean} - True if data is fresh
 */
export const isCacheFresh = (cacheKey, maxAge = CACHE_SETTINGS.DEPENDENTS) => {
  try {
    const timestamp = localStorage.getItem(cacheKey);
    if (!timestamp) return false;
    
    return (Date.now() - parseInt(timestamp)) < maxAge;
  } catch (error) {
    console.log('Cache check failed:', error);
    return false;
  }
};

/**
 * Set cache timestamp
 * @param {string} cacheKey - The cache key to set
 */
export const setCacheTimestamp = (cacheKey) => {
  try {
    localStorage.setItem(cacheKey, Date.now().toString());
  } catch (error) {
    console.log('Cache set failed:', error);
  }
};

/**
 * Clear specific cache
 * @param {string} cacheKey - The cache key to clear
 */
export const clearCache = (cacheKey) => {
  try {
    localStorage.removeItem(cacheKey);
    console.log(`🗑️ Cleared cache: ${cacheKey}`);
  } catch (error) {
    console.log('Cache clear failed:', error);
  }
};

/**
 * Clear all caregiver related cache for a user
 * @param {string} userId - User ID
 */
export const clearAllUserCache = (userId) => {
  const cacheKeys = [
    `caregiver_last_fetch_${userId || 'default'}`,
    `caregiver_stats_${userId || 'default'}`,
    `caregiver_transactions_${userId || 'default'}`,
    `caregiver_activity_${userId || 'default'}`,
  ];
  
  cacheKeys.forEach(clearCache);
};

/**
 * Generate cache key for user-specific data
 * @param {string} dataType - Type of data (dependents, stats, etc.)
 * @param {string} userId - User ID
 * @returns {string} - Cache key
 */
export const getCacheKey = (dataType, userId) => {
  return `caregiver_${dataType}_${userId || 'default'}`;
};

/**
 * Batch check if multiple data types need refresh
 * @param {string} userId - User ID
 * @returns {object} - Object with boolean values for each data type
 */
export const getRefreshStatus = (userId) => {
  return {
    dependents: !isCacheFresh(getCacheKey('last_fetch', userId), CACHE_SETTINGS.DEPENDENTS),
    stats: !isCacheFresh(getCacheKey('stats', userId), CACHE_SETTINGS.STATS),
    transactions: !isCacheFresh(getCacheKey('transactions', userId), CACHE_SETTINGS.TRANSACTIONS),
    activity: !isCacheFresh(getCacheKey('activity', userId), CACHE_SETTINGS.ACTIVITY),
  };
};

export default {
  CACHE_SETTINGS,
  isCacheFresh,
  setCacheTimestamp,
  clearCache,
  clearAllUserCache,
  getCacheKey,
  getRefreshStatus,
};