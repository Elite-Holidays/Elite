import Tour from '../models/tourModel.js';
import User from '../models/';
import Booking from '../models/bookingModel.js';
import catchAsync from '../utils/catchAsync.js';


// Create a new booking
exports.createBooking = catchAsync(async (req, res) => {
  const { tourId, userId, bookingDate, numberOfPeople, specialRequirements } = req.body;

  const booking = await Booking.create({
    tour: tourId,
    user: userId,
    bookingDate,
    numberOfPeople,
    specialRequirements,
    status: 'pending',
    createdAt: new Date()
  });

  res.status(201).json({
    status: 'success',
    data: booking
  });
});

// Get all bookings for admin dashboard
exports.getAllBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find()
    .populate({
      path: 'tour',
      select: 'name price duration location'
    })
    .populate({
      path: 'user',
      select: 'name email phone'
    });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: bookings
  });
});

// Get booking by ID
exports.getBookingById = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate({
      path: 'tour',
      select: 'name price duration location description images'
    })
    .populate({
      path: 'user',
      select: 'name email phone address'
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
});

// Update booking status
exports.updateBookingStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  )
    .populate({
      path: 'tour',
      select: 'name price duration location'
    })
    .populate({
      path: 'user',
      select: 'name email phone'
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
});
