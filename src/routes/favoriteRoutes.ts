import { Router } from 'express';
import FavoritesController from '../controllers/favoriteController';
import authMiddleware from '../middlewares/authMiddleware';
import { userRoles } from '../models/userModel';

const router = Router();

router.get('/favorites/:category',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.VIEWER, userRoles.ADMIN]),
  FavoritesController.getUserFavorites
);

router.post('/favorites/add-favorite',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.VIEWER, userRoles.ADMIN]),
  FavoritesController.addFavorite
);

router.delete('/favorites/remove-favorite/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.VIEWER, userRoles.ADMIN]),
  FavoritesController.removeFavorite
);

export default router;