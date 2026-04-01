const admin = require('../config/firebase');

/**
 * Send a push notification to a specific user using their FCM token
 * @param {string} fcmToken - The device token to send to
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Optional extra data payload
 */
const sendNotification = async (fcmToken, title, body, data = {}) => {
  if (!fcmToken) {
    console.warn('No FCM token provided, skipping notification');
    return;
  }

  const message = {
    notification: {
      title,
      body,
    },
    data: data,
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent notification:', response);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

module.exports = { sendNotification };
