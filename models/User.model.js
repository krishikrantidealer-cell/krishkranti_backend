const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  shopName: {
    type: String,
    trim: true,
  },
  address: {
    addressType: {
      type: String,
      enum: ['shop', 'home', 'godown', 'other'],
      default: 'home'
    },
    villageArea: {
      type: String,
      trim: true,
    },
    cityTehsil: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    }
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  fcmToken: {
    type: String, // Store the primary device token
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
