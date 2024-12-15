// src/models/albumModel.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class Album extends Model {
  public id!: string;
  public name!: string;
  public year!: number;
  public hidden!: boolean;
  public artistId!: string;

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
      year: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1900,
          max: new Date().getFullYear()
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
      }
    }, {
      sequelize,
      modelName: 'Album',
      tableName: 'albums'
    });
  }
}

export default Album;