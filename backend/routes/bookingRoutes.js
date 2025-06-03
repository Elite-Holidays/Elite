const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware);

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBookingById)
  .patch(bookingController.updateBookingStatus);

module.exports = router;
