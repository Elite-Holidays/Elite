import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'TravelPackage',
    required: [true, 'Booking must belong to a Travel Package!']
  },
  // Customer information
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  // Optional user reference if logged in
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
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

export default Booking;
