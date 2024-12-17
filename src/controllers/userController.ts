import e, { Request, Response, NextFunction } from 'express';
import User, { userRoles } from '../models/userModel';
import { createTokens } from '../utils/token';
import { HttpError, HttpStatusCode } from '../utils/errorCodes';
import TokenBlacklistManager from '../utils/tokenBlacklist';

class UserController {

  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new HttpError('Email and password are required', HttpStatusCode.BAD_REQUEST);
      }

      const userCount = await User.count();
      const role = userCount === 3 ? userRoles.ADMIN : userRoles.VIEWER;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new HttpError('User already exists', HttpStatusCode.CONFLICT);
      }

      const user = await User.create({
        email,
        password,
        role
      });

      const { accessToken, refreshToken } = createTokens({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      res.status(HttpStatusCode.CREATED).json({
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new HttpError('Email and password are required', HttpStatusCode.BAD_REQUEST);
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new HttpError('Invalid credentials', HttpStatusCode.NOT_FOUND);
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new HttpError('Invalid credentials', HttpStatusCode.UNAUTHORIZED);
      }

      const { accessToken, refreshToken } = createTokens({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      res.status(HttpStatusCode.OK).json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    console.log('logout logout')
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      console.log("token inside logout controller", token)
      if (!token) {
        throw new HttpError('No token provided', HttpStatusCode.BAD_REQUEST);
      }
      console.log(token, 'token');
      const tokenBlacklistManager = TokenBlacklistManager.getInstance();
      tokenBlacklistManager.addToBlacklist(token);
      res.status(HttpStatusCode.OK).json({
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  //get all admins 
  static async getAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await User.findAll({
        where: { role: userRoles.ADMIN },
        attributes: ['id', 'email']
      });

      res.status(HttpStatusCode.OK).json({
        message: 'Admins retrieved successfully',
        admins
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'email', 'role']
      });

      res.status(HttpStatusCode.OK).json({
        message: 'Users retrieved successfully',
        users
      });
    } catch (error) {
      next(error);
    }
  }

  // Add User (Admin only)
  static async addUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        throw new HttpError('Email and password are required', HttpStatusCode.BAD_REQUEST);
      }

      const user = await User.create({
        email,
        password,
        role: role || userRoles.VIEWER
      });

      res.status(HttpStatusCode.CREATED).json({
        message: 'User added successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = (req as any).user?.userId;

      if (!currentPassword || !newPassword) {
        throw new HttpError('Current and new passwords are required', HttpStatusCode.BAD_REQUEST);
      }

      const user = await User.findByPk(userId);
      if (!user) {
        throw new HttpError('User not found', HttpStatusCode.NOT_FOUND);
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        throw new HttpError('Current password is incorrect', HttpStatusCode.BAD_REQUEST);
      }

      user.password = newPassword;
      await user.save();
      res.status(HttpStatusCode.OK).json({
        message: 'Password updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete User (Admin only)
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        throw new HttpError('User not found', HttpStatusCode.NOT_FOUND);
      }

      if (user.role === userRoles.ADMIN) {
        throw new HttpError('Cannot delete admin user', HttpStatusCode.FORBIDDEN);
      }

      await user.destroy();

      res.status(HttpStatusCode.OK).json({
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;