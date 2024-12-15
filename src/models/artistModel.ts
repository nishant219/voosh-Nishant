// src/models/artistModel.ts
import { Model, DataTypes, Sequelize } from "sequelize";

class Artist extends Model {
  public id!: string;
  public name!: string;
  public grammy!: boolean;
  public hidden!: boolean;

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
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      grammy: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      hidden: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    }, {
      sequelize,
      modelName: 'Artist',
      tableName: 'artists'
    });
  }
}

export default Artist;