const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.DB_URL;
    if (!mongoURI) throw new Error('MONGODB_URI missing in .env');
    console.log('MongoDB URI:', mongoURI);
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;