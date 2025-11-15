import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Get database connection
const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  logging: false
});

// Sample users to seed
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'User 2',
    email: 'user@example.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'Manusha',
    email: 'manusha@gmail.com',
    password: 'manusha123',
    role: 'admin',
  },
];

async function seedUsers() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Clear the users table first
    await User.sync({ force: true });
    console.log('✅ Users table cleared');
    
    // Create users
    for (const userData of users) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      //const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user with hashed password
      const newUser = await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password, // Use the hashed password here
        role: userData.role as 'admin' | 'user',
      });
      
      console.log(`✅ User created: ${newUser.name} (${newUser.email})`);
    }
    
    console.log('✅ Seeding completed successfully');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close database connection
    await sequelize.close();
    process.exit(0);
  }
}

// Run the seed function
seedUsers();