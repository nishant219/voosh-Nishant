// src/models/favouriteModel.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

export enum FavoriteCategory {
  ARTIST = 'artist',
  ALBUM = 'album',
  TRACK = 'track'
}

class Favorite extends Model {
  public id!: string;
  public userId!: string;
  public entityId!: string;
  public category!: FavoriteCategory;

  static initialize(sequelize: Sequelize) {
    this.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      entityId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      category: {
        type: DataTypes.ENUM(...Object.values(FavoriteCategory)),
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Favorite',
      tableName: 'favorites',
      indexes: [
        {
          unique: true,
          fields: ['userId', 'entityId', 'category']
        }
      ]
    });
  }
}

export default Favorite;