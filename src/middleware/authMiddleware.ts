import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import User, { IUser } from '../models/User.model';

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized - No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      role: string;
      username: string;
    };
    User.findById(decoded.id)
      .then((user) => {
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(401).json({ message: 'Unauthorized - Invalid token' });
          return;
        }
      })
      .catch(() => {
        res.status(401).json({ message: 'Unauthorized - Invalid token' });
      });
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
}

export default authMiddleware;
