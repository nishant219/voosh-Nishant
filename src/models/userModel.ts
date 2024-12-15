// src/models/userModel.ts
import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

export enum userRoles {
  ADMIN = 'Admin',
  EDITOR = 'Editor',
  VIEWER = 'Viewer'
}

class User extends Model {
  public id!: string;
  public email!: string;
  public password!: string;
  public role!: userRoles;

  public async comparePassword(userEnteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(userEnteredPassword, this.password);
  }

  public async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  static initialize(sequelize: Sequelize) {
    this.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM(...Object.values(userRoles)),
        allowNull: false,
        defaultValue: userRoles.VIEWER
      }
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      hooks: {
        beforeCreate: async (user: User) => {
          await user.hashPassword();
        },
        beforeUpdate: async (user: User) => {
          await user.hashPassword();
        }
      }
    });
  }
}

export default User;