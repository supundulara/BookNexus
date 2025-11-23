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
    
    // Import cleanup utility (dynamic import to avoid circular dependencies)
    const { cleanupOrphanedCheckouts } = await import('../utils/cleanupOrphanedData.js');
    
    // Clean up orphaned data before syncing
    await cleanupOrphanedCheckouts();
    
    // Sync database tables
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database tables synchronized');
    } else {
      // In production, only sync without altering existing tables
      await sequelize.sync({ alter: false });
      console.log('Database schema verified');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Log the error but don't exit immediately - allow graceful shutdown
    throw error;
  }
};

export default sequelize;