import { Request, Response } from 'express';
import authService from '../services/authService';
import { IUser } from '../models/User.model';

interface ILocation {
  type: 'Point';
  coordinates: [number, number];
}

async function register(req: Request, res: Response): Promise<void> {
  try {
    const userData = req.body as IUser;
    const locationData = req.body.location as ILocation;
    const shopType = req.body.shopType as string; // Added shopType

    const response = await authService.registerUser(
      userData,
      locationData,
      shopType
    ); // Pass shopType

    res.status(201).json(response);
  } catch (err: any) {
    console.log('Error in auth controller', err);
    res.status(400).json({
      message: 'Registration Failed',
      error: err.message || 'Registration failed',
    });
  }
}

async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const response = await authService.loginUser(email, password);

    if (!response) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    res.json(response); // Modified
  } catch (error) {
    console.log('Error in login controller', error);
    res.status(500).json({ message: 'Login failed', error: error });
  }
}

export default { register, login };
