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
    unique: true,
    sparse: true,
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
  role: {
    type: String,
    enum: ['retailer', 'distributor', 'farmer', 'admin'],
    required: true,
    default: 'farmer'
  },
  kycDetails: {
    shopName: {
      type: String,
      trim: true,
    },
    licenseImage: {
      type: String, // URL/Path to image
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    gstImage: {
      type: String, // URL/Path to image
    },
    aadharCardImage: {
      type: String, // URL/Path to image
    }
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'submitted', 'approved', 'rejected'],
    default: 'pending'
  },
  isTest: {
    type: Boolean,
    default: false
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
