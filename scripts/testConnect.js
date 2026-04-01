const mongoose = require('mongoose');
require('dotenv').config();

const testConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to connect:', err.message);
    process.exit(1);
  }
};
testConnect();
