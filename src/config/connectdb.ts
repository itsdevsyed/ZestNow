import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }

    await mongoose.connect(MONGO_URI, {});
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB Atlas connection failed:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
