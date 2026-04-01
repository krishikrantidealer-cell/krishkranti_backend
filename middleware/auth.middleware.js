const admin = require('../config/firebase');
const User = require('../models/User.model');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in the Authorization header (Firebase ID Token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no Firebase token provided' });
    }

    // Verify token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    const phoneNumber = decodedToken.phone_number;

    if (!phoneNumber) {
      return res.status(401).json({ success: false, message: 'Invalid token: Phone number missing' });
    }

    // Get user from our database based on the verified phone number
    const user = await User.findOne({ phoneNumber }).select('-__v');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User record not found in database' });
    }

    // Attach user information to the request
    req.user = user;
    req.firebaseUid = decodedToken.uid;
    next();
  } catch (error) {
    console.error('Firebase Auth Middleware Error:', error);
    res.status(401).json({ success: false, message: 'Not authorized, Firebase token verification failed' });
  }
};

module.exports = { protect };
