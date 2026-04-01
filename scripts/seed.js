const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User.model');
const Category = require('../models/Category.model');
const Product = require('../models/Product.model');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Synchronize indexes
    await User.syncIndexes();
    await Category.syncIndexes();
    await Product.syncIndexes();

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('Cleared existing test data...');

    // 1. Create a Test Distributor/Seller
    const testSeller = new User({
      phoneNumber: '+919999988888',
      firstName: 'Test',
      lastName: 'Seller',
      email: 'seller@test.com',
      role: 'distributor',
      isVerified: true,
      kycStatus: 'approved',
      isTest: true, // Custom flag for our script to identify test data
    });
    await testSeller.save();
    console.log('Test Seller Created: +919999988888');

    // 2. Create Categories
    const categories = await Category.insertMany([
      { name: 'Seeds', description: 'High quality agricultural seeds' },
      { name: 'Fertilizers', description: 'Organic and chemical fertilizers' },
      { name: 'Pesticides', description: 'Effective crop protection' },
      { name: 'Tools', description: 'Farming equipment and tools' },
    ]);
    console.log('Categories Created');

    // 3. Create Products
    const products = await Product.insertMany([
      {
        name: 'Hybrid Tomato Seeds',
        description: 'High yielding tomato seeds for all seasons.',
        price: 250,
        category: categories[0]._id,
        imageUrl: 'https://via.placeholder.com/150',
        stock: 100,
        seller: testSeller._id
      },
      {
        name: 'Organic NPK Fertilizer',
        description: 'Enriched organic fertilizer for soil health.',
        price: 1200,
        category: categories[1]._id,
        imageUrl: 'https://via.placeholder.com/150',
        stock: 50,
        seller: testSeller._id
      },
      {
        name: 'Drip Irrigation Kit',
        description: 'Standard kit for 1 acre land.',
        price: 4500,
        category: categories[3]._id,
        imageUrl: 'https://via.placeholder.com/150',
        stock: 10,
        seller: testSeller._id
      }
    ]);
    console.log('Products Created');

    // 4. Create some users of different roles
    await User.insertMany([
      {
        phoneNumber: '+918888877777',
        firstName: 'Test',
        lastName: 'Retailer',
        role: 'retailer',
        isVerified: true,
        kycStatus: 'pending',
        isTest: true
      },
      {
        phoneNumber: '+917777766666',
        firstName: 'Test',
        lastName: 'Farmer',
        role: 'farmer',
        isVerified: true,
        kycStatus: 'pending',
        isTest: true
      }
    ]);
    console.log('Test Users (Retailer, Farmer) Created');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error.message);
    if (error.writeErrors) {
      error.writeErrors.forEach(err => console.error('Write Error:', err.errmsg));
    }
    process.exit(1);
  }
};

seedData();
