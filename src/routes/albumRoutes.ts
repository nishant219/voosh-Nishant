import { Router } from 'express';
import AlbumController from '../controllers/albumController';
import authMiddleware from '../middlewares/authMiddleware';
import { userRoles } from '../models/userModel';

const router = Router();

router.get('/albums',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN, userRoles.EDITOR]),
  AlbumController.getAlbums
);

router.get('/albums/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN, userRoles.EDITOR]),
  AlbumController.getAlbumById
);

router.post('/albums/add-album',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN, userRoles.EDITOR]),
  AlbumController.addAlbum
);

router.put('/albums/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN, userRoles.EDITOR]),
  AlbumController.updateAlbum
);

router.delete('/albums/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN, userRoles.EDITOR]),
  AlbumController.deleteAlbum
);

export default router;