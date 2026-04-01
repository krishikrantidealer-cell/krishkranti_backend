const User = require('../models/User.model');

const kycController = {
  // POST /kyc/submit
  submitKyc: async (req, res) => {
    try {
      const { role } = req.user;
      const { shopName, gstNumber } = req.body;
      const files = req.files;

      if (!files) {
        return res.status(400).json({ success: false, message: 'No documents uploaded' });
      }

      let updateData = {
        kycDetails: { ...req.user.kycDetails }
      };

      if (role === 'retailer') {
        if (!shopName || !files['licenseImage']) {
          return res.status(400).json({ success: false, message: 'Retailer requires shopName and licenseImage' });
        }
        updateData.kycDetails.shopName = shopName;
        updateData.kycDetails.licenseImage = files['licenseImage'][0].path;
      } else if (role === 'distributor') {
        if (!shopName || !gstNumber || !files['gstImage'] || !files['licenseImage']) {
          return res.status(400).json({ success: false, message: 'Distributor requires shopName, gstNumber, gstImage, and licenseImage' });
        }
        updateData.kycDetails.shopName = shopName;
        updateData.kycDetails.gstNumber = gstNumber;
        updateData.kycDetails.gstImage = files['gstImage'][0].path;
        updateData.kycDetails.licenseImage = files['licenseImage'][0].path;
      } else if (role === 'farmer') {
        if (!files['aadharCardImage']) {
          return res.status(400).json({ success: false, message: 'Farmer requires aadharCardImage' });
        }
        updateData.kycDetails.aadharCardImage = files['aadharCardImage'][0].path;
      } else {
        return res.status(400).json({ success: false, message: 'Invalid role for KYC submission' });
      }

      updateData.kycStatus = 'submitted';

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'KYC submitted successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('KYC Submission Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // GET /kyc/status
  getKycStatus: async (req, res) => {
    try {
      res.status(200).json({
        success: true,
        kycStatus: req.user.kycStatus,
        kycDetails: req.user.kycDetails
      });
    } catch (error) {
      console.error('KYC Status Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
};

module.exports = kycController;
