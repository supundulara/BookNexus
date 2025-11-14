import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import helmet from 'helmet';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import path from 'path';
import fs from 'fs';

// Process error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'covers');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(helmet());

// Serve static files with caching headers
// Serve uploaded images with longer cache time
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads'), {
  maxAge: '7d', // Cache for 7 days
  etag: true,
  immutable: true
}));

// Serve other static files
app.use(express.static(path.join(process.cwd(), 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('BookNexus API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

// Keep the event loop alive
process.stdin.resume();