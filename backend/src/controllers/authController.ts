import type { Request, Response ,NextFunction} from 'express';
import jwt, { type SignOptions } from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id: number) => {
  const options: SignOptions = {
    expiresIn:'30d', 
  };
  
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET as string, 
    options
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin', // Default role
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ where: { email } });

    if (user && (await user.comparePassword(password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.user?.id, {
      attributes: { exclude: ['password'] },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Only admins can access this endpoint
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }
    
    // Use Sequelize's findAll method instead of MongoDB's find
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Exclude password field
    });
    
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a librarian
// @route   DELETE /api/auth/librarians/:id
// @access  Private/Admin
export const deleteLibrarian = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get ID from params
    if (!req.params.id) {
      return res.status(400).json({ message: 'Librarian ID is required' });
    }
    const librarianId = parseInt(req.params.id);
    
    // Prevent users from deleting themselves
    if (req.user && req.user.id === librarianId) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }
    
    // Find the librarian to delete
    const librarian = await User.findByPk(librarianId);
    
    if (!librarian) {
      return res.status(404).json({ message: 'Librarian not found' });
    }
    
    // // Ensure user is actually an admin/librarian
    // if (librarian.role !== 'admin') {
    //   return res.status(400).json({ message: 'User is not a librarian' });
    // }
    
    // Delete the librarian
    await librarian.destroy();
    
    res.status(200).json({ message: 'Librarian deleted successfully' });
  } catch (error) {
    next(error);
  }
};