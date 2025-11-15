import express from 'express';
import * as bookController from '../controllers/bookController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', bookController.getBooks);
router.get('/search', bookController.searchBooks);
router.get('/ai-search', bookController.searchBooksWithAI); // Specific route first
router.get('/my-checkouts', protect, bookController.getMyCheckouts); // Student checkouts
router.get('/:id/summary', bookController.getBookSummary); // Put routes with parameters after
router.get('/:id/checkouts', protect, admin, bookController.getBookCheckouts); // Book's current checkouts
router.get('/:id/checkout-history', protect, admin, bookController.getBookCheckoutHistory); // Book's checkout history
router.get('/:id', bookController.getBookById); // Catch-all route should be last

// Protected admin routes with file upload
router.post('/', protect, admin, upload.single('coverImage'), bookController.createBook);
router.put('/:id', protect, admin, upload.single('coverImage'), bookController.updateBook);
router.delete('/:id', protect, admin, bookController.deleteBook);

// Checkout routes
router.post('/:id/checkout', protect, admin, bookController.checkoutBook);
router.put('/:id/return', protect, admin, bookController.returnBook);

export default router;