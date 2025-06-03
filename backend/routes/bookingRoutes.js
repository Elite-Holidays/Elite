import express from 'express';
import { createBooking, getAllBookings, getBookingById, updateBookingStatus, getBookingsByEmail } from '../controllers/bookingController.js';

const router = express.Router();

// Public route for creating bookings
router.post('/', createBooking);

// User route for getting their bookings
router.get('/user/:email', getBookingsByEmail);

// Admin routes for managing bookings
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.patch('/:id', updateBookingStatus);

export default router;
