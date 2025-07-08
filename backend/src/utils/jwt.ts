import jwt from 'jsonwebtoken';
import config from '../config';

export const generateToken = (userId: string): string => {
  if (!config.jwtSecret) {
    throw new Error('JWT secret is not configured');
  }
  
  return jwt.sign(
    { userId }, 
    config.jwtSecret, 
    { expiresIn: '7d' }
  );
};

export const generateRefreshToken = (userId: string): string => {
  if (!config.jwtSecret) {
    throw new Error('JWT secret is not configured');
  }
  
  return jwt.sign(
    { userId }, 
    config.jwtSecret, 
    { expiresIn: '30d' }
  );
};

export const verifyToken = (token: string): any => {
  if (!config.jwtSecret) {
    throw new Error('JWT secret is not configured');
  }
  
  return jwt.verify(token, config.jwtSecret);
}; 