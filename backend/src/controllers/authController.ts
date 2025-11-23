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

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.user?.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, currentPassword, newPassword } = req.body;

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update password if provided
    if (newPassword) {
      // Verify current password
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }

      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      user.password = newPassword;
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
    });

    res.json(updatedUser);
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
    
    // Use Sequelize's findAll method to get only admin users (librarians)
    const users = await User.findAll({
      where: { role: 'admin' },
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

// @desc    Register a new student (admin only)
// @route   POST /api/auth/students/register
// @access  Private/Admin
export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      registrationNumber, 
      password,
      faculty,
      courseOfStudy,
      intakeBatch,
      indexNumber,
      title,
      lastName,
      nameWithInitials,
      gender
    } = req.body;

    // Check if student with registration number exists
    const studentExists = await User.findOne({ where: { registrationNumber } });

    if (studentExists) {
      return res.status(400).json({ message: 'Student with this registration number already exists' });
    }

    // Create student
    const student = await User.create({
      name,
      registrationNumber,
      email: null,
      password,
      role: 'student',
      faculty,
      courseOfStudy,
      intakeBatch,
      indexNumber,
      title,
      lastName,
      nameWithInitials,
      gender
    });

    if (student) {
      res.status(201).json({
        id: student.id,
        name: student.name,
        registrationNumber: student.registrationNumber,
        role: student.role,
        faculty: student.faculty,
        courseOfStudy: student.courseOfStudy,
        intakeBatch: student.intakeBatch,
        indexNumber: student.indexNumber,
        title: student.title,
        lastName: student.lastName,
        nameWithInitials: student.nameWithInitials,
        gender: student.gender
      });
    } else {
      res.status(400).json({ message: 'Invalid student data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Student login with registration number
// @route   POST /api/auth/students/login
// @access  Public
export const loginStudent = async (req: Request, res: Response) => {
  try {
    const { registrationNumber, password } = req.body;

    // Check for student
    const student = await User.findOne({ where: { registrationNumber, role: 'student' } });

    if (student && (await student.comparePassword(password))) {
      res.json({
        id: student.id,
        name: student.name,
        registrationNumber: student.registrationNumber,
        role: student.role,
        faculty: student.faculty,
        courseOfStudy: student.courseOfStudy,
        intakeBatch: student.intakeBatch,
        indexNumber: student.indexNumber,
        title: student.title,
        lastName: student.lastName,
        nameWithInitials: student.nameWithInitials,
        gender: student.gender,
        token: generateToken(student.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid registration number or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all students (admin only)
// @route   GET /api/auth/students
// @access  Private/Admin
export const getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Only admins can access this endpoint
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }
    
    const students = await User.findAll({
      where: { role: 'student' },
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a student
// @route   DELETE /api/auth/students/:id
// @access  Private/Admin
export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Student ID is required' });
    }
    const studentId = parseInt(req.params.id);
    
    const student = await User.findByPk(studentId);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    if (student.role !== 'student') {
      return res.status(400).json({ message: 'User is not a student' });
    }
    
    await student.destroy();
    
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    next(error);
  }
};