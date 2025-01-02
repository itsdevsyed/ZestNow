import express, { Application } from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import authMiddleware from './middleware/authMiddleware';
import connectDB from './config/connectdb';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Express Middleware
app.use(express.json()); // For parsing JSON request bodies

// Routes
app.use('/auth', authRoutes);

//Protected endpoint
app.get('/test', authMiddleware, (req, res) => {
  res.status(200).send({ message: 'You are authorized' });
});

// MongoDB Connection
connectDB();
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
