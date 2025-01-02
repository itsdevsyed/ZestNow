import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { IUser } from '../models/User.model';

function generateToken(user: IUser): string {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    config.jwtSecret,
    {
      expiresIn: '1h',
    }
  );
}

export default generateToken;
