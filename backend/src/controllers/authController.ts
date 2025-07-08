import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { Types } from 'mongoose';

interface AuthRequest extends Request {
  user?: IUser;
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, username, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        error: existingUser.email === email ? 'Email already exists' : 'Username already exists',
      });
      return;
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      username,
      firstName,
      lastName,
    }) as IUser;

    // Generate tokens
    const userId = (user._id as Types.ObjectId).toString();
    const token = generateToken(userId);
    const refreshToken = generateRefreshToken(userId);

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
        refreshToken,
      },
      message: 'User registered successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password') as IUser;

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        error: 'Account is deactivated',
      });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate tokens
    const userId = (user._id as Types.ObjectId).toString();
    const token = generateToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Remove password from response
    const userResponse = user.toJSON();

    res.json({
      success: true,
      data: {
        user: userResponse,
        token,
        refreshToken,
      },
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { firstName, lastName, username, avatar } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    // Check if username is taken by another user
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId },
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'Username is already taken',
        });
        return;
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(username && { username }),
        ...(avatar && { avatar }),
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const preferences = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { preferences },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user,
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        error: 'Current password and new password are required',
      });
      return;
    }

    // Find user with password
    const user = await User.findById(userId).select('+password');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      res.status(400).json({
        success: false,
        error: 'Current password is incorrect',
      });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
}; 