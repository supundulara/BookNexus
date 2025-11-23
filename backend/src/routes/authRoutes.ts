import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile,
  updateUserProfile, 
  getAllUsers,
  deleteLibrarian,
  registerStudent,
  loginStudent,
  getAllStudents,
  deleteStudent
} from '../controllers/authController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/users', protect, getAllUsers);
router.delete('/librarians/:id', protect, admin, deleteLibrarian);

// Student routes
router.post('/students/register', protect, admin, registerStudent);
router.post('/students/login', loginStudent);
router.get('/students', protect, admin, getAllStudents);
router.delete('/students/:id', protect, admin, deleteStudent);

export default router;