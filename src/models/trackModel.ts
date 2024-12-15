// src/models/trackModel.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class Track extends Model {
  public id!: string;
  public name!: string;
  public duration!: number;
  public hidden!: boolean;
  public artistId!: string;
  public albumId!: string;

  static initialize(sequelize: Sequelize) {
    this.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1
        }
      },
      hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      artistId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'artists',
          key: 'id'
        }
      },
      albumId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'albums',
          key: 'id'
        }
      }
    }, {
      sequelize,
      modelName: 'Track',
      tableName: 'tracks'
    });
  }
}

export default Track;