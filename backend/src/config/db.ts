import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost', // Add default value
  dialect: 'postgres',
  port: Number(process.env.DB_PORT) || 5432,
  logging: false,
  // Other potential properties you might need:
  database: process.env.DB_NAME || 'booknexus_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    // Add this line to create tables in development:
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database tables synchronized');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;