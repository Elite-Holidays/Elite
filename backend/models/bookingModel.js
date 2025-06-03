const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!']
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking must have a date!']
  },
  numberOfPeople: {
    type: Number,
    required: [true, 'Booking must have number of people!'],
    min: 1
  },
  specialRequirements: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// Add indexes for better query performance
bookingSchema.index({ tour: 1, user: 1 });
bookingSchema.index({ bookingDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
