import { Request, Response, NextFunction } from 'express';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Password cannot be longer than 128 characters' };
  }
  
  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return { isValid: false, message: 'Password must contain at least one letter and one number' };
  }
  
  return { isValid: true };
};

export const validateUsername = (username: string): { isValid: boolean; message?: string } => {
  if (username.length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters long' };
  }
  
  if (username.length > 20) {
    return { isValid: false, message: 'Username cannot be longer than 20 characters' };
  }
  
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { isValid: true };
};

export const validateName = (name: string, fieldName: string): { isValid: boolean; message?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (name.length > 50) {
    return { isValid: false, message: `${fieldName} cannot be longer than 50 characters` };
  }
  
  return { isValid: true };
};

export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password, username, firstName, lastName } = req.body;
  
  // Validate email
  if (!email) {
    res.status(400).json({
      success: false,
      error: 'Email is required',
    });
    return;
  }
  
  if (!validateEmail(email)) {
    res.status(400).json({
      success: false,
      error: 'Please provide a valid email address',
    });
    return;
  }
  
  // Validate password
  if (!password) {
    res.status(400).json({
      success: false,
      error: 'Password is required',
    });
    return;
  }
  
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    res.status(400).json({
      success: false,
      error: passwordValidation.message,
    });
    return;
  }
  
  // Validate username
  if (!username) {
    res.status(400).json({
      success: false,
      error: 'Username is required',
    });
    return;
  }
  
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.isValid) {
    res.status(400).json({
      success: false,
      error: usernameValidation.message,
    });
    return;
  }
  
  // Validate first name
  const firstNameValidation = validateName(firstName, 'First name');
  if (!firstNameValidation.isValid) {
    res.status(400).json({
      success: false,
      error: firstNameValidation.message,
    });
    return;
  }
  
  // Validate last name
  const lastNameValidation = validateName(lastName, 'Last name');
  if (!lastNameValidation.isValid) {
    res.status(400).json({
      success: false,
      error: lastNameValidation.message,
    });
    return;
  }
  
  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;
  
  if (!email) {
    res.status(400).json({
      success: false,
      error: 'Email is required',
    });
    return;
  }
  
  if (!validateEmail(email)) {
    res.status(400).json({
      success: false,
      error: 'Please provide a valid email address',
    });
    return;
  }
  
  if (!password) {
    res.status(400).json({
      success: false,
      error: 'Password is required',
    });
    return;
  }
  
  next();
}; 