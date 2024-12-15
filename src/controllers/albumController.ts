import { Request, Response, NextFunction } from 'express';
import Album from '../models/albumModel';
import Artist from '../models/artistModel';
import Track from '../models/trackModel';
import { HttpError, HttpStatusCode } from '../utils/errorCodes';
import { userRoles } from '../models/userModel';

class AlbumController {

  static async getAlbums(req: Request|any, res: Response|any, next: NextFunction|any) {
    try {
      const userRole = req?.user?.role;
      
      const whereCondition = userRole === userRoles.VIEWER ? { hidden: false }  : {};

      const albums = await Album.findAll({
        where: whereCondition,
        include: [
          { 
            model: Artist, 
            as: 'artist',
            // where: userRole === userRoles.VIEWER  ? { hidden: false }  : {}
          },
          { 
            model: Track, 
            as: 'tracks',
            // where: userRole === userRoles.VIEWER  ? { hidden: false }  : {}
          }
        ]
      });

      res.status(HttpStatusCode.OK).json({
        message: 'Albums retrieved successfully',
        albums
      });
    } catch (error) {
      next(error);
    }
  }


  static async getAlbumById(req: Request|any, res: Response|any, next: NextFunction|any) {
    try {
      const { id } = req?.params;
      const userRole = req?.user?.role;

      const whereCondition = userRole === userRoles.VIEWER  ? { id, hidden: false }  : { id };

      const album = await Album.findOne({
        where: whereCondition,
        include: [
          { 
            model: Artist, 
            as: 'artist',
            // where: userRole === userRoles.VIEWER  ? { hidden: false }  : {}
          },
          { 
            model: Track, 
            as: 'tracks',
            // where: userRole === userRoles.VIEWER  ? { hidden: false }  : {}
          }
        ]
      });

      if (!album) {
        throw new HttpError('Album not found', HttpStatusCode.NOT_FOUND);
      }

      res.status(HttpStatusCode.OK).json({
        message: 'Album retrieved successfully',
        album
      });
    } catch (error) {
      next(error);
    }
  }


  static async addAlbum(req: Request|any, res: Response|any, next: NextFunction|any) {
    try {
      const { name, year, artistId } = req?.body;
      const userRole = req?.user?.role;

      if (userRole === userRoles.VIEWER) {
        throw new HttpError('Unauthorized to add albums', HttpStatusCode.FORBIDDEN);
      }

      if (!name || !year || !artistId) {
        throw new HttpError('Name, year, and artist ID are required', HttpStatusCode.BAD_REQUEST);
      }

      const artist = await Artist.findByPk(artistId);
      if (!artist) {
        throw new HttpError('Artist not found', HttpStatusCode.NOT_FOUND);
      }

      const album = await Album.create({
        name,
        year,
        artistId,
        hidden: false
      });

      res.status(HttpStatusCode.CREATED).json({
        message: 'Album added successfully',
        album: {
          id: album.id,
          name: album.name,
          year: album.year,
          artistId: album.artistId
        }
      });
    } catch (error) {
      next(error);
    }
  }


  static async updateAlbum(req: Request|any, res: Response|any, next: NextFunction|any) {
    try {
      const { id } = req?.params;
      const { name, year, artistId, hidden } = req?.body;
      const userRole = req?.user?.role;

      if (userRole === userRoles.VIEWER) {
        throw new HttpError('Unauthorized to update albums', HttpStatusCode.FORBIDDEN);
      }

      const album = await Album.findByPk(id);
      if (!album) {
        throw new HttpError('Album not found', HttpStatusCode.NOT_FOUND);
      }

      if (artistId) {
        const artist = await Artist.findByPk(artistId);
        if (!artist) {
          throw new HttpError('Artist not found', HttpStatusCode.NOT_FOUND);
        }
        album.artistId = artistId;
      }

      if (name) album.name = name;
      if (year) album.year = year;
      if (hidden !== undefined) album.hidden = hidden;

      await album.save();

      res.status(HttpStatusCode.OK).json({
        message: 'Album updated successfully',
        album: {
          id: album.id,
          name: album.name,
          year: album.year,
          artistId: album.artistId
        }
      });
    } catch (error) {
      next(error);
    }
  }


  static async deleteAlbum(req: Request|any, res: Response|any, next: NextFunction|any) {
    try {
      const { id } = req?.params;
      const userRole = req?.user?.role;

      if (userRole === userRoles.VIEWER) {
        throw new HttpError('Unauthorized to delete albums', HttpStatusCode.FORBIDDEN);
      }

      const album = await Album.findByPk(id);
      if (!album) {
        throw new HttpError('Album not found', HttpStatusCode.NOT_FOUND);
      }

      await album.destroy();

      res.status(HttpStatusCode.OK).json({
        message: 'Album deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AlbumController;