import { Request, Response, NextFunction } from 'express';
import Favorite, { FavoriteCategory } from '../models/favouriteModel';
import Artist from '../models/artistModel';
import Album from '../models/albumModel';
import Track from '../models/trackModel';
import { HttpError, HttpStatusCode } from '../utils/errorCodes';
import { userRoles } from '../models/userModel';

class FavoritesController {

  static async getUserFavorites(req: Request|any, res: Response|any, next: NextFunction|any) {
    try {
      const userId = req?.user?.userId;
      const { category } = req?.params;

      if (!Object.values(FavoriteCategory).includes(category as FavoriteCategory)) {
        throw new HttpError('Invalid category', HttpStatusCode.BAD_REQUEST);
      }

      const includeOptions = {
        [FavoriteCategory.ARTIST]: { 
          model: Artist, 
          as: 'artist',
          where: { hidden: false }
        },
        [FavoriteCategory.ALBUM]: { 
          model: Album, 
          as: 'album',
          where: { hidden: false },
          include: [{ 
            model: Artist, 
            as: 'artist', 
            where: { hidden: false } 
          }]
        },
        [FavoriteCategory.TRACK]: { 
          model: Track, 
          as: 'track',
          where: { hidden: false },
          include: [
            { 
              model: Artist, 
              as: 'artist', 
              where: { hidden: false } 
            },
            { 
              model: Album, 
              as: 'album', 
              where: { hidden: false } 
            }
          ]
        }
      };

      const favorites = await Favorite.findAll({
        where: { 
          userId, 
          category 
        },
        include: [includeOptions[category as FavoriteCategory]],
        attributes: ['id', 'entityId', 'category']
      });

      res.status(HttpStatusCode.OK).json({
        message: 'Favorites retrieved successfully',
        favorites
      });
    } catch (error) {
      next(error);
    }
  }


  static async addFavorite(req: Request|any, res: Response|any, next: NextFunction|any) {
    try {
      const userId = req?.user?.userId;
      const { entityId, category } = req?.body;
      //entityId means the id of the entity that the user wants to add to favorites

      if (!Object.values(FavoriteCategory).includes(category)) {
        throw new HttpError('Invalid category', HttpStatusCode.BAD_REQUEST);
      }

      let entity;
      switch (category) {
        case FavoriteCategory.ARTIST:
          entity = await Artist.findOne({ where: { id: entityId } });
          break;
        case FavoriteCategory.ALBUM:
          entity = await Album.findOne({ where: { id: entityId} });
          break;
        case FavoriteCategory.TRACK:
          entity = await Track.findOne({ where: { id: entityId} });
          break;
      }

      if (!entity) {
        throw new HttpError('Entity not found', HttpStatusCode.NOT_FOUND);
      }

      const existingFavorite = await Favorite.findOne({
        where: { 
          userId, 
          entityId, 
          category 
        }
      });

      if (existingFavorite) {
        throw new HttpError('Already added to favorites', HttpStatusCode.CONFLICT);
      }

      const favorite = await Favorite.create({
        userId,
        entityId,
        category
      });

      res.status(HttpStatusCode.CREATED).json({
        message: 'Added to favorites successfully',
        favorite: {
          id: favorite.id,
          entityId,
          category
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeFavorite(req: Request|any, res: Response|any, next: NextFunction|any) {
    try {
      const userId = req?.user?.userId;
      const { id } = req?.params;

      const favorite = await Favorite.findOne({
        where: { 
          id, 
          userId 
        }
      });

      if (!favorite) {
        throw new HttpError('Favorite not found', HttpStatusCode.NOT_FOUND);
      }

      await favorite.destroy();

      res.status(HttpStatusCode.OK).json({
        message: 'Removed from favorites successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default FavoritesController;