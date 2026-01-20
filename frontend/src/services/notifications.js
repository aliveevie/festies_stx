/**
 * ============================================================================
 * Notifications Service
 * ============================================================================
 * Service for managing application notifications
 * ============================================================================
 */

let notificationId = 0;
const listeners = new Set();

/**
 * Notification types
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

/**
 * Subscribe to notification events
 * @param {Function} callback - Callback function
 * @returns {Function} - Unsubscribe function
 */
export const subscribe = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

/**
 * Notify all listeners
 * @param {object} notification - Notification object
 */
const notify = (notification) => {
  listeners.forEach(callback => callback(notification));
};

/**
 * Show a success notification
 * @param {string} message - Notification message
 * @param {object} options - Additional options
 */
export const success = (message, options = {}) => {
  notify({
    id: ++notificationId,
    type: NOTIFICATION_TYPES.SUCCESS,
    message,
    ...options,
  });
};

/**
 * Show an error notification
 * @param {string} message - Notification message
 * @param {object} options - Additional options
 */
export const error = (message, options = {}) => {
  notify({
    id: ++notificationId,
    type: NOTIFICATION_TYPES.ERROR,
    message,
    ...options,
  });
};

/**
 * Show a warning notification
 * @param {string} message - Notification message
 * @param {object} options - Additional options
 */
export const warning = (message, options = {}) => {
  notify({
    id: ++notificationId,
    type: NOTIFICATION_TYPES.WARNING,
    message,
    ...options,
  });
};

/**
 * Show an info notification
 * @param {string} message - Notification message
 * @param {object} options - Additional options
 */
export const info = (message, options = {}) => {
  notify({
    id: ++notificationId,
    type: NOTIFICATION_TYPES.INFO,
    message,
    ...options,
  });
};

/**
 * Show a notification
 * @param {string} type - Notification type
 * @param {string} message - Notification message
 * @param {object} options - Additional options
 */
export const show = (type, message, options = {}) => {
  notify({
    id: ++notificationId,
    type,
    message,
    ...options,
  });
};
// Style improvement
