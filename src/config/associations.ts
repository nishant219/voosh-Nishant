import { Sequelize } from 'sequelize';

import User from '../models/userModel';
import Artist from '../models/artistModel';
import Album from '../models/albumModel';
import Track from '../models/trackModel';
import Favorite from '../models/favouriteModel';

export function setupAssociations(sequelize: Sequelize) {
    try {
        // User Associations
        User.hasMany(Favorite, {
            foreignKey: 'userId',
            as: 'favorites'
        });

        // Artist Associations
        Artist.hasMany(Album, {
            foreignKey: 'artistId',
            as: 'albums'
        });

        Artist.hasMany(Track, {
            foreignKey: 'artistId',
            as: 'tracks'
        });

        // Album Associations
        Album.belongsTo(Artist, {
            foreignKey: 'artistId',
            as: 'artist'
        });

        Album.hasMany(Track, {
            foreignKey: 'albumId',
            as: 'tracks'
        });

        // Track Associations
        Track.belongsTo(Artist, {
            foreignKey: 'artistId',
            as: 'artist'
        });

        Track.belongsTo(Album, {
            foreignKey: 'albumId',
            as: 'album'
        });

        // Favorite Associations
        Favorite.belongsTo(User, {
            foreignKey: 'userId',
            as: 'user'
        });

        Favorite.belongsTo(Artist, {
            foreignKey: 'entityId',
            as: 'artist',
            constraints: false,
            scope: {
                category: 'artist'
            }
        });

        Favorite.belongsTo(Album, {
            foreignKey: 'entityId',
            as: 'album',
            constraints: false,
            scope: {
                category: 'album'
            }
        });

        Favorite.belongsTo(Track, {
            foreignKey: 'entityId',
            as: 'track',
            constraints: false,
            scope: {
                category: 'track'
            }
        });

        console.log('Associations setup completed successfully');
    } catch (error) {
        console.error('Error setting up associations:', error);
        throw error;
    }
}