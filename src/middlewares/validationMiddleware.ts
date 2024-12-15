import { Request, Response, NextFunction } from 'express';
import { ValidationChain, body, validationResult } from 'express-validator';

class ValidationMiddleware {
  // Generic validation method
  static validate(validations: ValidationChain[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      // Run all validations
      await Promise.all(validations.map(validation => validation.run(req)));
      
      // Check for validation errors
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      // If there are errors, return 400 with error details
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    };
  }

  // User Signup Validation
  static userSignup = this.validate([
    body('email')
      .isEmail().withMessage('Invalid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
      .matches(/\d/).withMessage('Password must contain a number')
  ]);

  // User Login Validation
  static userLogin = this.validate([
    body('email')
      .isEmail().withMessage('Invalid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
  ]);

  // Artist Validation
  static createArtist = this.validate([
    body('name')
      .notEmpty().withMessage('Artist name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Artist name must be between 2 and 100 characters')
      .trim(),
    body('grammy').optional().isBoolean().withMessage('Grammy must be a boolean')
  ]);

  // Album Validation
  static createAlbum = this.validate([
    body('name')
      .notEmpty().withMessage('Album name is required')
      .isLength({ min: 1, max: 100 }).withMessage('Album name must be between 1 and 100 characters')
      .trim(),
    body('year')
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage('Invalid year'),
    body('artistId').isUUID().withMessage('Invalid artist ID')
  ]);

  // Track Validation
  static createTrack = this.validate([
    body('name')
      .notEmpty().withMessage('Track name is required')
      .isLength({ min: 1, max: 200 }).withMessage('Track name must be between 1 and 200 characters')
      .trim(),
    body('duration')
      .isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('artistId').isUUID().withMessage('Invalid artist ID'),
    body('albumId').isUUID().withMessage('Invalid album ID')
  ]);
}

export default ValidationMiddleware;