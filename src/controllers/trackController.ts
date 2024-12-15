import { Request, Response, NextFunction } from 'express';
import Track from '../models/trackModel';
import Album from '../models/albumModel';
import Artist from '../models/artistModel';
import { HttpError, HttpStatusCode } from '../utils/errorCodes';
import { userRoles } from '../models/userModel';

class TrackController {

  static async getTracks(req: Request | any, res: Response | any, next: NextFunction | any) {
    try {
      const userRole = req?.user?.role;

      const whereCondition = userRole === userRoles.VIEWER ? { hidden: false } : {};

      const tracks = await Track.findAll({
        where: whereCondition,
        include: [
          {
            model: Artist,
            as: 'artist',
            where: userRole === userRoles.VIEWER ? { hidden: false } : {}
          },
          {
            model: Album,
            as: 'album',
            where: userRole === userRoles.VIEWER ? { hidden: false } : {}
          }
        ]
      });

      res.status(HttpStatusCode.OK).json({
        message: 'Tracks retrieved successfully',
        tracks
      });
    } catch (error) {
      next(error);
    }
  }


  static async getTrackById(req: Request | any, res: Response | any, next: NextFunction | any) {
    try {
      const { id } = req?.params;
      const userRole = req?.user?.role;

      const whereCondition = userRole === userRoles.VIEWER ? { id, hidden: false } : { id };

      const track = await Track.findOne({
        where: whereCondition,
        include: [
          {
            model: Artist,
            as: 'artist',
            where: userRole === userRoles.VIEWER ? { hidden: false } : {}
          },
          {
            model: Album,
            as: 'album',
            where: userRole === userRoles.VIEWER ? { hidden: false } : {}
          }
        ]
      });

      if (!track) {
        throw new HttpError('Track not found', HttpStatusCode.NOT_FOUND);
      }

      res.status(HttpStatusCode.OK).json({
        message: 'Track retrieved successfully',
        track
      });
    } catch (error) {
      next(error);
    }
  }

  static async addTrack(req: Request | any, res: Response | any, next: NextFunction | any) {
    try {
      const { name, duration, artistId, albumId } = req?.body;
      const userRole = req?.user?.role;

      if (userRole === userRoles.VIEWER) {
        throw new HttpError('Unauthorized to add tracks', HttpStatusCode.FORBIDDEN);
      }

      if (!name || !duration || !artistId || !albumId) {
        throw new HttpError('Name, duration, artist ID, and album ID are required', HttpStatusCode.BAD_REQUEST);
      }

      const artist = await Artist.findByPk(artistId);
      const album = await Album.findByPk(albumId);

      if (!artist) {
        throw new HttpError('Artist not found', HttpStatusCode.NOT_FOUND);
      }

      if (!album) {
        throw new HttpError('Album not found', HttpStatusCode.NOT_FOUND);
      }

      if (album.artistId !== artistId) {
        throw new HttpError('Album does not belong to the specified artist', HttpStatusCode.BAD_REQUEST);
      }

      const track = await Track.create({
        name,
        duration,
        artistId,
        albumId,
        hidden: false
      });

      res.status(HttpStatusCode.CREATED).json({
        message: 'Track added successfully',
        track: {
          id: track.id,
          name: track.name,
          duration: track.duration,
          artistId: track.artistId,
          albumId: track.albumId
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTrack(req: Request | any, res: Response | any, next: NextFunction | any) {
    try {
      const { id } = req?.params;
      const { name, duration, artistId, albumId, hidden } = req?.body;
      const userRole = req?.user?.role;

      if (userRole === userRoles.VIEWER) {
        throw new HttpError('Unauthorized to update tracks', HttpStatusCode.FORBIDDEN);
      }

      const track = await Track.findByPk(id);
      if (!track) {
        throw new HttpError('Track not found', HttpStatusCode.NOT_FOUND);
      }

      if (artistId) {
        const artist = await Artist.findByPk(artistId);
        if (!artist) {
          throw new HttpError('Artist not found', HttpStatusCode.NOT_FOUND);
        }
        track.artistId = artistId;
      }

      if (albumId) {
        const album = await Album.findByPk(albumId);
        if (!album) {
          throw new HttpError('Album not found', HttpStatusCode.NOT_FOUND);
        }

        if (artistId && album.artistId !== artistId) {
          throw new HttpError('Album does not belong to the specified artist', HttpStatusCode.BAD_REQUEST);
        }

        track.albumId = albumId;
      }

      if (name) track.name = name;
      if (duration) track.duration = duration;
      if (hidden !== undefined) track.hidden = hidden;

      await track.save();

      res.status(HttpStatusCode.OK).json({
        message: 'Track updated successfully',
        track: {
          id: track.id,
          name: track.name,
          duration: track.duration,
          artistId: track.artistId,
          albumId: track.albumId
        }
      });

    } catch (error) {
      next(error);
    }
  }

  static async deleteTrack(req: Request | any, res: Response | any, next: NextFunction | any) {
    try {
      const { id } = req?.params;
      const userRole = req?.user?.role;

      if (userRole === userRoles.VIEWER) {
        throw new HttpError('Unauthorized to delete tracks', HttpStatusCode.FORBIDDEN);
      }

      const track = await Track.findByPk(id);
      if (!track) {
        throw new HttpError('Track not found', HttpStatusCode.NOT_FOUND);
      }

      await track.destroy();

      res.status(HttpStatusCode.OK).json({
        message: 'Track deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default TrackController;