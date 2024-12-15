import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { userRoles } from '../models/userModel';
import TokenBlacklistManager from '../utils/tokenBlacklist';
import dotenv from 'dotenv';
dotenv.config();

interface TokenPayload {
  userId: string;
  role: userRoles;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

class AuthMiddleware {
  // Authenticate user based on access token
  static async authenticate(req: Request, res: Response, next: NextFunction): Promise<any> {
    console.log('Authenticating user...');
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ message: 'No token provided' });
      console.log('token in auth midd', token);
      const tokenBlacklist = TokenBlacklistManager.getInstance();
      if (tokenBlacklist.isBlacklisted(token)) {
        return res.status(401).json({ message: 'Token blacklisted' });
      }

      const secret = process.env.ACCESS_TOKEN_SECRET;
      if (!secret) throw new Error('ACCESS_TOKEN_SECRET is not defined');

      const decoded = jwt.verify(token, secret) as { user: TokenPayload };
      const { userId, role } = decoded.user;
      console.log('decoded', decoded);
      console.log('userId', userId);
      console.log('role', role);
      const user = await User.findByPk(userId);
      if (!user) return res.status(401).json({ message: 'Invalid token' });

      req.user = { userId, role };
      next();
    } catch (error: any) {
      console.error('Authentication error:', error.message);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired. Please refresh your token.' });
      }

      res.status(401).json({ message: 'Authentication failed' });
    }
  }

  // Role-based access control
  static authorize(roles: userRoles[]): (req: Request, res: Response, next: NextFunction) => any {
    return (req: Request, res: Response, next: NextFunction): any => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }
      next();
    };
  }
}

export default AuthMiddleware;
