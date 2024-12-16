import { Router } from 'express';
import UserController from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';
import { userRoles } from '../models/userModel';

const router = Router();

// Authentication Routes (accessible to all)
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.post('/logout', authMiddleware.authenticate, UserController.logout);

//get all admins
router.get('/admins', UserController.getAdmins);

// User Management Routes (Admin only)
router.get('/users',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN]),
  UserController.getUsers
);

router.post('/users/add-user',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN]),
  UserController.addUser
);

router.delete('/users/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN]),
  UserController.deleteUser
);

router.put('/users/update-password',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN, userRoles.VIEWER]),
  UserController.updatePassword
);

export default router;