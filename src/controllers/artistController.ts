import { Request, Response, NextFunction } from 'express';
import Artist from '../models/artistModel';
import Album from '../models/albumModel';
import Track from '../models/trackModel';
import { HttpError, HttpStatusCode } from '../utils/errorCodes';
import { userRoles } from '../models/userModel';

class ArtistController {

  static async getArtists(req: Request | any, res: Response | any, next: NextFunction | any) {
    try {
      const userRole = req?.user?.role;

      const whereCondition = userRole === userRoles.VIEWER ? { hidden: false } : {};

      const artists = await Artist.findAll({
        where: whereCondition,
        include: userRole !== userRoles.VIEWER
          ? [{
            model: Album,
            as: 'albums',
            include: [{
              model: Track,
              as: 'tracks'
            }]
          }]
          : []
      });

      res.status(HttpStatusCode.OK).json({
        message: 'Artists retrieved successfully',
        artists
      });
    } catch (error) {
      next(error);
    }
  }

  static async getArtistById(req: Request | any, res: Response | any, next: NextFunction | any) {
    try {
      const { id } = req?.params;
      const userRole = req?.user?.role;

      const whereCondition = userRole === userRoles.VIEWER ? { id, hidden: false } : { id };
      const artist = await Artist.findOne({
        where: whereCondition,
        include: userRole !== userRoles.VIEWER
          ? [{
            model: Album,
            as: 'albums',
            include: [{
              model: Track,
              as: 'tracks'
            }]
          }]
          : []
      });

      if (!artist) {
        throw new HttpError('Artist not found', HttpStatusCode.NOT_FOUND);
      }

      res.status(HttpStatusCode.OK).json({
        message: 'Artist retrieved successfully',
        artist
      });
    } catch (error) {
      next(error);
    }
  }


  static async addArtist(req: Request | any, res: Response | any, next: NextFunction | any) {
    try {
      const { name, grammy } = req?.body;
      const userRole = req?.user?.role;

      if (!name) {
        throw new HttpError('Artist name is required', HttpStatusCode.BAD_REQUEST);
      }

      if (userRole === userRoles.VIEWER) {
        throw new HttpError('Unauthorized to add artists', HttpStatusCode.FORBIDDEN);
      }

      const existingArtist = await Artist.findOne({ where: { name } });
      if (existingArtist) {
        throw new HttpError('Artist with this name already exists', HttpStatusCode.CONFLICT);
      }

      const artist = await Artist.create({
        name,
        grammy: grammy || false,
        hidden: false
      });

      res.status(HttpStatusCode.CREATED).json({
        message: 'Artist added successfully',
        artist: {
          id: artist.id,
          name: artist.name,
          grammy: artist.grammy
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateArtist(req: Request | any, res: Response | any, next: NextFunction | any) {
    try {
      const { id } = req?.params;
      const { name, grammy, hidden } = req?.body;
      const userRole = req?.user?.role;

      if (userRole === userRoles.VIEWER) {
        throw new HttpError('Unauthorized to update artists', HttpStatusCode.FORBIDDEN);
      }

      const artist = await Artist.findByPk(id);
      if (!artist) {
        throw new HttpError('Artist not found', HttpStatusCode.NOT_FOUND);
      }

      if (name && name !== artist.name) {
        const existingArtist = await Artist.findOne({ where: { name } });
        if (existingArtist) {
          throw new HttpError('Artist with this name already exists', HttpStatusCode.CONFLICT);
        }
        artist.name = name;
      }

      if (grammy !== undefined) artist.grammy = grammy;
      if (hidden !== undefined) artist.hidden = hidden;

      await artist.save();

      res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }

  static async deleteArtist(req: Request | any, res: Response | any, next: NextFunction | any) {
    try {
      const { id } = req?.params;
      const userRole = req?.user?.role;

      if (userRole === userRoles.VIEWER) {
        throw new HttpError('Unauthorized to delete artists', HttpStatusCode.FORBIDDEN);
      }

      const artist = await Artist.findByPk(id);
      if (!artist) {
        throw new HttpError('Artist not found', HttpStatusCode.NOT_FOUND);
      }

      await artist.destroy();

      res.status(HttpStatusCode.OK).json({
        message: 'Artist deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ArtistController;