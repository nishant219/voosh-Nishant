import { Sequelize, Dialect } from "sequelize";
import 'dotenv/config';
import { initModels } from '../models';
import { setupAssociations } from './associations';
import * as pg from 'pg';
import { URL } from 'url';

// Disable SSL verification globally for pg
pg.defaults.ssl = {
  rejectUnauthorized: false,
};

// Parse the connection URL
const parsedUrl = new URL(process.env.POSTGRES_URL || "");

const sequelize = new Sequelize({
  host: parsedUrl.hostname,
  port: Number(parsedUrl.port),
  database: parsedUrl.pathname.replace('/', ''),
  username: parsedUrl.username,
  password: parsedUrl.password,
  dialect: "postgres" as Dialect,
  dialectModule: pg,
  logging: process.env.SEQUELIZE_LOGGING === "true" ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
      // You can add more SSL options here if needed
    }
  },
  pool: {
    max: Number(process.env.DB_POOL_MAX) || 5,
    min: Number(process.env.DB_POOL_MIN) || 0,
    acquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,
    idle: Number(process.env.DB_POOL_IDLE) || 10000,
  }
});

export async function initializeDatabase() {
  try {
    // Detailed connection logging
    console.log('Connecting with:');
    console.log('Host:', parsedUrl.hostname);
    console.log('Port:', parsedUrl.port);
    console.log('Database:', parsedUrl.pathname.replace('/', ''));
    console.log('Username:', parsedUrl.username);

    // Attempt connection
    console.log('Attempting to authenticate...');
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Initialize models
    initModels(sequelize);
    
    // Setup Associations
    setupAssociations(sequelize);
    
    // Sync models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
  } catch (error:any) {
    console.error('Database initialization error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error details:', error.parent || error);
    console.error('Full error:', error);
    throw error;
  }
}

export default sequelize;