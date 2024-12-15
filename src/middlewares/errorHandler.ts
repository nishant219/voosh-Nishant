import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/errorCodes';

class ErrorHandler {
  static handle(
    err: Error | HttpError, 
    req: Request, 
    res: Response, 
    next: NextFunction
  ) {
    console.error(err);

    // Custom HttpError
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({
        message: err.message
      });
    }

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: (err as any).errors.map((e: any) => e.message)
      });
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        message: 'Duplicate Entry',
        errors: (err as any).errors.map((e: any) => e.message)
      });
    }

    // JWT Authentication Error
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid Token'
      });
    }

    // Default error handler
    res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message
    });
  }
}

export default ErrorHandler;