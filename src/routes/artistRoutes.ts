import { Router } from 'express';
import ArtistController from '../controllers/artistController';
import authMiddleware from '../middlewares/authMiddleware';
import { userRoles } from '../models/userModel';

const router = Router();

router.get('/artists',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN, userRoles.EDITOR]),
  ArtistController.getArtists
);

router.get('/artists/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN, userRoles.EDITOR]),
  ArtistController.getArtistById
);

router.post('/artists/add-artist',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN, userRoles.EDITOR]),
  ArtistController.addArtist
);

router.put('/artists/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN, userRoles.EDITOR]),
  ArtistController.updateArtist
);

router.delete('/artists/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN, userRoles.EDITOR]),
  ArtistController.deleteArtist
);

export default router;