import { Router } from 'express';
import TrackController from '../controllers/trackController';
import authMiddleware from '../middlewares/authMiddleware';
import { userRoles } from '../models/userModel';

const router = Router();

router.get('/tracks',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN, userRoles.EDITOR]),
  TrackController.getTracks
);

router.get('/tracks/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN, userRoles.EDITOR]),
  TrackController.getTrackById
);

router.post('/tracks/add-track',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN, userRoles.EDITOR]),
  TrackController.addTrack
);

router.put('/tracks/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN, userRoles.EDITOR]),
  TrackController.updateTrack
);

router.delete('/tracks/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize([userRoles.ADMIN, userRoles.EDITOR]),
  TrackController.deleteTrack
);

export default router;