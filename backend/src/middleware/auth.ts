import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models';
import { verifyToken } from '../utils/jwt';

// Extend Express Request interface to include user
export interface AuthRequest extends Request {
  user?: IUser;
}

// Middleware to authenticate user
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.',
      });
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access denied. Invalid token format.',
      });
      return;
    }

    try {
      const decoded: any = verifyToken(token);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Token is no longer valid. User not found.',
        });
        return;
      }

      if (!user.isActive) {
        res.status(401).json({
          success: false,
          error: 'Account is deactivated.',
        });
        return;
      }

      req.user = user;
      next();
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        error: 'Token is not valid.',
      });
      return;
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during authentication.',
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Access denied. Not authenticated.',
      });
      return;
    }

    // Support admin role
    if (roles.includes('admin') && req.user.role === 'admin') {
      return next();
    }

    // Backward compatibility: support premium/free
    const userRole = req.user.subscription.plan === 'premium' ? 'premium' : 'free';
    if (roles.includes(userRole) || roles.includes('any')) {
      return next();
    }

    res.status(403).json({
      success: false,
      error: 'Access denied. Insufficient permissions.',
    });
  };
};

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    try {
      const decoded: any = verifyToken(token);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user) {
        (req as any).user = user;
      }
    } catch (error) {
      // Invalid token - continue without authentication
    }
    
    next();
  } catch (error) {
    next();
  }
}; 