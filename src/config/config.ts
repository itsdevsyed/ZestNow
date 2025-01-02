import dotenv from 'dotenv';
dotenv.config();

export const config = {
  jwtSecret: process.env.JWT_SECRET || 'my-secret-key',
  saltRounds: process.env.SALT_ROUNDS || '10',
};
