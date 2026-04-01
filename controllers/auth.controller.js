const User = require('../models/User.model');
const admin = require('../config/firebase');

const authController = {
  // POST /auth/verify-otp
  // The client verifies the SMS with Firebase, then sends the resulting idToken here
  verifyOtp: async (req, res) => {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return res.status(400).json({ success: false, message: 'Firebase ID Token is required' });
      }

      // Verify the ID token with Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const phoneNumber = decodedToken.phone_number;
      const firebaseUid = decodedToken.uid;

      if (!phoneNumber) {
        return res.status(400).json({ success: false, message: 'Invalid token: Phone number missing' });
      }

      // Check if user exists in our DB
      let user = await User.findOne({ phoneNumber });
      let isNewUser = false;

      if (!user) {
        isNewUser = true;
        return res.status(200).json({
          success: true,
          message: 'Firebase verification successful. User record not found, please register.',
          isNewUser: true,
          phoneNumber,
          firebaseUid
        });
      }

      res.status(200).json({
        success: true,
        message: 'Login successful',
        isNewUser: false,
        user
      });
    } catch (error) {
      console.error('Firebase Verify Error:', error);
      res.status(401).json({ success: false, message: 'Invalid or expired Firebase token' });
    }
  },

  // POST /auth/register
  register: async (req, res) => {
    try {
      const { 
        phoneNumber, 
        firstName, 
        lastName, 
        email, 
        role, 
        firebaseUid,
        addressType,
        villageArea,
        cityTehsil,
        pincode
      } = req.body;

      if (!phoneNumber || !firstName || !lastName || !role) {
        return res.status(400).json({ success: false, message: 'Phone number, First Name, Last Name, and Role are required' });
      }

      // Ensure user doesn't already exist
      let user = await User.findOne({ phoneNumber });
      if (user) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      // Create new user in our DB
      user = new User({
        phoneNumber,
        firstName,
        lastName,
        email,
        role,
        firebaseUid,
        address: {
          addressType: addressType || 'home',
          villageArea,
          cityTehsil,
          pincode
        },
        isVerified: true,
        kycStatus: 'pending'
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        user
      });
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // POST /auth/logout
  logout: async (req, res) => {
    // With pure Firebase on the frontend, logout is handled there (deleting the token).
    // We can just return success here.
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  },

  // GET /auth/me
  // This uses the 'protect' middleware to verify the token
  getProfile: async (req, res) => {
    try {
      res.status(200).json({ success: true, user: req.user });
    } catch (error) {
      console.error('Get Profile Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // POST /auth/fcm-token
  updateFcmToken: async (req, res) => {
    try {
      const { fcmToken } = req.body;
      if (!fcmToken) {
        return res.status(400).json({ success: false, message: 'FCM Token is required' });
      }

      req.user.fcmToken = fcmToken;
      await req.user.save();

      res.status(200).json({ success: true, message: 'FCM Token updated successfully' });
    } catch (error) {
      console.error('Update FCM Token Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // PUT /auth/update-profile
  updateProfile: async (req, res) => {
    try {
      const { firstName, lastName, email, addressType, villageArea, cityTehsil, pincode } = req.body;
      const user = req.user;

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      
      if (addressType || villageArea || cityTehsil || pincode) {
        if (!user.address) user.address = {};
        if (addressType) user.address.addressType = addressType;
        if (villageArea) user.address.villageArea = villageArea;
        if (cityTehsil) user.address.cityTehsil = cityTehsil;
        if (pincode) user.address.pincode = pincode;
      }

      await user.save();
      res.status(200).json({ success: true, message: 'Profile updated successfully', user });
    } catch (error) {
      console.error('Update Profile error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
};

module.exports = authController;
