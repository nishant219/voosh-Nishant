import { Sequelize, Dialect } from "sequelize";
import 'dotenv/config';
import { initModels } from '../models';
import { setupAssociations } from './associations';

const dialectOptions = process.env.DB_HOST?.includes("localhost") ? {} : {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
};

const sequelize = new Sequelize(
  process.env.DB_DATABASE_NAME || "voosh",
  process.env.DB_USERNAME || "myuser",
  process.env.DB_PASSWORD || "mypassword",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: (process.env.DB_DIALECT || "postgres") as Dialect,
    logging: process.env.SEQUELIZE_LOGGING === "true" ? console.log : false,
    pool: {
      max: Number(process.env.DB_POOL_MAX) || 5,
      min: Number(process.env.DB_POOL_MIN) || 0,
      acquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: Number(process.env.DB_POOL_IDLE) || 10000,
    },
    dialectOptions,
  }
);

export async function initializeDatabase() {
  try {
    // Initialize models
    initModels(sequelize);
    
    // Setup Associations
    setupAssociations(sequelize);
    
    // Sync models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export default sequelize;