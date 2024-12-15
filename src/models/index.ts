// src/models/index.ts
import { Sequelize } from 'sequelize';
import User from './userModel';
import Artist from './artistModel';
import Album from './albumModel';
import Track from './trackModel';
import Favorite from './favouriteModel';

const models = {
  User,
  Artist,
  Album,
  Track,
  Favorite
};

export function initModels(sequelize: Sequelize) {
  // Initialize all models with sequelize instance
  User.initialize(sequelize);
  Artist.initialize(sequelize);
  Album.initialize(sequelize);
  Track.initialize(sequelize);
  Favorite.initialize(sequelize);
  
  return models;
}

export default models;