import Booking from '../models/bookingModel.js';
import catchAsync from '../utils/catchAsync.js';

// Create a new booking
export const createBooking = catchAsync(async (req, res) => {
  const { tourId, bookingDate, numberOfPeople, specialRequirements, fullName, email, phone } = req.body;

  // Create a booking without requiring a user ID
  const booking = await Booking.create({
    tour: tourId,
    bookingDate,
    numberOfPeople,
    specialRequirements,
    fullName,
    email,
    phone,
    status: 'pending',
    createdAt: new Date()
  });

  res.status(201).json({
    status: 'success',
    data: booking
  });
});

// Get all bookings for admin dashboard
export const getAllBookings = catchAsync(async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'tour',
        select: 'title price location' // Updated field names to match TravelPackage model
      })
      .sort({ createdAt: -1 }); // Sort by most recent first
    
    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// Get booking by ID
export const getBookingById = catchAsync(async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'tour',
        select: 'title price location description images' // Updated field names to match TravelPackage model
      });

    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'No booking found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching booking details',
      error: error.message
    });
  }
});

// Update booking status
export const updateBookingStatus = catchAsync(async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate({
        path: 'tour',
        select: 'title price location' // Updated field names to match TravelPackage model
      });

    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating booking status',
      error: error.message
    });
  }
});

// Get bookings by user email
export const getBookingsByEmail = catchAsync(async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email is required'
      });
    }
    
    const bookings = await Booking.find({ email })
      .populate({
        path: 'tour',
        select: 'title price location description images'
      })
      .sort({ createdAt: -1 }); // Sort by most recent first
    
    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user bookings',
      error: error.message
    });
  }
});
